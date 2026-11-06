import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import {
  buildCarrierEvents, classifyTrackingEvent, lookupOrderTracking,
  parseCarrierTimestamp, TrackingUnavailableError,
} from '../src/lib/order-tracking.ts';

const originalFetch = globalThis.fetch;
const originalEnv = { CJ_API_KEY: process.env.CJ_API_KEY, CJ_ACCESS_TOKEN: process.env.CJ_ACCESS_TOKEN };
afterEach(() => {
  globalThis.fetch = originalFetch;
  for (const [key,value] of Object.entries(originalEnv)) {
    if (value === undefined) delete process.env[key]; else process.env[key] = value;
  }
});

test('only explicit van dispatch or customer delivery can advance the journey', () => {
  const cases = {
    PROCESSING: ['Label created', 'Shipment information received', 'Awaiting your parcel', 'Parcel packed and ready for outbound shipping'],
    IN_TRANSIT: ['Arrived Courier Facility', 'Received by local delivery company', 'Arrived at delivery depot',
      'At local distribution centre', 'Handed to courier', 'With courier', 'Delivered to delivery partner',
      'Delivered to local delivery company', 'Delivered at service centre', 'Delivered to collection point',
      'Delivered back to sender', 'Delivered to warehouse', 'Delivered to post office', 'Delivery attempted', 'Delivery failed',
      'Not yet delivered', 'Expected to be delivered tomorrow', 'Delivered tomorrow', 'Out for delivery tomorrow',
      'Not out for delivery', 'Awaiting collection', 'Export customs clearance completed', 'Undelivered'],
    OUT_FOR_DELIVERY: ['Out for delivery', 'On vehicle for delivery', 'With your delivery driver', 'Loaded onto the delivery van'],
    DELIVERED: ['Delivered', 'Delivered to recipient', 'Item has been delivered', 'Successfully delivered',
      'Signed for by recipient', 'Delivered to your safe place', 'Delivery completed'],
  };
  for (const [stage, messages] of Object.entries(cases)) {
    for (const message of messages) assert.equal(classifyTrackingEvent(message), stage, message);
  }
});

test('scan dates are validated and ordered independently of the server timezone', () => {
  assert.equal(parseCarrierTimestamp('2026-11-05 11:56:22'), Date.UTC(2026,10,5,11,56,22));
  assert.equal(parseCarrierTimestamp('2026-11-05T11:56:22+08:00'), Date.UTC(2026,10,5,3,56,22));
  for (const date of ['2026-02-30 12:00:00', '2026-11-05 25:00:00', '2026-11-05T11:56:22+99:00', 'bad date']) {
    assert.equal(parseCarrierTimestamp(date), null, date);
  }
  const scans = buildCarrierEvents({ trackEvent: [
    { activity:'Out for delivery', eventTime:'2026-11-04 09:00:00', location:'London' },
    { activity:'Delivery attempted', eventTime:'2026-11-05 10:00:00', location:'London' },
    { activity:'Delivered', eventTime:'2026-12-01 10:00:00', location:'London' },
    { activity:'Delivery attempted', eventTime:'2026-11-05 10:00:00', location:'London' },
    { activity:'Delivered', eventTime:'bad date', location:'London' },
  ] }, null, Date.UTC(2026,10,6));
  assert.equal(scans.length,2);
  assert.equal(scans[0].stage,'IN_TRANSIT');
  assert.equal(scans[0].description,'London');
});

const barcode = 'TEST123456789GB';
const fakeOrder = { id:'test-order-id', ref:'#9999', created_at:1577836800, customer_city:'Test City',
  customer_country:{name:'United Kingdom'}, deliveries:[{tracking_number:barcode}], variants:[] };
const cjScan = (remark,acceptTime='2020-01-02 12:00:00') => ({remark,acceptTime,acceptAddress:'GB'});
const hyperScan = (eventThing,eventTime='2020-01-02 12:00:00') => ({eventThing,eventTime,place:'GB'});

function mockProviders({cj=[],hyper=null,orders=[],failCJ=false,failHyper=false,xpagePage}={}) {
  process.env.CJ_ACCESS_TOKEN='test-only-token';
  const calls=[];
  globalThis.fetch=async(input,init={})=>{
    const url=new URL(String(input)); calls.push({url,init});
    assert.equal(init.cache,'no-store');
    if(url.hostname==='api.myxpage.shop') {
      const page=Number(url.searchParams.get('page')||1);
      return Response.json(xpagePage ? xpagePage(page,url.searchParams.get('search')) : {orders,paginator:{lastPage:1}});
    }
    if(url.hostname==='developers.cjdropshipping.com') {
      if(failCJ) return new Response('Provider unavailable',{status:503});
      return Response.json({result:true,data:cj});
    }
    if(url.hostname==='track.hypersku.com') {
      if(failHyper) throw new Error('Network unavailable');
      return Response.json({retCode:'100',retInfo:hyper || {}});
    }
    throw new Error('Unexpected destination '+url.hostname);
  };
  return calls;
}

test('official CJ routes resolve a CJ barcode to the returned last-mile barcode',async()=>{
  mockProviders({cj:[{trackingNumber:'GV000000001GB',lastTrackNumber:'GV000000001GB',lastMileCarrier:'Royal Mail',trackingStatus:'Arrived Courier Facility',routes:[cjScan('Received by local delivery company')]}]});
  const result=await lookupOrderTracking(barcode);
  assert.equal(result.statusCode,'IN_TRANSIT');
  assert.equal(result.timeline.length,1);
  assert.match(result.carrierTrackingUrl,/GV000000001GB/);
  assert.deepEqual(result.items,[]);
});

test('provider outages never generate scans or advance an old order',async()=>{
  mockProviders({orders:[fakeOrder],failCJ:true,failHyper:true});
  const result=await lookupOrderTracking('#9999');
  assert.equal(result.statusCode,'UNAVAILABLE');
  assert.equal(result.activeStepIndex,-1);
  assert.deepEqual(result.timeline,[]);
  assert.deepEqual(result.items,[]);
});

test('unknown parcels distinguish provider failure from not-found',async()=>{
  mockProviders({failCJ:true,failHyper:true});
  await assert.rejects(lookupOrderTracking(barcode),TrackingUnavailableError);
  mockProviders();
  assert.equal(await lookupOrderTracking(barcode),null);
});

test('unmatched provider and order search results are never reused',async()=>{
  mockProviders({orders:[fakeOrder],cj:[{trackingNumber:'OTHER12345678GB'},{trackingNumber:'OTHER87654321GB'}],
    hyper:{OTHER12345678GB:{finalNo:'OTHER12345678GB',status:1,flow_0:[hyperScan('Delivered')]}}});
  assert.equal(await lookupOrderTracking('MISSING123456789GB'),null);
});

test('HyperSKU depot scans override a misleading delivered summary; hidden references remain hidden',async()=>{
  mockProviders({failCJ:true,orders:[fakeOrder],hyper:{[barcode]:{finalNo:barcode,status:1,
    express_company_info_to:{enName:'Royal Mail'},flow_0:[hyperScan('Arrived at local delivery depot')]}}});
  const result=await lookupOrderTracking(barcode);
  assert.equal(result.statusCode,'IN_TRANSIT');
  assert.equal(result.carrierName,'Royal Mail');
  assert.equal(result.orderRef,'');
  assert.equal(result.estimatedDelivery,'');
});

test('later failed delivery scan supersedes a previous van scan across HyperSKU legs',async()=>{
  mockProviders({hyper:{[barcode]:{finalNo:barcode,status:4,
    flow_1:[hyperScan('Out for delivery','2020-01-02 08:00:00')],
    flow_0:[hyperScan('Delivery attempted','2020-01-02 16:00:00')]}}});
  const result=await lookupOrderTracking(barcode);
  assert.equal(result.statusCode,'IN_TRANSIT');
  assert.match(result.timeline[0].title,/attempted/);
});

test('a newer exact-matched HyperSKU scan is not hidden by older CJ checkpoints',async()=>{
  mockProviders({cj:[{trackingNumber:barcode,routes:[cjScan('Arrived Courier Facility','2020-01-01 12:00:00')]}],
    hyper:{[barcode]:{finalNo:barcode,status:2,flow_1:[hyperScan('Out for delivery','2020-01-02 08:00:00')]}}});
  const result=await lookupOrderTracking(barcode);
  assert.equal(result.statusCode,'OUT_FOR_DELIVERY');
  assert.equal(result.timeline.length,2);
});

test('future or malformed delivered scans do not fall back to a delivered summary',async()=>{
  mockProviders({orders:[fakeOrder],cj:[{trackingNumber:barcode,trackingStatus:'Delivered',routes:[cjScan('Delivered','2099-01-01 12:00:00')]}]});
  const result=await lookupOrderTracking(barcode);
  assert.equal(result.statusCode,'UNAVAILABLE');
  assert.deepEqual(result.timeline,[]);
});

test('only an explicit final delivery scan completes the stepper and delivered date',async()=>{
  mockProviders({cj:[{trackingNumber:barcode,routes:[cjScan('Delivered to recipient')]}]});
  const result=await lookupOrderTracking(barcode);
  assert.equal(result.statusCode,'DELIVERED');
  assert.equal(result.activeStepIndex,4);
  assert.match(result.estimatedDelivery,/02 Jan 2020/);
});

test('live order pagination handles API page-size caps and never chooses the first unrelated order',async()=>{
  const calls=mockProviders({xpagePage:(page,search)=>({orders:search?[]:page===3?[{...fakeOrder,deliveries:[]}]:[{...fakeOrder,id:'other',ref:'#1',deliveries:[]}],paginator:{lastPage:3}})});
  const result=await lookupOrderTracking('#9999');
  assert.equal(result.orderRef,'#9999');
  assert.equal(result.statusCode,'PROCESSING');
  assert.deepEqual(result.timeline,[]);
  assert.ok(calls.some(c=>c.url.searchParams.get('page')==='3'));
  assert.ok(calls.every(c=>c.url.hostname==='api.myxpage.shop'));
});

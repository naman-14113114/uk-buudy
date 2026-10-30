import { test } from 'node:test';
import assert from 'node:assert/strict';
import { emptyCart, ensureProductInCart, upsertProductCartLines } from '../src/lib/cart';
import { getProductById } from '../src/data/products';
import { buildFastWhopCheckoutUrl } from '../src/lib/checkout';

const mask = getProductById('buudy-led-mask')!;
const cart = (quantity = 1) => ({ ...emptyCart, lines: upsertProductCartLines([], mask, quantity) });

test('rapid repeated adds through any button keep one mask and one set of gift lines', () => {
  let state = { ...emptyCart };
  for (let click = 0; click < 25; click++) state = ensureProductInCart(state, mask);
  assert.equal(state.lines.filter(l => l.type === 'product').length, 1);
  assert.equal(state.lines.find(l => l.type === 'product')?.quantity, 1);
  assert.ok(state.lines.filter(l => l.type === 'gift').every(l => l.quantity === 1));
  assert.equal(new Set(state.lines.map(l => l.id)).size, state.lines.length);
});
test('adding again preserves a deliberate cart quantity and the same state object', () => {
  const state = cart(2);
  assert.equal(ensureProductInCart(state, mask), state);
  assert.equal(ensureProductInCart(state, mask, 2), state);
});
test('explicit product quantity is applied once, without a loop of increments', () => {
  const state = ensureProductInCart({ ...emptyCart }, mask, 3);
  assert.equal(state.lines.find(l => l.type === 'product')?.quantity, 3);
  assert.equal(ensureProductInCart(state, mask, 3), state);
  assert.deepEqual(ensureProductInCart({ ...emptyCart }, mask, NaN), emptyCart);
});
test('mask checkout goes straight to the exact Whop quantity with an explicit coupon choice', () => {
  for (const quantity of [1, 2]) for (const promo of ['', 'BUUDY10']) {
    const url = new URL(buildFastWhopCheckoutUrl(cart(quantity).lines, promo ? [promo] : [], {})!);
    assert.equal(url.origin, 'https://buudy.com');
    assert.equal(url.pathname, '/checkout/plan_IY6bXASo3Gh15');
    assert.equal(url.searchParams.get('quantity'), String(quantity));
    assert.equal(url.searchParams.get('items'), `plan_IY6bXASo3Gh15:${quantity}`);
    assert.equal(url.searchParams.has('promoCode'), true);
    assert.equal(url.searchParams.get('promoCode'), promo);
  }
});
test('included gift offer and landing aliases do not prevent the direct Whop checkout', () => {
  const url = new URL(buildFastWhopCheckoutUrl([{productId:'buudy-mask-lp-7-colour',quantity:1,type:'product'}], ['GLOWKIT','buudy10'], {})!);
  assert.equal(url.searchParams.get('promoCode'), 'BUUDY10');
  assert.equal(url.searchParams.get('quantity'), '1');
});
test('adding a product preserves the existing discount and gift message', () => {
  const state = {...emptyCart, manualPromoCode:'BUUDY10',manualPromoCodes:['BUUDY10'],giftMessage:'A gift'};
  const added = ensureProductInCart(state, mask);
  assert.equal(added.manualPromoCode, 'BUUDY10');
  assert.deepEqual(added.manualPromoCodes, ['BUUDY10']);
  assert.equal(added.giftMessage, 'A gift');
});
test('fast checkout preserves campaign attribution without passing private or internal fields', () => {
  const url = new URL(buildFastWhopCheckoutUrl(cart().lines, [], {utm_source:'bing',msclkid:'qa-test',email:'private@example.com',checkout_path:'/cart?email=private@example.com',checkout_referrer:'https://internal.invalid',unexpected:'secret'})!);
  assert.equal(url.searchParams.get('utm_source'), 'bing');
  assert.equal(url.searchParams.get('msclkid'), 'qa-test');
  assert.ok(!url.toString().includes('private'));
  assert.equal(url.searchParams.has('unexpected'), false);
});
test('unsupported carts, discounts and invalid quantities keep the validated server path', () => {
  assert.equal(buildFastWhopCheckoutUrl([], [], {}), null);
  assert.equal(buildFastWhopCheckoutUrl([{productId:'buudy-ipl-device',quantity:1,type:'product'}], [], {}), null);
  assert.equal(buildFastWhopCheckoutUrl([...cart().lines,{productId:'buudy-gift-card',quantity:1,type:'product'}], [], {}), null);
  assert.equal(buildFastWhopCheckoutUrl(cart().lines, ['9PQ28ENBLJ'], {}), null);
  for(const quantity of [0, -1, 1.5, 101, NaN]) assert.equal(buildFastWhopCheckoutUrl([{productId:mask.id,quantity,type:'product'}], [], {}), null);
});

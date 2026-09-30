import assert from "node:assert/strict";
import { test } from "node:test";
import {
  getMaskLandingPage,
  maskLandingPages,
  normalizeCheckoutProductIds,
  resolveCheckoutProductId,
} from "../src/lib/maskLandingPages.ts";

test("each requested URL has a unique landing ID and keeps the same checkout product", () => {
  assert.equal(maskLandingPages.length, 4);
  assert.equal(new Set(maskLandingPages.map((landing) => landing.id)).size, 4);
  for (const landing of maskLandingPages) {
    assert.equal(getMaskLandingPage(`/products/${landing.slug}`)?.id, landing.id);
    assert.equal(getMaskLandingPage(`/products/${landing.slug}/`)?.id, landing.id);
    assert.equal(resolveCheckoutProductId(landing.id), "buudy-led-mask");
    assert.equal(resolveCheckoutProductId(landing.slug), "buudy-led-mask");
  }
});

test("unknown IDs and unrelated products do not become masks", () => {
  for (const id of ["buudy-red-torch", "buudy-ipl-device", "unknown-mask", "constructor", "BUUDY-MASK-LP-BEST-FACE-UK"]) {
    assert.equal(resolveCheckoutProductId(id), id);
  }
  for (const path of ["/", "/products/red-light-torch", "/products/best-led-face-mask-extra"]) {
    assert.equal(getMaskLandingPage(path), undefined);
  }
});

test("normalization preserves quantities, gift flags and extra line data without mutating the cart", () => {
  const original = [
    { productId: "buudy-mask-lp-best-face-uk", quantity: 2, type: "product", source: "first" },
    { productId: "best-led-mask-in-uk", quantity: 3, type: "product", source: "second" },
    { productId: "buudy-led-face-mask", quantity: 2, type: "gift", source: "gift" },
    { productId: "buudy-red-torch", quantity: 1, type: "product", source: "torch" },
  ];
  const snapshot = structuredClone(original);
  const normalized = normalizeCheckoutProductIds(original);
  assert.deepEqual(original, snapshot);
  assert.deepEqual(normalized.map((line) => line.productId), [
    "buudy-led-mask", "buudy-led-mask", "buudy-led-mask", "buudy-red-torch",
  ]);
  for (let index = 0; index < original.length; index++) {
    const { productId, ...remaining } = normalized[index];
    const { productId: originalId, ...originalRemaining } = original[index];
    assert.deepEqual(remaining, originalRemaining);
    assert.notEqual(normalized[index], original[index]);
    assert.ok(productId && originalId);
  }
  assert.equal(normalized.filter((line) => line.type !== "gift" && line.productId === "buudy-led-mask")
    .reduce((total, line) => total + line.quantity, 0), 5);
});

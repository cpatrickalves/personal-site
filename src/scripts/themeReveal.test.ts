import assert from "node:assert/strict";
import { test } from "node:test";
import { revealRadius, shouldReveal } from "./themeReveal.ts";

const allowed = {
  coloursChange: true,
  reducedMotion: false,
  supported: true,
  navigating: false,
};

test("C28 raio alcança o canto mais distante nas 4 posições", () => {
  assert.equal(revealRadius(0, 0, 300, 400), 500);
  assert.equal(revealRadius(300, 0, 300, 400), 500);
  assert.equal(revealRadius(0, 400, 300, 400), 500);
  assert.equal(revealRadius(300, 400, 300, 400), 500);
  assert.equal(revealRadius(100, 100, 400, 500), 500);
  assert.equal(shouldReveal(allowed), true);
});

test("C29 redução de movimento não revela", () => {
  assert.equal(shouldReveal({ ...allowed, reducedMotion: true }), false);
});

test("C30 sem mudança de cor não revela", () => {
  assert.equal(shouldReveal({ ...allowed, coloursChange: false }), false);
});

test("C31 sem a API não revela", () => {
  assert.equal(shouldReveal({ ...allowed, supported: false }), false);
});

test("C32 durante a navegação não revela", () => {
  assert.equal(shouldReveal({ ...allowed, navigating: true }), false);
});

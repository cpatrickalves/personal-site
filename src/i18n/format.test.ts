import { test } from "node:test";
import assert from "node:assert/strict";
import { formatDate } from "./format.ts";

const SAO_PAULO = "America/Sao_Paulo";

// 02:30 UTC on 1 March is still 28 February in São Paulo (UTC-3).
const nearMidnightUtc = "2026-03-01T02:30:00Z";

test("formats the date as YYYY-MM-DD in the São Paulo timezone", () => {
  assert.equal(formatDate(nearMidnightUtc, SAO_PAULO), "2026-02-28");
});

test("accepts a Date as well as an ISO string", () => {
  assert.equal(formatDate(new Date(nearMidnightUtc), SAO_PAULO), "2026-02-28");
});

test("keeps the UTC day when the timezone is UTC", () => {
  assert.equal(formatDate(nearMidnightUtc, "UTC"), "2026-03-01");
});

test("pads single-digit months and days", () => {
  assert.equal(formatDate("2026-01-05T12:00:00Z", SAO_PAULO), "2026-01-05");
});

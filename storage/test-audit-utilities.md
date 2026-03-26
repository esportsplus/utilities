# Test Audit: @esportsplus/utilities

## Summary

| Metric | Count |
|--------|-------|
| Source modules | 18 (excl. index.ts barrel, types.ts) |
| Tested modules | 18 (100%) |
| Benchmarked modules | 0 (0%) |
| Convention violations | 0 |
| Total gaps found | 8 |

**Infrastructure**: vitest 4.1.1, `pnpm test`, path alias `~` → `./src/`
**Test suite**: 16 files, 187 tests, all passing (728ms)


## Convention Violations

None. All test files in `tests/`, no `.test.ts`/`.spec.ts` suffixes, no colocated tests.


## Coverage Map

| Source Module | Test File | Exports Tested | Status |
|---------------|-----------|----------------|--------|
| src/bps.ts | tests/bps.ts | bps(), toDisplay(), toRaw() | FULL |
| src/chunk.ts | tests/chunk.ts | chunk() | FULL |
| src/constants.ts | tests/index.ts | EMPTY_ARRAY, EMPTY_OBJECT | FULL |
| src/debounce.ts | tests/debounce.ts | debounce() | FULL |
| src/encryption.ts | tests/encryption.ts | encrypt(), decrypt() | FULL |
| src/hash.ts | tests/hash.ts | hash(), hash.verify() | FULL |
| src/json.ts | tests/index.ts | parse, stringify, BigInt.toJSON | FULL |
| src/number.ts | tests/number.ts | abbreviate(), ordinal() | FULL |
| src/omit.ts | tests/omit.ts | omit() | FULL |
| src/pick.ts | tests/pick.ts | pick() | FULL |
| src/promise.ts | tests/promise.ts | host(), host.race(), host.retry() | FULL |
| src/request.ts | tests/request.ts | request(), request.url() | SHALLOW |
| src/sleep.ts | tests/sleep.ts | sleep() | FULL |
| src/slugify.ts | tests/slugify.ts | slugify() | SHALLOW |
| src/toArray.ts | tests/toArray.ts | toArray() | FULL |
| src/truncate.ts | tests/truncate.ts | center(), end(), start() | FULL |
| src/ulid.ts | tests/ulid.ts | generate(), isValid() | FULL |
| src/uuid.ts | tests/index.ts | uuid() | FULL |
| src/index.ts | tests/index.ts | 13 type guards, noop | PARTIAL |


## Missing Tests

| Module | Export | Type | Risk |
|--------|--------|------|------|
| src/index.ts | `defineProperty` | re-export | LOW — direct alias for `Object.defineProperty` |


## Shallow Tests

| Module | Export | Covered | Missing |
|--------|--------|---------|---------|
| src/request.ts | `request()` | GET, POST | PUT, PATCH, DELETE methods (share non-GET branch but untested directly) |
| src/slugify.ts | `slugify()` | ASCII chars, spaces, special chars | empty string, unicode input, leading dashes |
| src/number.ts | `ordinal()` | 1-4, 11-13, 21-22, 101 | 0, negative numbers |
| src/bps.ts | `bps()` | standard cases | bps param as string type (e.g. `bps(100, "500")`) |
| src/truncate.ts | `center()` | short passthrough, defaults, custom | exact boundary (length === prefix + suffix + 3) |


## Missing Benchmarks

| Module | Export | Reason |
|--------|--------|--------|
| src/hash.ts | `hash()` | SHA-256 + canonicalization in hot paths (auth, caching) |
| src/encryption.ts | `encrypt` / `decrypt` | PBKDF2 100k iterations — tuning baseline needed |
| src/bps.ts | `bps()` | Financial math — bigint vs number perf gap |
| src/ulid.ts | `generate()` | ID generation throughput |
| src/slugify.ts | `slugify()` | Regex-heavy string processing |
| src/omit.ts / src/pick.ts | `omit()` / `pick()` | Object manipulation scaling |
| src/chunk.ts | `chunk()` | Array slicing scaling |


## Stale Tests

None.


## Quality Checklist

- [x] Tests run in isolation (no order dependency)
- [x] No hardcoded paths/ports
- [x] Mocks cleaned up after each test (vi.restoreAllMocks, vi.useRealTimers)
- [x] Async operations properly awaited
- [x] Edge cases covered (boundaries, null/empty, error conditions)
- [x] Error paths tested (encryption, ulid, promise)
- [x] No console.log in tests
- [x] Fake timer lifecycle managed (beforeEach/afterEach)
- [ ] Intermittent EPERM on Windows — Vitest SSR cache file lock race (not a test issue)


## Recommendations

1. **LOW**: Add `defineProperty` test to `tests/index.ts` — trivial, just verify it's `Object.defineProperty`
2. **LOW**: Add request tests for PUT/PATCH/DELETE — they share the non-GET branch (body stringify, cors, no-referrer) but aren't tested directly
3. **LOW**: Add `slugify('')` and unicode tests — empty string and non-ASCII edge cases
4. **LOW**: Add `ordinal(0)` test — returns `'th'` via fallback; worth documenting
5. **LOW**: Add `bps(100, "500")` test — string-typed bps parameter converted via `BigInt()`
6. **MEDIUM**: Set up benchmark infrastructure (`tests/bench/`) for crypto and math-heavy modules
7. **INFO**: Windows EPERM intermittent failure is a known Vitest SSR cache race — consider adding `pool: 'forks'` or `fileParallelism: false` to vitest.config.ts if it becomes frequent

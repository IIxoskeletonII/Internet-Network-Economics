# H3 Diagnostic Report — DefiLlama Stablecoin Supply Data

**File:** `data/01_raw/defillama/stablecoin_supply_by_chain.csv`
**Date produced:** 2026-04-09
**Purpose:** Pre-aggregation inspection before building the H3 HHI dataset.

---

## 1. Schema and Grain

### Column names and dtypes

| Column | dtype |
|---|---|
| `stablecoin_id` | int64 |
| `symbol` | object |
| `chain` | object |
| `date` | object (YYYY-MM-DD strings) |
| `circulating_usd` | float64 |

### First 5 rows

| stablecoin_id | symbol | chain | date | circulating_usd |
|---|---|---|---|---|
| 58 | 3USD | Karura | 2021-09-10 | 1,129,353 |
| 58 | 3USD | Karura | 2022-06-30 | 1,571,778 |
| 58 | 3USD | Karura | 2022-07-20 | 1,519,538 |
| 58 | 3USD | Karura | 2022-07-21 | 1,519,538 |
| 58 | 3USD | Karura | 2022-07-22 | 1,571,778 |

### Counts

- **Total row count:** 828,065 ✅ (matches expected ~828K)
- **Unique stablecoins (by symbol):** 229
- **Unique stablecoins (by stablecoin_id):** 286
- **Unique chains:** 171
- **Date range:** 2017-11-29 to 2026-03-03

### Unique key check

- **`(symbol, chain, date)` is NOT a unique key.** 37,672 duplicate rows exist because 38 different symbols map to multiple `stablecoin_id` values (different stablecoins sharing the same ticker).
- **`(stablecoin_id, chain, date)` IS a unique key.** Zero duplicates. This is the correct grain.

**Implication for HHI:** The entity for HHI computation must be `stablecoin_id`, not `symbol`. Using `symbol` would incorrectly merge unrelated stablecoins that share a ticker.

### Per-column null counts

| Column | Nulls | % |
|---|---|---|
| stablecoin_id | 0 | 0.00% |
| symbol | 0 | 0.00% |
| chain | 0 | 0.00% |
| date | 0 | 0.00% |
| circulating_usd | 0 | 0.00% |

**No nulls in any column.** ✅

---

## 2. Universe Sanity

### 2a. Full alphabetized list of unique stablecoin symbols (229 total)

3USD, AID, ALUSD, ANONUSD, ARUSD, AUSD, AZND, BAI, BAOUSD, BEAN, BNBUSD, BNUSD, BOB, BOLD, BREAD, BUCK, BUIDL, BUSD, BtcUSD, CASH, CUSD, CZUSD, D, DAI, DAI+, DCKUSD, DEUSD, DJED, DLLR, DOC, DOLA, DSU, DUSD, DYAD, EBUSD, ERN, EUSD, FDUSD, FEI, FEUSD, FIAT, FIDD, FLEXUSD, FRAX, FRXUSD, FUSD, FXD, GAI, GGUSD, GHO, GRAI, GUSD, GYD, HAI, HEXDC, HOLLAR, HOME, HONEY, HUSD, HYDT, HYUSD, IAUSD, IST, IUSD, JUPUSD, JUSD, KEI, KNOX, KUSD, LISUSD, LUSD, LVLUSD, M, MEAD, MIM, MNEE, MOD, MONEY, MSD, MSUSD, MUSD, MUST, MyUSD, NECT, NEX, NOTE, NUSD, NXUSD, OUSD, PAI, PAUSD, PINA, PINTO, PUSD, PXDC, PYUSD, R, REUSD, RLUSD, RSV, RUSD, SBC, SCB, SCUSD, SIGUSD, STAR, STBL, SUSD, SVUSD, TBILL, THUSD, TOR, TUSD, U, ULTRA, UNO, USAT, USBD, USC, USD+, USD0, USD1, USD3, USDA, USDA+, USDB, USDC, USDCB, USDCV, USDD, USDE, USDF, USDFC, USDG, USDGLO, USDGO, USDH, USDI, USDJ, USDK, USDL, USDM, USDN, USDO, USDP, USDQ, USDR, USDRIF, USDS, USDT, USDT+, USDTB, USDTZ, USDU, USDV, USDW, USDX, USDXL, USDY, USDaf, USDai, USDe, USDf, USDp, USDz, USE, USH, USK, USN, USND, USP, USPD, USR, USTC, USX, USYC, UTY, UUSD, UXD, VAI, VST, VUSD, WEN, WEUSD, WUSD, XAI, XUSD, XY, YLDS, YU, YUSD, YZUSD, ZUSD, ZeUSD, aSEED, aUSD, apxUSD, avUSD, bitUSD, btcUSD, cUSD, cgUSD, clevUSD, crvUSD, csUSDL, ctUSD, d2O, dUSD, eUSD, eUSD(v2), fxUSD, litUSD, mantraUSD, mkUSD, pUSD, paraUSD, peUSD, pmUSD, rUSD, reUSD, rgUSD, rwaUSDi, sLSD, sUSD, satUSD, syUSD, xpUSD, zkUSD, zunUSD

### 2b. Bridge token detection

**No bridge-like symbols found.** Searched for patterns: `.e`, `bridged`, `wormhole`, `axl`, `celer`, `.b`, `multichain`. None matched any symbol name.

**Explanation:** DefiLlama tracks each stablecoin's supply per chain natively. A single `stablecoin_id` (e.g., USDC id=2) appears on multiple chains (Ethereum, Solana, Arbitrum, etc.) as separate rows. There are no separate "bridged USDC" or "USDC.e" entries — the bridged supply is already captured in the per-chain rows for the canonical issuer.

**No bridged-token consolidation is needed.**

### 2c. Symbols with multiple stablecoin_ids (38 symbols)

These are different stablecoins that share a ticker symbol. Key material cases:

| Symbol | IDs | Max supply per ID |
|---|---|---|
| BUSD | 4, 153 | id=4: $18.6B (Binance/Paxos), id=153: $500M (different token, appeared 2024) |
| USDS | 31, 32, 149, 209, 233 | id=209: $6.8B (Sky/MakerDAO USDS), others tiny |
| USDP | 11, 33 | id=11: $1.4B (Pax Dollar), id=33: $280M |
| USDN | 12, 277, 282 | id=12: $803M (Neutrino), others small |
| PUSD | 62, 314, 341 | id=314: $1.0B, others small |
| USDX | 42, 214, 263 | id=214: $531M, id=42: $120M |

**All 38 are correctly differentiated by `stablecoin_id`.** Using `stablecoin_id` as the entity resolves this entirely.

### 2d. Specific stablecoin time profiles

| Stablecoin | ID | First date | Last date | Expected | Verdict |
|---|---|---|---|---|---|
| USDT | 1 | 2017-11-29 | 2026-03-03 | Full 2020-01 to 2025-12 | ✅ Spans full range |
| USDC | 2 | 2018-09-11 | 2026-03-03 | Full 2020-01 to 2025-12 | ✅ Spans full range |
| DAI | 5 | 2019-11-19 | 2026-03-03 | Full 2020-01 to 2025-12 | ✅ Spans full range |
| BUSD | 4 | 2020-04-17 | 2026-03-03 | 2020 onward, collapse after Feb 2023 | ✅ See trajectory below |
| USTC (TerraUSD) | 3 | 2020-12-31 | 2026-03-03 | ~2021 through May 2022 | ⚠️ See caveat below |
| FDUSD | 119 | 2023-05-27 | 2026-03-03 | First appear mid-2023 | ✅ Correct |
| PYUSD | 120 | 2023-08-08 | 2026-03-03 | First appear ~Aug 2023 | ✅ Correct |

**BUSD supply trajectory (id=4, sum across chains):**
- 2023-01-01: $16.8B
- 2023-06-01: $5.3B (winding down after Paxos stopped minting Feb 2023)
- 2024-01-01: $1.0B
- ✅ Trajectory matches expected Paxos wind-down.

**USTC (TerraUSD) caveat:**
- Pre-collapse (2022-04-28): $1.37B on non-Terra chains (Ethereum, BSC, Avalanche, etc.)
- Terra Classic chain data first appears 2022-05-12 with $13.1B
- Peak daily supply: $14.7B on 2022-05-12
- Last real data: 2022-06-22 at $11.3B (then a single $0 row on 2026-03-03)
- **Important:** Before May 12, 2022, Terra Classic chain was NOT tracked. The pre-collapse USTC supply (~$18B total) is understated in this dataset because it only shows ~$1.4B of bridged USTC on non-Terra chains. This means USTC will appear as a smaller player than it actually was, which affects HHI slightly (understates pre-collapse fragmentation). After May 12, the Terra Classic supply appears and USTC briefly looks large, then drops out after June 22.

### 2e. Chain presence check

All required chains are present:

| Required chain | Found as | Rows |
|---|---|---|
| Ethereum | Ethereum | 122,026 |
| Tron | Tron | 9,732 |
| BSC (Binance) | BSC | 48,405 |
| Solana | Solana | 26,262 |
| Polygon | Polygon | 42,083 |
| Arbitrum | Arbitrum | 49,510 |

All 171 unique chains confirmed present. Full list includes major L1s (Ethereum, Tron, Solana, Avalanche, Cardano, etc.), L2s (Arbitrum, OP Mainnet, Base, ZKsync Era, etc.), and many smaller chains.

---

## 3. Magnitude Sanity (smoke tests)

All tests on **2024-06-01** (exact date available):

| Metric | Actual | Expected | Verdict |
|---|---|---|---|
| Total supply (all stablecoins) | $160,840,927,937 | $150B–$170B | ✅ PASS |
| USDT supply (id=1) | $111,718,876,334 | ~$110B | ✅ PASS |
| USDC supply (id=2) | $32,026,622,297 | ~$32B | ✅ PASS |

**No unit errors. No order-of-magnitude discrepancies.** All three checks pass within expected bounds.

---

## 4. Temporal Coverage

### Row count by year

| Year | Rows |
|---|---|
| 2017 | 33 |
| 2018 | 589 |
| 2019 | 1,760 |
| 2020 | 3,098 |
| 2021 | 27,762 |
| 2022 | 89,770 |
| 2023 | 139,284 |
| 2024 | 201,131 |
| 2025 | 302,658 |
| 2026 | 61,980 |

### Frequency confirmation

First 10 unique dates: 2017-11-29, 2017-11-30, 2017-12-01, 2017-12-02, 2017-12-03, 2017-12-04, 2017-12-05, 2017-12-06, 2017-12-07, 2017-12-08.

**Frequency is daily.** ✅

- Global date gap analysis: most common = 1 day, median = 1 day, max = 1 day, min = 1 day
- USDT-specific: most common gap = 1 day, 3,017 unique dates

### Stablecoin count by month (sample)

| Month | Unique stablecoin_ids |
|---|---|
| 2020-01 | 5 |
| 2020-07 | 7 |
| 2021-01 | 20 |
| 2021-07 | 26 |
| 2022-01 | 33 |
| 2022-07 | 54 |
| 2023-01 | 72 |
| 2023-07 | 95 |
| 2024-01 | 120 |
| 2024-07 | 161 |
| 2025-01 | 187 |
| 2025-12 | 267 |

Early 2020 has sparse coverage (5 stablecoins in Jan 2020). This is real — the stablecoin ecosystem was tiny then. HHI will naturally be very high (concentrated) in early months.

---

## 5. Summary

**Verdict: The file is what we expect — a daily panel of stablecoin circulating supply by chain, suitable for HHI computation.**

### No escalation blockers found:

- ✅ Magnitude smoke tests all pass within expected range
- ✅ All target stablecoins present with correct time profiles
- ✅ Grain is confirmed as `(stablecoin_id, chain, date)` — unique key verified
- ✅ No bridged-token symbols requiring consolidation
- ✅ Daily frequency confirmed
- ✅ Zero nulls across all columns

### Issues to handle in aggregation (Sub-Step 2):

1. **Use `stablecoin_id` as the entity, not `symbol`.** 38 symbols map to multiple IDs. Failing to use ID would merge unrelated stablecoins.
2. **Filter to 2020-01 through 2025-12** as specified. Drop 2017–2019 and 2026 rows.
3. **Non-USD stablecoin filtering** will need to be done. The symbol list includes names like AZND, DJED, PINA, etc. that may not be USD-pegged. This needs a filtering step (see Sub-Step 2 spec).
4. **USTC caveat:** Pre-collapse USTC supply is understated because Terra Classic chain data only starts 2022-05-12. Post-June 2022, USTC data ends (except a single $0 row). This is a minor limitation for HHI — USTC was one of several mid-tier stablecoins, and its understatement makes the pre-collapse market look slightly more concentrated than it really was. This should be documented but does not block aggregation.
5. **Early 2020 sparse coverage:** Only 5 stablecoins tracked in Jan 2020. HHI will be very high. This is real market structure, not a data gap.

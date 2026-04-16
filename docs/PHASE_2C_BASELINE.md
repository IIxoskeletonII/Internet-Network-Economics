# Phase 2C Baseline Snapshot — 2026-04-16

Captured immediately before opening Phase 2C work session, post-migration to `C:\dev\ine\`.

## Git state
- Branch: main
- Status: clean working tree (1 untracked: docs/REPO_FILE_AUDIT.md)
- HEAD: f65abb9 — Phase 3.1: environment setup and notebook scaffold
- Remote: in sync with origin/main

## Environment
- Python: 3.13.2 (venv at C:\dev\ine\venv)
- All core imports verified: pandas, numpy, statsmodels, linearmodels, arch, scipy, matplotlib, pycountry
- statsmodels DLL: working (ADF test runs cleanly)

## Master datasets
- h1_network_effects.csv: 4384 rows, 4 cols
- h2_diffusion_dataset.csv: 861 rows, 23 cols
- h3_concentration.csv: 72 rows, 7 cols
- h4_infrastructure_cost.csv: 72 rows, 12 cols
All byte-identical to old location's pre-migration versions.

## CoinMetrics raw inventory (definitive)
| File                      | Rows  | Assets                                       |
|---------------------------|-------|----------------------------------------------|
| active_addresses.csv      | 8768  | [dai, usdc_eth, usdt_eth, usdt_trx]          |
| transfer_count.csv        | 6576  | [usdc, usdt_eth, usdt_trx]  ← Phase 2B pull  |
| transfer_counts.csv       | 8768  | [dai, usdc_eth, usdt_eth, usdt_trx] ← Simone |
| eth_trx_price_usd.csv     | 4384  | [eth, trx]                                   |
| eth_fees.csv              | 2192  | [eth]            ← DEAD                       |
| supply.csv                | 8768  | [dai, usdc_eth, usdt_eth, usdt_trx] ← DEAD   |
| transaction_counts.csv    | 8768  | [dai, usdc_eth, usdt_eth, usdt_trx] ← DEAD   |
| trx_activity.csv          | 2192  | [trx]            ← DEAD                       |

## H1 reproducibility verification (4-date spot-check)
| Date       | H1 USDC | usdc_eth raw | match | H1 USDT | usdt_eth+trx | match |
|------------|---------|--------------|-------|---------|--------------|-------|
| 2020-01-01 | 1481    | 1481         | TRUE  | 28037   | 28037        | TRUE  |
| 2022-05-15 | 1030144 | 32778        | FALSE | 704678  | 704678       | TRUE  |
| 2023-03-10 | 255327  | 65111        | FALSE | 953663  | 953663       | TRUE  |
| 2025-12-31 | 2001557 | 275206       | FALSE | 1465896 | 1465896      | TRUE  |

USDC mismatches confirm H1 master uses multi-chain aggregate `usdc` series, which is NOT on disk in `active_addresses.csv`. This series must be re-pulled from CoinMetrics Community API in Phase 2C Task B.

USDT all match — fully reproducible.

## Old location
Renamed to: `C:\University\...\Project\Git Repo\Internet-Network-Economics-OLD-PRE-MOVE-20260415`
Preserved as backup. To be deleted after ~1 week of successful Phase 3 work.

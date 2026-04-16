# Raw Data Directory

This directory contains untouched outputs from APIs, scrapers, and public
data downloads. All CSV files are tracked in git for reproducibility.

## Directory Contents

### chainalysis/
Chainalysis Global Crypto Adoption Index (2020-2025). Six CSV files
extracted from annual PDF reports, manually corrected at Phase 2B
Checkpoints 1-2. These are the canonical source — do not re-extract
from PDFs. See `SOURCES.md` in this directory for PDF URLs.

PDFs (~86 MB total) are gitignored. Obtain from the URLs in `SOURCES.md`
if needed.

### coinmetrics/
CoinMetrics Community API exports (free, no authentication required).

| File | Description | Assets |
|------|-------------|--------|
| `active_addresses.csv` | Daily active addresses | dai, usdc (aggregate), usdc_eth, usdt_eth, usdt_trx |
| `transfer_count.csv` | Daily transfer counts (Phase 2B pull) | usdc (aggregate), usdt_eth, usdt_trx |
| `transfer_counts.csv` | Daily transfer counts (Simone's original Phase 1 pull) | dai, usdc_eth, usdt_eth, usdt_trx |
| `eth_trx_price_usd.csv` | Daily ETH and TRX prices in USD | eth, trx |

Note: `active_addresses.csv` contains both chain-level tickers (usdc_eth,
usdt_eth, usdt_trx, dai) from Phase 1 and the multi-chain aggregate
`usdc` ticker added in Phase 2C. The `usdc` aggregate can be re-pulled
using `scripts/pull_coinmetrics_usdc_active_addresses.py`.

### defillama/
DefiLlama Stablecoins API exports (public, no authentication).

| File | Description |
|------|-------------|
| `stablecoin_supply_by_chain.csv` | Monthly stablecoin supply by chain (828K rows) |
| `stablecoins_list.csv` | Stablecoin metadata (342 stablecoins) |

### etherscan/
Etherscan API USDC transfer samples on Ethereum (requires API key to re-pull).

| File | Description |
|------|-------------|
| `usdc_transfers_sample.csv` | ~1000 USDC transfers per month, 2020-2025 (72K rows) |

### tronscan/
Tronscan USDT transfer samples on Tron (bulk CSV export from web UI).

| File | Description |
|------|-------------|
| `usdt_transfers_sample.csv` | 20 USDT transfers per month, 2020-2025 (1440 rows) |

Sample size limitation (n=20/month) is documented in `docs/DATA_DICTIONARY.md`
under H4 Known Limitations.

### worldbank/
World Bank WDI and Global Findex indicators (public CSV downloads).

| File | Description |
|------|-------------|
| `all_indicators.csv` | GDP per capita, CPI, remittances, Findex (main pipeline input) |
| `remittance_cost_inbound_pct.csv` | Inbound remittance cost corridors (H4) |
| `remittance_cost_outbound_pct.csv` | Outbound remittance cost corridors (H4) |

### googletrends/ARCHIVE_preaudit/
Deprecated Google Trends data (replaced by Chainalysis at Phase 2B CP1).
Retained as audit trail evidence. Not used by any active pipeline.

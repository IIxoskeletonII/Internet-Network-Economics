# Stablecoins vs. Legacy Banking: An Empirical Network Economics Analysis

Empirical analysis of stablecoins as a substitute for legacy cross-border payment rails (SWIFT / correspondent banking), using 2020–2025 data across network effects, adoption diffusion, market concentration, and transaction cost dimensions.

## Research Question

**Can stablecoins replace the legacy correspondent-banking (SWIFT) network for cross-border value transfer?**

This project examines the question through four testable hypotheses grounded in network economics theory. A structural break at **November 2022** (FTX collapse) is used throughout to test pre/post-crisis resilience.

## Reproducing This Analysis

All raw data is included in the repository. To reproduce from existing data
(no API keys needed):

1. Clone the repository and create a virtual environment:
```bash
   git clone <repo-url>
   cd Internet-Network-Economics
   python -m venv venv
   source venv/bin/activate    # Windows: venv\Scripts\activate
   pip install -r requirements.txt
```

2. Run the data engineering notebook:
```bash
   jupyter lab
   # Open and run: notebooks/02_data_engineering.ipynb
```

3. Run the empirical analysis notebook:
```bash
   # Open and run: notebooks/03_empirical_analysis.ipynb
```

**Important:** Do NOT re-run `notebooks/01_data_validation_and_api.ipynb`.
It contains historical API calls that may produce different data, hit rate
limits, or require API keys. The raw data it produced is already committed
to the repository under `data/01_raw/`.

See `data/01_raw/README.md` for documentation of what each raw data file
contains and where it was sourced from.

## Hypotheses

| ID | Hypothesis | Test |
|----|-----------|------|
| **H1** | **Network effects (Metcalfe's Law):** stablecoin transfer activity scales super-linearly with active addresses (beta > 1) | Log-log OLS with Newey-West SE; Wald tests for beta = 1 and beta = 2 |
| **H2** | **Diffusion & institutional gaps:** crypto adoption accelerates in countries with weak banking infrastructure, strengthening post-Nov 2022 | Two-way fixed-effects country-year panel with country-clustered SE |
| **H3** | **Market concentration:** the stablecoin market exhibits winner-takes-all dynamics (rising HHI) | Monthly HHI trend test with Newey-West SE |
| **H4** | **Cost friction vs. legacy rails:** on-chain fees are orders of magnitude below legacy remittance costs | Parameterized cost comparison across three rails (ETH, TRX, SWIFT) |

## Repository Structure

```
Internet-Network-Economics/
├── README.md                          # This file
├── CLAUDE.md                          # Claude Code operating manual
├── AUDIT_REPORT.md                    # Phase 2 audit findings
├── Master_Recovery_Roadmap.md         # Authoritative plan for Phases 2B-5
├── requirements.txt                   # Pinned Python dependencies (pip freeze)
├── .gitignore                         # Excludes venv/, .env, presentations/, PDFs
├── .env                               # API keys (never committed)
│
├── data/
│   ├── 01_raw/                        # Untouched API/scraper outputs (mostly gitignored)
│   │   ├── chainalysis/               # Adoption index CSVs (tracked) + source PDFs (gitignored)
│   │   ├── coinmetrics/               # CoinMetrics Community API exports
│   │   ├── defillama/                 # DefiLlama stablecoin supply data
│   │   ├── etherscan/                 # USDC transfer samples from Etherscan API
│   │   ├── tronscan/                  # USDT transfer samples from Tronscan
│   │   ├── worldbank/                 # WDI and Findex indicator pulls
│   │   ├── yfinance/                  # DEPRECATED (replaced by CoinMetrics)
│   │   └── googletrends/              # DEPRECATED (replaced by Chainalysis)
│   ├── 02_intermediate/               # Cleaned atomic datasets + diagnostic reports
│   └── 03_processed/                  # Hypothesis-ready master datasets (4 files)
│       └── ARCHIVE/                   # Broken pre-audit masters (audit trail, gitignored)
│
├── notebooks/
│   ├── 01_data_validation_and_api.ipynb   # Phase 1: raw data collection and validation
│   ├── 02_data_engineering.ipynb          # Phase 2/2B: cleaning, transforms, master builds
│   └── 03_empirical_analysis.ipynb        # Phase 3: hypothesis tests and regressions
│
├── scripts/
│   ├── extract_chainalysis.py             # PDF table extraction (preserved; do not re-run)
│   ├── standardize_country_names.py       # ISO3 country name-to-code mapping module
│   ├── apply_chainalysis_standardization.py  # One-shot Chainalysis ISO3 standardization
│   ├── clean_worldbank_panel.py           # World Bank panel cleaning utility
│   ├── scrape_tronscan_expanded.py        # TronGrid API scraper (rate-limited; evidence)
│   └── patch_notebook_h4.py              # One-shot notebook cell surgery utility
│
├── docs/
│   ├── DATA_DICTIONARY.md                 # Column-level docs for all master datasets
│   ├── PHASE_2_FIX_LOG.md                # Audit remediation record (CP1-CP5)
│   ├── ISO3_MAPPING_REPORT.md            # Country name standardization audit trail
│   ├── PHASE_2B4_PLANNING.md             # H2 panel construction planning notes
│   ├── CHECKPOINT_[1-6]_REPORT.md        # Per-checkpoint working artifacts
│   └── REPO_CLEANUP_CHECKLIST.md         # Post-Phase 3 cleanup plan
│
├── dashboard/
│   └── app.py                            # Streamlit dashboard (Phase 5, not yet built)
│
├── outputs/
│   ├── figures/                          # PNG visualizations at 300+ DPI
│   └── tables/                           # CSV + LaTeX regression tables
│
└── presentations/                        # Slide decks (gitignored)
```

## Setup

**Requirements:** Python 3.13+ (developed on 3.13.2)

```bash
# Clone and create virtual environment
git clone <repo-url>
cd Internet-Network-Economics
python -m venv venv

# Activate (choose one)
source venv/bin/activate          # bash / macOS / Linux
venv\Scripts\Activate.ps1         # Windows PowerShell
venv\Scripts\activate.bat         # Windows cmd

# Install dependencies
pip install -r requirements.txt

# Create environment file (required for Etherscan API calls in notebook 01)
cp .env.example .env
# Then edit .env and add: ETHERSCAN_API_KEY=your_key_here
```

**Note:** The `.env` file is gitignored and must never be committed. It is only required if re-running `01_data_validation_and_api.ipynb` to re-fetch raw data from APIs.

**Note:** All raw data CSVs are committed to the repository. A fresh clone
contains everything needed to run notebooks 02 and 03 without any API keys.

**API keys required:** Only `ETHERSCAN_API_KEY` is required, and only if re-running notebook 01 to re-fetch Ethereum transaction samples. All other data sources are public/keyless:

- **CoinMetrics Community API:** no key
- **DefiLlama Stablecoins API:** no key
- **World Bank WDI and Global Findex:** public CSV downloads
- **Tronscan:** bulk CSV export from the web UI (no API key required)
- **Chainalysis reports:** public PDF downloads (manually extracted to CSVs; canonical version is in `data/01_raw/chainalysis/`)

## Pipeline Execution Order

The pipeline runs sequentially through three notebooks:

| Step | Notebook | Purpose | Inputs | Outputs |
|------|----------|---------|--------|---------|
| 1 | `01_data_validation_and_api.ipynb` | Raw data collection from APIs and initial validation | API keys in `.env` | `data/01_raw/*` |
| 2 | `02_data_engineering.ipynb` | Cleaning, standardization, joins, master dataset builds | `data/01_raw/*` | `data/02_intermediate/*`, `data/03_processed/*.csv` |
| 3 | `03_empirical_analysis.ipynb` | Hypothesis tests, regressions, figure generation | `data/03_processed/*.csv` | `outputs/figures/*`, `outputs/tables/*` |

**To reproduce from existing raw data** (no API keys needed): run notebooks 2 and 3 only.

**To reproduce from scratch** (requires API keys): run all three notebooks in order.

All notebooks are designed to run top-to-bottom on a fresh Jupyter kernel.

## Data Sources

| Raw Subfolder | Source | Coverage | Notes |
|--------------|--------|----------|-------|
| `chainalysis/` | Chainalysis Global Crypto Adoption Index (published PDFs) | 2020-2025, 130-157 countries/yr | PDFs manually extracted; CSVs canonical. See `data/01_raw/chainalysis/SOURCES.md` |
| `coinmetrics/` | CoinMetrics Community API | 2020-2025, daily | Transfer counts, active addresses, asset prices (ETH, TRX) |
| `defillama/` | DefiLlama Stablecoins API | 2020-2025, daily | Stablecoin supply by chain; used for H3 HHI computation |
| `etherscan/` | Etherscan API | 2020-2025, ~1000 txns/month | USDC transfer fee samples on Ethereum |
| `tronscan/` | Tronscan export | 2020-2025, 20 txns/month | USDT transfer fee samples on Tron (sample size limitation documented) |
| `worldbank/` | World Bank WDI + Global Findex | 2020-2025 (Findex: 2021/2024) | GDP per capita, CPI, remittances, financial account ownership |
| `yfinance/` | Yahoo Finance (DEPRECATED) | -- | Replaced by CoinMetrics after $83T USDC outlier discovery |
| `googletrends/` | Google Trends (DEPRECATED) | -- | No cross-sectional variation; replaced by Chainalysis |

## Master Datasets

Four hypothesis-ready datasets in `data/03_processed/`:

| File | Hypothesis | Grain | Rows | Date Range |
|------|-----------|-------|------|------------|
| `h1_network_effects.csv` | H1: Metcalfe's Law | asset x day | 4,384 | 2020-01-01 to 2025-12-31 |
| `h2_diffusion_dataset.csv` | H2: Diffusion | country x year | 861 | 2020 to 2025 |
| `h3_concentration.csv` | H3: Concentration | month | 72 | 2020-01 to 2025-12 |
| `h4_infrastructure_cost.csv` | H4: Cost friction | month | 72 | 2020-01 to 2025-12 |

See `docs/DATA_DICTIONARY.md` for full column-level documentation.

## Audit and Recovery Context

During Phase 2 closure, a systematic audit (`AUDIT_REPORT.md`) identified five critical data quality issues including $83T USDC volume outliers, an invalid H2 dependent variable, contaminated World Bank panels, missing H3 data, and Tron fee unit errors. These were repaired during Phase 2B (April 8-14, 2026) across six checkpoints on the `fixes/` branch. The full remediation record is in `docs/PHASE_2_FIX_LOG.md`.

## Status

**Phase 3 (empirical analysis) complete. Phase 4 (synthesis & deck) next.**

## Team

- Eliya Allam
- Simone Filosofi
- Mattia Cerrvelli


## License

Academic project -- MSc Data Science and Management, Internet and Network Economics module.

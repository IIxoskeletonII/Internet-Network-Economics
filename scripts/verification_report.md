# Dashboard verification report

- Repository: `C:\dev\ine`
- Total checks: **445**
- Pass: **445**  ·  Fail: **0**  ·  Skip: **0**

Tolerances: fee 1e-2 · ratio 1e-1 · regression coef 5e-3 · SE/CI 5e-2 · counts exact.

## Per-category summary

| Category | Total | Pass | Fail | Skip |
|---|---|---|---|---|
| DATA | 2 | 2 | 0 | 0 |
| H1_INLINE | 12 | 12 | 0 | 0 |
| H1_SPECS | 82 | 82 | 0 | 0 |
| H2_DESCRIPTIVE | 18 | 18 | 0 | 0 |
| H2_INLINE | 20 | 20 | 0 | 0 |
| H2_REGIONAL | 24 | 24 | 0 | 0 |
| H2_SPECS | 38 | 38 | 0 | 0 |
| H3_EVENTS | 15 | 15 | 0 | 0 |
| H3_INLINE | 8 | 8 | 0 | 0 |
| H3_SPECS | 48 | 48 | 0 | 0 |
| H3_TOP3 | 20 | 20 | 0 | 0 |
| H4_BREAKEVEN | 24 | 24 | 0 | 0 |
| H4_COST | 12 | 12 | 0 | 0 |
| H4_CROSSOVER | 12 | 12 | 0 | 0 |
| H4_SAVINGS | 24 | 24 | 0 | 0 |
| H4_SENSITIVITY | 16 | 16 | 0 | 0 |
| H4_SPECS | 56 | 56 | 0 | 0 |
| Synthesis | 14 | 14 | 0 | 0 |

## Full check ledger

| Status | Category | Label | Dashboard | Source | Δ | Tol | Ref |
|---|---|---|---|---|---|---|---|
| PASS | H4_COST | `eth.median` | `4.5908` | `4.5908` | +0 | 0.01 | tbl_h4_cost_comparison.csv |
| PASS | H4_COST | `eth.mean` | `14.9232` | `14.9232` | +0 | 0.01 | tbl_h4_cost_comparison.csv |
| PASS | H4_COST | `tron.median` | `0.0324` | `0.0324` | +0 | 0.01 | tbl_h4_cost_comparison.csv |
| PASS | H4_COST | `tron.mean` | `0.4511` | `0.4511` | +0 | 0.01 | tbl_h4_cost_comparison.csv |
| PASS | H4_COST | `legacy.s200.median` | `7.8024` | `7.8024` | +0 | 0.01 | tbl_h4_cost_comparison.csv |
| PASS | H4_COST | `legacy.s200.mean` | `8.3933` | `8.3933` | +0 | 0.01 | tbl_h4_cost_comparison.csv |
| PASS | H4_COST | `legacy.s10000.median` | `390.118` | `390.118` | +0 | 0.01 | tbl_h4_cost_comparison.csv |
| PASS | H4_COST | `legacy.s10000.mean` | `419.666` | `419.666` | +0 | 0.01 | tbl_h4_cost_comparison.csv |
| PASS | H4_COST | `ratios.s200_legacyMean_to_ethMean` | `0.56` | `0.56` | +0 | 0.1 | tbl_h4_cost_comparison.csv |
| PASS | H4_COST | `ratios.s200_legacyMean_to_tronMedian` | `259.41` | `259.41` | +0 | 0.1 | tbl_h4_cost_comparison.csv |
| PASS | H4_COST | `ratios.s10000_legacyMean_to_ethMean` | `28.12` | `28.12` | +0 | 0.1 | tbl_h4_cost_comparison.csv |
| PASS | H4_COST | `ratios.s10000_legacyMean_to_tronMedian` | `12970.3` | `12970.3` | +0 | 0.1 | tbl_h4_cost_comparison.csv |
| PASS | H4_SPECS | `full_eth_200.beta` | `-6.5299` | `-6.5299` | +0 | 0.005 | tbl_h4_master_summary.csv window='full (2020-01 to 2025-12)' dv='diff_200_eth' |
| PASS | H4_SPECS | `full_eth_200.se` | `4.213` | `4.213` | +0 | 0.05 | tbl_h4_master_summary.csv window='full (2020-01 to 2025-12)' dv='diff_200_eth' |
| PASS | H4_SPECS | `full_eth_200.lo` | `-14.787` | `-14.787` | +0 | 0.05 | tbl_h4_master_summary.csv window='full (2020-01 to 2025-12)' dv='diff_200_eth' |
| PASS | H4_SPECS | `full_eth_200.hi` | `1.728` | `1.728` | +0 | 0.05 | tbl_h4_master_summary.csv window='full (2020-01 to 2025-12)' dv='diff_200_eth' |
| PASS | H4_SPECS | `full_eth_200.n` | `72` | `72` | +0 | 0 | tbl_h4_master_summary.csv window='full (2020-01 to 2025-12)' dv='diff_200_eth' |
| PASS | H4_SPECS | `full_eth_200.hac` | `4` | `4` | +0 | 0 | tbl_h4_master_summary.csv window='full (2020-01 to 2025-12)' dv='diff_200_eth' |
| PASS | H4_SPECS | `full_eth_200.p_close` | `True` | `True` | — | 0 | tbl_h4_master_summary.csv window='full (2020-01 to 2025-12)' dv='diff_200_eth' |
| PASS | H4_SPECS | `full_eth_10k.beta` | `404.743` | `404.743` | +0 | 0.005 | tbl_h4_master_summary.csv window='full (2020-01 to 2025-12)' dv='diff_10000_eth' |
| PASS | H4_SPECS | `full_eth_10k.se` | `12.636` | `12.636` | +0 | 0.05 | tbl_h4_master_summary.csv window='full (2020-01 to 2025-12)' dv='diff_10000_eth' |
| PASS | H4_SPECS | `full_eth_10k.lo` | `379.976` | `379.976` | +0 | 0.05 | tbl_h4_master_summary.csv window='full (2020-01 to 2025-12)' dv='diff_10000_eth' |
| PASS | H4_SPECS | `full_eth_10k.hi` | `429.51` | `429.51` | +0 | 0.05 | tbl_h4_master_summary.csv window='full (2020-01 to 2025-12)' dv='diff_10000_eth' |
| PASS | H4_SPECS | `full_eth_10k.n` | `72` | `72` | +0 | 0 | tbl_h4_master_summary.csv window='full (2020-01 to 2025-12)' dv='diff_10000_eth' |
| PASS | H4_SPECS | `full_eth_10k.hac` | `4` | `4` | +0 | 0 | tbl_h4_master_summary.csv window='full (2020-01 to 2025-12)' dv='diff_10000_eth' |
| PASS | H4_SPECS | `full_eth_10k.p_close` | `True` | `True` | — | 0 | tbl_h4_master_summary.csv window='full (2020-01 to 2025-12)' dv='diff_10000_eth' |
| PASS | H4_SPECS | `full_tron_200.beta` | `8.2586` | `8.2586` | +0 | 0.005 | tbl_h4_master_summary.csv window='full (2020-01 to 2025-12)' dv='diff_200_tron' |
| PASS | H4_SPECS | `full_tron_200.se` | `0.25` | `0.25` | +0 | 0.05 | tbl_h4_master_summary.csv window='full (2020-01 to 2025-12)' dv='diff_200_tron' |
| PASS | H4_SPECS | `full_tron_200.lo` | `7.768` | `7.768` | +0 | 0.05 | tbl_h4_master_summary.csv window='full (2020-01 to 2025-12)' dv='diff_200_tron' |
| PASS | H4_SPECS | `full_tron_200.hi` | `8.749` | `8.749` | +0 | 0.05 | tbl_h4_master_summary.csv window='full (2020-01 to 2025-12)' dv='diff_200_tron' |
| PASS | H4_SPECS | `full_tron_200.n` | `72` | `72` | +0 | 0 | tbl_h4_master_summary.csv window='full (2020-01 to 2025-12)' dv='diff_200_tron' |
| PASS | H4_SPECS | `full_tron_200.hac` | `4` | `4` | +0 | 0 | tbl_h4_master_summary.csv window='full (2020-01 to 2025-12)' dv='diff_200_tron' |
| PASS | H4_SPECS | `full_tron_200.p_close` | `True` | `True` | — | 0 | tbl_h4_master_summary.csv window='full (2020-01 to 2025-12)' dv='diff_200_tron' |
| PASS | H4_SPECS | `full_tron_10k.beta` | `419.532` | `419.532` | +0 | 0.005 | tbl_h4_master_summary.csv window='full (2020-01 to 2025-12)' dv='diff_10000_tron' |
| PASS | H4_SPECS | `full_tron_10k.se` | `12.106` | `12.106` | +0 | 0.05 | tbl_h4_master_summary.csv window='full (2020-01 to 2025-12)' dv='diff_10000_tron' |
| PASS | H4_SPECS | `full_tron_10k.lo` | `395.804` | `395.804` | +0 | 0.05 | tbl_h4_master_summary.csv window='full (2020-01 to 2025-12)' dv='diff_10000_tron' |
| PASS | H4_SPECS | `full_tron_10k.hi` | `443.259` | `443.259` | +0 | 0.05 | tbl_h4_master_summary.csv window='full (2020-01 to 2025-12)' dv='diff_10000_tron' |
| PASS | H4_SPECS | `full_tron_10k.n` | `72` | `72` | +0 | 0 | tbl_h4_master_summary.csv window='full (2020-01 to 2025-12)' dv='diff_10000_tron' |
| PASS | H4_SPECS | `full_tron_10k.hac` | `4` | `4` | +0 | 0 | tbl_h4_master_summary.csv window='full (2020-01 to 2025-12)' dv='diff_10000_tron' |
| PASS | H4_SPECS | `full_tron_10k.p_close` | `True` | `True` | — | 0 | tbl_h4_master_summary.csv window='full (2020-01 to 2025-12)' dv='diff_10000_tron' |
| PASS | H4_SPECS | `dencun_eth_200.beta` | `0.8609` | `0.8609` | +0 | 0.005 | tbl_h4_master_summary.csv window='post-Dencun (Apr 2024 onwards, D-20)' dv='diff_200_eth' |
| PASS | H4_SPECS | `dencun_eth_200.se` | `2.769` | `2.769` | +0 | 0.05 | tbl_h4_master_summary.csv window='post-Dencun (Apr 2024 onwards, D-20)' dv='diff_200_eth' |
| PASS | H4_SPECS | `dencun_eth_200.lo` | `-4.567` | `-4.567` | +0 | 0.05 | tbl_h4_master_summary.csv window='post-Dencun (Apr 2024 onwards, D-20)' dv='diff_200_eth' |
| PASS | H4_SPECS | `dencun_eth_200.hi` | `6.288` | `6.288` | +0 | 0.05 | tbl_h4_master_summary.csv window='post-Dencun (Apr 2024 onwards, D-20)' dv='diff_200_eth' |
| PASS | H4_SPECS | `dencun_eth_200.n` | `21` | `21` | +0 | 0 | tbl_h4_master_summary.csv window='post-Dencun (Apr 2024 onwards, D-20)' dv='diff_200_eth' |
| PASS | H4_SPECS | `dencun_eth_200.hac` | `2` | `2` | +0 | 0 | tbl_h4_master_summary.csv window='post-Dencun (Apr 2024 onwards, D-20)' dv='diff_200_eth' |
| PASS | H4_SPECS | `dencun_eth_200.p_close` | `True` | `True` | — | 0 | tbl_h4_master_summary.csv window='post-Dencun (Apr 2024 onwards, D-20)' dv='diff_200_eth' |
| PASS | H4_SPECS | `dencun_eth_10k.beta` | `377.967` | `377.967` | +0 | 0.005 | tbl_h4_master_summary.csv window='post-Dencun (Apr 2024 onwards, D-20)' dv='diff_10000_eth' |
| PASS | H4_SPECS | `dencun_eth_10k.se` | `2.769` | `2.769` | +0 | 0.05 | tbl_h4_master_summary.csv window='post-Dencun (Apr 2024 onwards, D-20)' dv='diff_10000_eth' |
| PASS | H4_SPECS | `dencun_eth_10k.lo` | `372.54` | `372.54` | +0 | 0.05 | tbl_h4_master_summary.csv window='post-Dencun (Apr 2024 onwards, D-20)' dv='diff_10000_eth' |
| PASS | H4_SPECS | `dencun_eth_10k.hi` | `383.395` | `383.395` | +0 | 0.05 | tbl_h4_master_summary.csv window='post-Dencun (Apr 2024 onwards, D-20)' dv='diff_10000_eth' |
| PASS | H4_SPECS | `dencun_eth_10k.n` | `21` | `21` | +0 | 0 | tbl_h4_master_summary.csv window='post-Dencun (Apr 2024 onwards, D-20)' dv='diff_10000_eth' |
| PASS | H4_SPECS | `dencun_eth_10k.hac` | `2` | `2` | +0 | 0 | tbl_h4_master_summary.csv window='post-Dencun (Apr 2024 onwards, D-20)' dv='diff_10000_eth' |
| PASS | H4_SPECS | `dencun_eth_10k.p_lt_1e_15` | `True` | `True` | — | 0 | tbl_h4_master_summary.csv window='post-Dencun (Apr 2024 onwards, D-20)' dv='diff_10000_eth' |
| PASS | H4_SPECS | `dencun_tron_200.beta` | `7.6725` | `7.6725` | +0 | 0.005 | tbl_h4_master_summary.csv window='post-Dencun (Apr 2024 onwards, D-20)' dv='diff_200_tron' |
| PASS | H4_SPECS | `dencun_tron_200.se` | `0.007` | `0.007` | +0 | 0.05 | tbl_h4_master_summary.csv window='post-Dencun (Apr 2024 onwards, D-20)' dv='diff_200_tron' |
| PASS | H4_SPECS | `dencun_tron_200.lo` | `7.659` | `7.659` | +0 | 0.05 | tbl_h4_master_summary.csv window='post-Dencun (Apr 2024 onwards, D-20)' dv='diff_200_tron' |
| PASS | H4_SPECS | `dencun_tron_200.hi` | `7.685` | `7.685` | +0 | 0.05 | tbl_h4_master_summary.csv window='post-Dencun (Apr 2024 onwards, D-20)' dv='diff_200_tron' |
| PASS | H4_SPECS | `dencun_tron_200.n` | `21` | `21` | +0 | 0 | tbl_h4_master_summary.csv window='post-Dencun (Apr 2024 onwards, D-20)' dv='diff_200_tron' |
| PASS | H4_SPECS | `dencun_tron_200.hac` | `2` | `2` | +0 | 0 | tbl_h4_master_summary.csv window='post-Dencun (Apr 2024 onwards, D-20)' dv='diff_200_tron' |
| PASS | H4_SPECS | `dencun_tron_200.p_lt_1e_15` | `True` | `True` | — | 0 | tbl_h4_master_summary.csv window='post-Dencun (Apr 2024 onwards, D-20)' dv='diff_200_tron' |
| PASS | H4_SPECS | `dencun_tron_10k.beta` | `384.779` | `384.779` | +0 | 0.005 | tbl_h4_master_summary.csv window='post-Dencun (Apr 2024 onwards, D-20)' dv='diff_10000_tron' |
| PASS | H4_SPECS | `dencun_tron_10k.se` | `0.007` | `0.007` | +0 | 0.05 | tbl_h4_master_summary.csv window='post-Dencun (Apr 2024 onwards, D-20)' dv='diff_10000_tron' |
| PASS | H4_SPECS | `dencun_tron_10k.lo` | `384.766` | `384.766` | +0 | 0.05 | tbl_h4_master_summary.csv window='post-Dencun (Apr 2024 onwards, D-20)' dv='diff_10000_tron' |
| PASS | H4_SPECS | `dencun_tron_10k.hi` | `384.792` | `384.792` | +0 | 0.05 | tbl_h4_master_summary.csv window='post-Dencun (Apr 2024 onwards, D-20)' dv='diff_10000_tron' |
| PASS | H4_SPECS | `dencun_tron_10k.n` | `21` | `21` | +0 | 0 | tbl_h4_master_summary.csv window='post-Dencun (Apr 2024 onwards, D-20)' dv='diff_10000_tron' |
| PASS | H4_SPECS | `dencun_tron_10k.hac` | `2` | `2` | +0 | 0 | tbl_h4_master_summary.csv window='post-Dencun (Apr 2024 onwards, D-20)' dv='diff_10000_tron' |
| PASS | H4_SPECS | `dencun_tron_10k.p_lt_1e_15` | `True` | `True` | — | 0 | tbl_h4_master_summary.csv window='post-Dencun (Apr 2024 onwards, D-20)' dv='diff_10000_tron' |
| PASS | H4_SENSITIVITY | `s200_eth.full_0` | `-6.53` | `-6.53` | +0 | 0.01 | tbl_h4_master_summary.csv '$0.00' 'full (2020-01 to 2025-12)' 'diff_200_eth' |
| PASS | H4_SENSITIVITY | `s200_eth.full_350` | `-3.03` | `-3.03` | +0 | 0.01 | tbl_h4_master_summary.csv '$3.50' 'full (2020-01 to 2025-12)' 'diff_200_eth' |
| PASS | H4_SENSITIVITY | `s200_eth.dencun_0` | `0.86` | `0.86` | +0 | 0.01 | tbl_h4_master_summary.csv '$0.00' 'post-Dencun (Apr 2024 onwards, D-20)' 'diff_200_eth' |
| PASS | H4_SENSITIVITY | `s200_eth.dencun_350` | `4.36` | `4.36` | +0 | 0.01 | tbl_h4_master_summary.csv '$3.50' 'post-Dencun (Apr 2024 onwards, D-20)' 'diff_200_eth' |
| PASS | H4_SENSITIVITY | `s200_tron.full_0` | `8.26` | `8.26` | +0 | 0.01 | tbl_h4_master_summary.csv '$0.00' 'full (2020-01 to 2025-12)' 'diff_200_tron' |
| PASS | H4_SENSITIVITY | `s200_tron.full_350` | `11.76` | `11.76` | +0 | 0.01 | tbl_h4_master_summary.csv '$3.50' 'full (2020-01 to 2025-12)' 'diff_200_tron' |
| PASS | H4_SENSITIVITY | `s200_tron.dencun_0` | `7.67` | `7.67` | +0 | 0.01 | tbl_h4_master_summary.csv '$0.00' 'post-Dencun (Apr 2024 onwards, D-20)' 'diff_200_tron' |
| PASS | H4_SENSITIVITY | `s200_tron.dencun_350` | `11.17` | `11.17` | +0 | 0.01 | tbl_h4_master_summary.csv '$3.50' 'post-Dencun (Apr 2024 onwards, D-20)' 'diff_200_tron' |
| PASS | H4_SENSITIVITY | `s10000_eth.full_0` | `404.74` | `404.74` | +0 | 0.01 | tbl_h4_master_summary.csv '$0.00' 'full (2020-01 to 2025-12)' 'diff_10000_eth' |
| PASS | H4_SENSITIVITY | `s10000_eth.full_350` | `408.24` | `408.24` | +0 | 0.01 | tbl_h4_master_summary.csv '$3.50' 'full (2020-01 to 2025-12)' 'diff_10000_eth' |
| PASS | H4_SENSITIVITY | `s10000_eth.dencun_0` | `377.97` | `377.97` | +0 | 0.01 | tbl_h4_master_summary.csv '$0.00' 'post-Dencun (Apr 2024 onwards, D-20)' 'diff_10000_eth' |
| PASS | H4_SENSITIVITY | `s10000_eth.dencun_350` | `381.47` | `381.47` | +0 | 0.01 | tbl_h4_master_summary.csv '$3.50' 'post-Dencun (Apr 2024 onwards, D-20)' 'diff_10000_eth' |
| PASS | H4_SENSITIVITY | `s10000_tron.full_0` | `419.53` | `419.53` | +0 | 0.01 | tbl_h4_master_summary.csv '$0.00' 'full (2020-01 to 2025-12)' 'diff_10000_tron' |
| PASS | H4_SENSITIVITY | `s10000_tron.full_350` | `423.03` | `423.03` | +0 | 0.01 | tbl_h4_master_summary.csv '$3.50' 'full (2020-01 to 2025-12)' 'diff_10000_tron' |
| PASS | H4_SENSITIVITY | `s10000_tron.dencun_0` | `384.78` | `384.78` | +0 | 0.01 | tbl_h4_master_summary.csv '$0.00' 'post-Dencun (Apr 2024 onwards, D-20)' 'diff_10000_tron' |
| PASS | H4_SENSITIVITY | `s10000_tron.dencun_350` | `388.28` | `388.28` | +0 | 0.01 | tbl_h4_master_summary.csv '$3.50' 'post-Dencun (Apr 2024 onwards, D-20)' 'diff_10000_tron' |
| PASS | H4_BREAKEVEN | `2020.eth_med` | `8.63` | `8.63` | +0 | 0.01 | tbl_h4_breakeven_by_year.csv year=2020 |
| PASS | H4_BREAKEVEN | `2020.eth_mean` | `20.7` | `20.7` | +0 | 0.01 | tbl_h4_breakeven_by_year.csv year=2020 |
| PASS | H4_BREAKEVEN | `2020.tron_med` | `0.03` | `0.03` | +0 | 0.01 | tbl_h4_breakeven_by_year.csv year=2020 |
| PASS | H4_BREAKEVEN | `2020.tron_mean` | `0.05` | `0.05` | +0 | 0.01 | tbl_h4_breakeven_by_year.csv year=2020 |
| PASS | H4_BREAKEVEN | `2021.eth_med` | `288.23` | `288.23` | +0 | 0.01 | tbl_h4_breakeven_by_year.csv year=2021 |
| PASS | H4_BREAKEVEN | `2021.eth_mean` | `567.23` | `567.23` | +0 | 0.01 | tbl_h4_breakeven_by_year.csv year=2021 |
| PASS | H4_BREAKEVEN | `2021.tron_med` | `4.38` | `4.38` | +0 | 0.01 | tbl_h4_breakeven_by_year.csv year=2021 |
| PASS | H4_BREAKEVEN | `2021.tron_mean` | `5.39` | `5.39` | +0 | 0.01 | tbl_h4_breakeven_by_year.csv year=2021 |
| PASS | H4_BREAKEVEN | `2022.eth_med` | `203.59` | `203.59` | +0 | 0.01 | tbl_h4_breakeven_by_year.csv year=2022 |
| PASS | H4_BREAKEVEN | `2022.eth_mean` | `287.96` | `287.96` | +0 | 0.01 | tbl_h4_breakeven_by_year.csv year=2022 |
| PASS | H4_BREAKEVEN | `2022.tron_med` | `7.38` | `7.38` | +0 | 0.01 | tbl_h4_breakeven_by_year.csv year=2022 |
| PASS | H4_BREAKEVEN | `2022.tron_mean` | `9.44` | `9.44` | +0 | 0.01 | tbl_h4_breakeven_by_year.csv year=2022 |
| PASS | H4_BREAKEVEN | `2023.eth_med` | `175.48` | `175.48` | +0 | 0.01 | tbl_h4_breakeven_by_year.csv year=2023 |
| PASS | H4_BREAKEVEN | `2023.eth_mean` | `215.37` | `215.37` | +0 | 0.01 | tbl_h4_breakeven_by_year.csv year=2023 |
| PASS | H4_BREAKEVEN | `2023.tron_med` | `0.84` | `0.84` | +0 | 0.01 | tbl_h4_breakeven_by_year.csv year=2023 |
| PASS | H4_BREAKEVEN | `2023.tron_mean` | `14.42` | `14.42` | +0 | 0.01 | tbl_h4_breakeven_by_year.csv year=2023 |
| PASS | H4_BREAKEVEN | `2024.eth_med` | `140.13` | `140.13` | +0 | 0.01 | tbl_h4_breakeven_by_year.csv year=2024 |
| PASS | H4_BREAKEVEN | `2024.eth_mean` | `307.33` | `307.33` | +0 | 0.01 | tbl_h4_breakeven_by_year.csv year=2024 |
| PASS | H4_BREAKEVEN | `2024.tron_med` | `0.63` | `0.63` | +0 | 0.01 | tbl_h4_breakeven_by_year.csv year=2024 |
| PASS | H4_BREAKEVEN | `2024.tron_mean` | `12.9` | `12.9` | +0 | 0.01 | tbl_h4_breakeven_by_year.csv year=2024 |
| PASS | H4_BREAKEVEN | `2025.eth_med` | `9.48` | `9.48` | +0 | 0.01 | tbl_h4_breakeven_by_year.csv year=2025 |
| PASS | H4_BREAKEVEN | `2025.eth_mean` | `23.73` | `23.73` | +0 | 0.01 | tbl_h4_breakeven_by_year.csv year=2025 |
| PASS | H4_BREAKEVEN | `2025.tron_med` | `0` | `0` | +0 | 0.01 | tbl_h4_breakeven_by_year.csv year=2025 |
| PASS | H4_BREAKEVEN | `2025.tron_mean` | `15.95` | `15.95` | +0 | 0.01 | tbl_h4_breakeven_by_year.csv year=2025 |
| PASS | H4_CROSSOVER | `2020.n` | `0` | `0` | +0 | 0 | tbl_h4_crossover_by_year.csv year=2020 |
| PASS | H4_CROSSOVER | `2020.pct` | `0` | `0` | +0 | 0.01 | tbl_h4_crossover_by_year.csv year=2020 |
| PASS | H4_CROSSOVER | `2021.n` | `0` | `0` | +0 | 0 | tbl_h4_crossover_by_year.csv year=2021 |
| PASS | H4_CROSSOVER | `2021.pct` | `0` | `0` | +0 | 0.01 | tbl_h4_crossover_by_year.csv year=2021 |
| PASS | H4_CROSSOVER | `2022.n` | `0` | `0` | +0 | 0 | tbl_h4_crossover_by_year.csv year=2022 |
| PASS | H4_CROSSOVER | `2022.pct` | `0` | `0` | +0 | 0.01 | tbl_h4_crossover_by_year.csv year=2022 |
| PASS | H4_CROSSOVER | `2023.n` | `0` | `0` | +0 | 0 | tbl_h4_crossover_by_year.csv year=2023 |
| PASS | H4_CROSSOVER | `2023.pct` | `0` | `0` | +0 | 0.01 | tbl_h4_crossover_by_year.csv year=2023 |
| PASS | H4_CROSSOVER | `2024.n` | `0` | `0` | +0 | 0 | tbl_h4_crossover_by_year.csv year=2024 |
| PASS | H4_CROSSOVER | `2024.pct` | `0` | `0` | +0 | 0.01 | tbl_h4_crossover_by_year.csv year=2024 |
| PASS | H4_CROSSOVER | `2025.n` | `6` | `6` | +0 | 0 | tbl_h4_crossover_by_year.csv year=2025 |
| PASS | H4_CROSSOVER | `2025.pct` | `50` | `50` | +0 | 0.01 | tbl_h4_crossover_by_year.csv year=2025 |
| PASS | H4_SAVINGS | `2020.e200` | `24.62` | `24.62` | +0 | 0.01 | tbl_h4_savings_ratio_by_year.csv year=2020 |
| PASS | H4_SAVINGS | `2020.t200` | `6182.89` | `6182.89` | +0 | 0.01 | tbl_h4_savings_ratio_by_year.csv year=2020 |
| PASS | H4_SAVINGS | `2020.e10k` | `1230.91` | `1230.91` | +0 | 0.01 | tbl_h4_savings_ratio_by_year.csv year=2020 |
| PASS | H4_SAVINGS | `2020.t10k` | `309144` | `309144` | +0 | 0.01 | tbl_h4_savings_ratio_by_year.csv year=2020 |
| PASS | H4_SAVINGS | `2021.e200` | `0.7` | `0.7` | +0 | 0.01 | tbl_h4_savings_ratio_by_year.csv year=2021 |
| PASS | H4_SAVINGS | `2021.t200` | `46.5` | `46.5` | +0 | 0.01 | tbl_h4_savings_ratio_by_year.csv year=2021 |
| PASS | H4_SAVINGS | `2021.e10k` | `35.07` | `35.07` | +0 | 0.01 | tbl_h4_savings_ratio_by_year.csv year=2021 |
| PASS | H4_SAVINGS | `2021.t10k` | `2324.88` | `2324.88` | +0 | 0.01 | tbl_h4_savings_ratio_by_year.csv year=2021 |
| PASS | H4_SAVINGS | `2022.e200` | `0.98` | `0.98` | +0 | 0.01 | tbl_h4_savings_ratio_by_year.csv year=2022 |
| PASS | H4_SAVINGS | `2022.t200` | `27.15` | `27.15` | +0 | 0.01 | tbl_h4_savings_ratio_by_year.csv year=2022 |
| PASS | H4_SAVINGS | `2022.e10k` | `49.19` | `49.19` | +0 | 0.01 | tbl_h4_savings_ratio_by_year.csv year=2022 |
| PASS | H4_SAVINGS | `2022.t10k` | `1357.68` | `1357.68` | +0 | 0.01 | tbl_h4_savings_ratio_by_year.csv year=2022 |
| PASS | H4_SAVINGS | `2023.e200` | `1.16` | `1.16` | +0 | 0.01 | tbl_h4_savings_ratio_by_year.csv year=2023 |
| PASS | H4_SAVINGS | `2023.t200` | `216.94` | `216.94` | +0 | 0.01 | tbl_h4_savings_ratio_by_year.csv year=2023 |
| PASS | H4_SAVINGS | `2023.e10k` | `57.82` | `57.82` | +0 | 0.01 | tbl_h4_savings_ratio_by_year.csv year=2023 |
| PASS | H4_SAVINGS | `2023.t10k` | `10846.9` | `10846.9` | +0 | 0.01 | tbl_h4_savings_ratio_by_year.csv year=2023 |
| PASS | H4_SAVINGS | `2024.e200` | `1.46` | `1.46` | +0 | 0.01 | tbl_h4_savings_ratio_by_year.csv year=2024 |
| PASS | H4_SAVINGS | `2024.t200` | `247.65` | `247.65` | +0 | 0.01 | tbl_h4_savings_ratio_by_year.csv year=2024 |
| PASS | H4_SAVINGS | `2024.e10k` | `72.91` | `72.91` | +0 | 0.01 | tbl_h4_savings_ratio_by_year.csv year=2024 |
| PASS | H4_SAVINGS | `2024.t10k` | `12382.6` | `12382.6` | +0 | 0.01 | tbl_h4_savings_ratio_by_year.csv year=2024 |
| PASS | H4_SAVINGS | `2025.e200` | `21.15` | `21.15` | +0 | 0.01 | tbl_h4_savings_ratio_by_year.csv year=2025 |
| PASS | H4_SAVINGS | `2025.t200` | `92.65` | `92.65` | +0 | 0.01 | tbl_h4_savings_ratio_by_year.csv year=2025 |
| PASS | H4_SAVINGS | `2025.e10k` | `1057.52` | `1057.52` | +0 | 0.01 | tbl_h4_savings_ratio_by_year.csv year=2025 |
| PASS | H4_SAVINGS | `2025.t10k` | `4632.3` | `4632.3` | +0 | 0.01 | tbl_h4_savings_ratio_by_year.csv year=2025 |
| PASS | H1_SPECS | `USDC.full.beta` | `0.9821` | `0.9821` | +0 | 0.005 | tbl_h1_master_summary.csv asset=USDC kind=full |
| PASS | H1_SPECS | `USDC.full.se` | `0.029` | `0.029` | +0 | 0.05 | tbl_h1_master_summary.csv asset=USDC kind=full |
| PASS | H1_SPECS | `USDC.full.lo` | `0.9253` | `0.9253` | +0 | 0.05 | tbl_h1_master_summary.csv asset=USDC kind=full |
| PASS | H1_SPECS | `USDC.full.hi` | `1.0388` | `1.0388` | +0 | 0.05 | tbl_h1_master_summary.csv asset=USDC kind=full |
| PASS | H1_SPECS | `USDC.full.r2` | `0.8741` | `0.8741` | +0 | 0.005 | tbl_h1_master_summary.csv asset=USDC kind=full |
| PASS | H1_SPECS | `USDC.full.n` | `2192` | `2192` | +0 | 0 | tbl_h1_master_summary.csv asset=USDC kind=full |
| PASS | H1_SPECS | `USDC.full.p1_match` | `True` | `True` | — | 0 | tbl_h1_master_summary.csv asset=USDC kind=full p_beta_equals_1=0.53573 |
| PASS | H1_SPECS | `USDC.full.p2_match` | `True` | `True` | — | 0 | tbl_h1_master_summary.csv asset=USDC kind=full p_beta_equals_2=1.1019e-270 |
| PASS | H1_SPECS | `USDC.ex.beta` | `1.0426` | `1.0426` | +0 | 0.005 | tbl_h1_master_summary.csv asset=USDC kind=ex |
| PASS | H1_SPECS | `USDC.ex.se` | `0.0213` | `0.0213` | +0 | 0.05 | tbl_h1_master_summary.csv asset=USDC kind=ex |
| PASS | H1_SPECS | `USDC.ex.lo` | `1.001` | `1.001` | +0 | 0.05 | tbl_h1_master_summary.csv asset=USDC kind=ex |
| PASS | H1_SPECS | `USDC.ex.hi` | `1.0843` | `1.0843` | +0 | 0.05 | tbl_h1_master_summary.csv asset=USDC kind=ex |
| PASS | H1_SPECS | `USDC.ex.r2` | `0.9315` | `0.9315` | +0 | 0.005 | tbl_h1_master_summary.csv asset=USDC kind=ex |
| PASS | H1_SPECS | `USDC.ex.n` | `2028` | `2028` | +0 | 0 | tbl_h1_master_summary.csv asset=USDC kind=ex |
| PASS | H1_SPECS | `USDC.ex.p1_match` | `True` | `True` | — | 0 | tbl_h1_master_summary.csv asset=USDC kind=ex p_beta_equals_1=0.044877 |
| PASS | H1_SPECS | `USDC.ex.p2_match` | `True` | `True` | — | 0 | tbl_h1_master_summary.csv asset=USDC kind=ex p_beta_equals_2=0 |
| PASS | H1_SPECS | `USDC.pre.beta` | `0.9164` | `0.9164` | +0 | 0.005 | tbl_h1_master_summary.csv asset=USDC kind=pre |
| PASS | H1_SPECS | `USDC.pre.se` | `0.0546` | `0.0546` | +0 | 0.05 | tbl_h1_master_summary.csv asset=USDC kind=pre |
| PASS | H1_SPECS | `USDC.pre.lo` | `0.8094` | `0.8094` | +0 | 0.05 | tbl_h1_master_summary.csv asset=USDC kind=pre |
| PASS | H1_SPECS | `USDC.pre.hi` | `1.0234` | `1.0234` | +0 | 0.05 | tbl_h1_master_summary.csv asset=USDC kind=pre |
| PASS | H1_SPECS | `USDC.pre.r2` | `0.6782` | `0.6782` | +0 | 0.005 | tbl_h1_master_summary.csv asset=USDC kind=pre |
| PASS | H1_SPECS | `USDC.pre.n` | `1045` | `1045` | +0 | 0 | tbl_h1_master_summary.csv asset=USDC kind=pre |
| PASS | H1_SPECS | `USDC.pre.p1_match` | `True` | `True` | — | 0 | tbl_h1_master_summary.csv asset=USDC kind=pre p_beta_equals_1=0.12554 |
| PASS | H1_SPECS | `USDC.pre.p2_match` | `True` | `True` | — | 0 | tbl_h1_master_summary.csv asset=USDC kind=pre p_beta_equals_2=1.0305e-87 |
| PASS | H1_SPECS | `USDC.post.beta` | `1.0882` | `1.0882` | +0 | 0.005 | tbl_h1_master_summary.csv asset=USDC kind=post |
| PASS | H1_SPECS | `USDC.post.se` | `0.0203` | `0.0203` | +0 | 0.05 | tbl_h1_master_summary.csv asset=USDC kind=post |
| PASS | H1_SPECS | `USDC.post.lo` | `1.0484` | `1.0484` | +0 | 0.05 | tbl_h1_master_summary.csv asset=USDC kind=post |
| PASS | H1_SPECS | `USDC.post.hi` | `1.128` | `1.128` | +0 | 0.05 | tbl_h1_master_summary.csv asset=USDC kind=post |
| PASS | H1_SPECS | `USDC.post.r2` | `0.9539` | `0.9539` | +0 | 0.005 | tbl_h1_master_summary.csv asset=USDC kind=post |
| PASS | H1_SPECS | `USDC.post.n` | `1147` | `1147` | +0 | 0 | tbl_h1_master_summary.csv asset=USDC kind=post |
| PASS | H1_SPECS | `USDC.post.p1_match` | `True` | `True` | — | 0 | tbl_h1_master_summary.csv asset=USDC kind=post p_beta_equals_1=1.3918e-05 |
| PASS | H1_SPECS | `USDC.post.p2_match` | `True` | `True` | — | 0 | tbl_h1_master_summary.csv asset=USDC kind=post p_beta_equals_2=0 |
| PASS | H1_SPECS | `USDT.full.beta` | `1.0145` | `1.0145` | +0 | 0.005 | tbl_h1_master_summary.csv asset=USDT kind=full |
| PASS | H1_SPECS | `USDT.full.se` | `0.0073` | `0.0073` | +0 | 0.05 | tbl_h1_master_summary.csv asset=USDT kind=full |
| PASS | H1_SPECS | `USDT.full.lo` | `1.0002` | `1.0002` | +0 | 0.05 | tbl_h1_master_summary.csv asset=USDT kind=full |
| PASS | H1_SPECS | `USDT.full.hi` | `1.0288` | `1.0288` | +0 | 0.05 | tbl_h1_master_summary.csv asset=USDT kind=full |
| PASS | H1_SPECS | `USDT.full.r2` | `0.9867` | `0.9867` | +0 | 0.005 | tbl_h1_master_summary.csv asset=USDT kind=full |
| PASS | H1_SPECS | `USDT.full.n` | `2192` | `2192` | +0 | 0 | tbl_h1_master_summary.csv asset=USDT kind=full |
| PASS | H1_SPECS | `USDT.full.p1_match` | `True` | `True` | — | 0 | tbl_h1_master_summary.csv asset=USDT kind=full p_beta_equals_1=0.047091 |
| PASS | H1_SPECS | `USDT.full.p2_match` | `True` | `True` | — | 0 | tbl_h1_master_summary.csv asset=USDT kind=full p_beta_equals_2=0 |
| PASS | H1_SPECS | `USDT.ex.beta` | `1.02` | `1.02` | +0 | 0.005 | tbl_h1_master_summary.csv asset=USDT kind=ex |
| PASS | H1_SPECS | `USDT.ex.se` | `0.0049` | `0.0049` | +0 | 0.05 | tbl_h1_master_summary.csv asset=USDT kind=ex |
| PASS | H1_SPECS | `USDT.ex.lo` | `1.0104` | `1.0104` | +0 | 0.05 | tbl_h1_master_summary.csv asset=USDT kind=ex |
| PASS | H1_SPECS | `USDT.ex.hi` | `1.0296` | `1.0296` | +0 | 0.05 | tbl_h1_master_summary.csv asset=USDT kind=ex |
| PASS | H1_SPECS | `USDT.ex.r2` | `0.9944` | `0.9944` | +0 | 0.005 | tbl_h1_master_summary.csv asset=USDT kind=ex |
| PASS | H1_SPECS | `USDT.ex.n` | `2090` | `2090` | +0 | 0 | tbl_h1_master_summary.csv asset=USDT kind=ex |
| PASS | H1_SPECS | `USDT.ex.p1_match` | `True` | `True` | — | 0 | tbl_h1_master_summary.csv asset=USDT kind=ex p_beta_equals_1=4.5806e-05 |
| PASS | H1_SPECS | `USDT.ex.p2_match` | `True` | `True` | — | 0 | tbl_h1_master_summary.csv asset=USDT kind=ex p_beta_equals_2=0 |
| PASS | H1_SPECS | `USDT.pre.beta` | `1.0249` | `1.0249` | +0 | 0.005 | tbl_h1_master_summary.csv asset=USDT kind=pre |
| PASS | H1_SPECS | `USDT.pre.se` | `0.0085` | `0.0085` | +0 | 0.05 | tbl_h1_master_summary.csv asset=USDT kind=pre |
| PASS | H1_SPECS | `USDT.pre.lo` | `1.0082` | `1.0082` | +0 | 0.05 | tbl_h1_master_summary.csv asset=USDT kind=pre |
| PASS | H1_SPECS | `USDT.pre.hi` | `1.0415` | `1.0415` | +0 | 0.05 | tbl_h1_master_summary.csv asset=USDT kind=pre |
| PASS | H1_SPECS | `USDT.pre.r2` | `0.9866` | `0.9866` | +0 | 0.005 | tbl_h1_master_summary.csv asset=USDT kind=pre |
| PASS | H1_SPECS | `USDT.pre.n` | `1045` | `1045` | +0 | 0 | tbl_h1_master_summary.csv asset=USDT kind=pre |
| PASS | H1_SPECS | `USDT.pre.p1_match` | `True` | `True` | — | 0 | tbl_h1_master_summary.csv asset=USDT kind=pre p_beta_equals_1=0.0035004 |
| PASS | H1_SPECS | `USDT.pre.p2_match` | `True` | `True` | — | 0 | tbl_h1_master_summary.csv asset=USDT kind=pre p_beta_equals_2=0 |
| PASS | H1_SPECS | `USDT.post.beta` | `1.1007` | `1.1007` | +0 | 0.005 | tbl_h1_master_summary.csv asset=USDT kind=post |
| PASS | H1_SPECS | `USDT.post.se` | `0.0627` | `0.0627` | +0 | 0.05 | tbl_h1_master_summary.csv asset=USDT kind=post |
| PASS | H1_SPECS | `USDT.post.lo` | `0.9778` | `0.9778` | +0 | 0.05 | tbl_h1_master_summary.csv asset=USDT kind=post |
| PASS | H1_SPECS | `USDT.post.hi` | `1.2235` | `1.2235` | +0 | 0.05 | tbl_h1_master_summary.csv asset=USDT kind=post |
| PASS | H1_SPECS | `USDT.post.r2` | `0.7542` | `0.7542` | +0 | 0.005 | tbl_h1_master_summary.csv asset=USDT kind=post |
| PASS | H1_SPECS | `USDT.post.n` | `1147` | `1147` | +0 | 0 | tbl_h1_master_summary.csv asset=USDT kind=post |
| PASS | H1_SPECS | `USDT.post.p1_match` | `True` | `True` | — | 0 | tbl_h1_master_summary.csv asset=USDT kind=post p_beta_equals_1=0.10822 |
| PASS | H1_SPECS | `USDT.post.p2_match` | `True` | `True` | — | 0 | tbl_h1_master_summary.csv asset=USDT kind=post p_beta_equals_2=1.0971e-46 |
| PASS | H1_SPECS | `USDC.full.alpha_ln` | `1.5248` | `1.5248` | +0 | 0.005 | tbl_h1_ols_fullwindow.csv asset=USDC levels alpha |
| PASS | H1_SPECS | `USDC.full.cointegrated` | `True` | `True` | — | 0 | tbl_h1_cointegration.csv asset=USDC |
| PASS | H1_SPECS | `USDT.full.alpha_ln` | `0.5099` | `0.5099` | +0 | 0.005 | tbl_h1_ols_fullwindow.csv asset=USDT levels alpha |
| PASS | H1_SPECS | `USDT.full.cointegrated` | `True` | `True` | — | 0 | tbl_h1_cointegration.csv asset=USDT |
| PASS | H1_SPECS | `USDC.pre.alpha_ln_derived` | `2.1959` | `2.1969` | -0.001 | 0.01 | derived: mean(ln_y)−β·mean(ln_x) over USDC pre window (n=1045); h1_network_effects.csv |
| PASS | H1_SPECS | `USDC.post.alpha_ln_derived` | `0.1062` | `0.1113` | -0.0051 | 0.01 | derived: mean(ln_y)−β·mean(ln_x) over USDC post window (n=1147); h1_network_effects.csv |
| PASS | H1_SPECS | `USDC.ex.alpha_ln_derived` | `0.7867` | `0.6516` | +0.1351 | 0.15 | derived: mean(ln_y)−β·mean(ln_x) over USDC ex window (n=2028); h1_network_effects.csv · 'ex' canonical α uses Cook's-D selection (h1_master_summary 'levels OLS ex-influentials'); JSX rule is abs-residual |
| PASS | H1_SPECS | `USDT.pre.alpha_ln_derived` | `0.3818` | `0.3857` | -0.0039 | 0.01 | derived: mean(ln_y)−β·mean(ln_x) over USDT pre window (n=1045); h1_network_effects.csv |
| PASS | H1_SPECS | `USDT.post.alpha_ln_derived` | `-0.6919` | `-0.6924` | +0.0005 | 0.01 | derived: mean(ln_y)−β·mean(ln_x) over USDT post window (n=1147); h1_network_effects.csv |
| PASS | H1_SPECS | `USDT.ex.alpha_ln_derived` | `0.4351` | `0.4438` | -0.0087 | 0.15 | derived: mean(ln_y)−β·mean(ln_x) over USDT ex window (n=2090); h1_network_effects.csv · 'ex' canonical α uses Cook's-D selection (h1_master_summary 'levels OLS ex-influentials'); JSX rule is abs-residual |
| PASS | H1_SPECS | `USDC.chow.delta` | `0.1718` | `0.1718` | +0 | 0.005 | tbl_h1_chow_interaction.csv asset=USDC |
| PASS | H1_SPECS | `USDC.chow.se` | `0.0582` | `0.0582` | +0 | 0.05 | tbl_h1_chow_interaction.csv asset=USDC |
| PASS | H1_SPECS | `USDC.chow.p_match` | `True` | `True` | — | 0 | tbl_h1_chow_interaction.csv asset=USDC interaction_p=0.0031691 |
| PASS | H1_SPECS | `USDT.chow.delta` | `0.0758` | `0.0758` | +0 | 0.005 | tbl_h1_chow_interaction.csv asset=USDT |
| PASS | H1_SPECS | `USDT.chow.se` | `0.0633` | `0.0633` | +0 | 0.05 | tbl_h1_chow_interaction.csv asset=USDT |
| PASS | H1_SPECS | `USDT.chow.p_match` | `True` | `True` | — | 0 | tbl_h1_chow_interaction.csv asset=USDT interaction_p=0.23073 |
| PASS | H1_SPECS | `METCALFE_ALPHA.USDC_derived` | `-10.838` | `-10.831` | -0.007 | 0.01 | derived: mean(ln_y) − 2·mean(ln_x) over USDC full window (mean_lx=12.1379, mean_ly=13.4451); h1_network_effects.csv |
| PASS | H1_SPECS | `METCALFE_ALPHA.USDT_derived` | `-12.563` | `-12.561` | -0.002 | 0.01 | derived: mean(ln_y) − 2·mean(ln_x) over USDT full window (mean_lx=13.2628, mean_ly=13.9647); h1_network_effects.csv |
| PASS | H1_INLINE | `cooks.drop_pct.USDC` | `7.48` | `7.48` | +0 | 0.01 | tbl_h1_cooks_influence.csv asset=USDC pct_influential=7.4818 |
| PASS | H1_INLINE | `cooks.drop_pct.USDT` | `4.65` | `4.65` | +0 | 0.01 | tbl_h1_cooks_influence.csv asset=USDT pct_influential=4.6533 |
| PASS | H1_INLINE | `engle_granger.usdc_p_0_014` | `0.014` | `0.014` | +0 | 0.001 | tbl_h1_cointegration.csv USDC p_value=0.01413 |
| PASS | H1_INLINE | `engle_granger.usdt_p_lt_0_001` | `True` | `True` | — | 0 | tbl_h1_cointegration.csv USDT p_value=2.3291e-06 |
| PASS | H1_INLINE | `adf.usdc_levels_p_0_219` | `0.219` | `0.219` | +0 | 0.001 | tbl_h1_adf_tests.csv USDC log_transfer_count levels |
| PASS | H1_INLINE | `adf.usdc_levels_nonstationary` | `True` | `True` | — | 0 | tbl_h1_adf_tests.csv USDC log_transfer_count levels stationary_at_5pct |
| PASS | H1_INLINE | `adf.usdt_levels_stationary` | `True` | `True` | — | 0 | tbl_h1_adf_tests.csv USDT log_transfer_count levels stationary_at_5pct |
| PASS | H1_INLINE | `adf.usdt_levels_p_lt_0_001` | `True` | `True` | — | 0 | tbl_h1_adf_tests.csv USDT log_transfer_count levels p=0.00035982 |
| PASS | H1_INLINE | `adf.usdc_fd_p_lt_1e_18` | `True` | `True` | — | 0 | tbl_h1_adf_tests.csv USDC first_difference p=3.0339e-21 |
| PASS | H1_INLINE | `adf.usdt_fd_p_lt_1e_18` | `True` | `True` | — | 0 | tbl_h1_adf_tests.csv USDT first_difference p=5.299e-26 |
| PASS | H1_INLINE | `metcalfe.usdc_p_lt_1e_80` | `True` | `True` | — | 0 | USDC full-window p_beta_equals_2=1.10e-270 |
| PASS | H1_INLINE | `metcalfe.usdt_p_lt_1e_100` | `True` | `True` | — | 0 | USDT full-window p_beta_equals_2=0.00e+00 |
| PASS | H2_SPECS | `spec1.beta` | `0.00274757` | `0.002748` | -4.31352e-07 | 5e-06 | tbl_h2_master_summary.csv spec_id=1 |
| PASS | H2_SPECS | `spec1.se` | `0.00149469` | `0.001495` | -3.11605e-07 | 5e-06 | tbl_h2_master_summary.csv spec_id=1 |
| PASS | H2_SPECS | `spec1.lo` | `-0.000181967` | `-0.000182` | +3.3225e-08 | 5e-06 | tbl_h2_master_summary.csv spec_id=1 |
| PASS | H2_SPECS | `spec1.hi` | `0.0056771` | `0.005677` | +1.04072e-07 | 5e-06 | tbl_h2_master_summary.csv spec_id=1 |
| PASS | H2_SPECS | `spec1.p_match` | `True` | `True` | — | 0 | tbl_h2_master_summary.csv spec_id=1 p=0.06603 |
| PASS | H2_SPECS | `spec1.n` | `702` | `702` | +0 | 0 | tbl_h2_master_summary.csv spec_id=1 |
| PASS | H2_SPECS | `spec2.absorbed` | `True` | `True` | — | 0 | tbl_h2_master_summary.csv spec_id=2 |
| PASS | H2_SPECS | `spec2.n` | `702` | `702` | +0 | 0 | tbl_h2_master_summary.csv spec_id=2 |
| PASS | H2_SPECS | `spec3.beta` | `-0.000507882` | `-0.000508` | +1.18463e-07 | 5e-06 | tbl_h2_master_summary.csv spec_id=3 |
| PASS | H2_SPECS | `spec3.se` | `0.000688835` | `0.000689` | -1.64855e-07 | 5e-06 | tbl_h2_master_summary.csv spec_id=3 |
| PASS | H2_SPECS | `spec3.lo` | `-0.00186085` | `-0.001861` | +1.53545e-07 | 5e-06 | tbl_h2_master_summary.csv spec_id=3 |
| PASS | H2_SPECS | `spec3.hi` | `0.000845083` | `0.000845` | +8.3382e-08 | 5e-06 | tbl_h2_master_summary.csv spec_id=3 |
| PASS | H2_SPECS | `spec3.p_match` | `True` | `True` | — | 0 | tbl_h2_master_summary.csv spec_id=3 p=0.46124 |
| PASS | H2_SPECS | `spec3.n` | `702` | `702` | +0 | 0 | tbl_h2_master_summary.csv spec_id=3 |
| PASS | H2_SPECS | `spec4.beta` | `-0.000554633` | `-0.000555` | +3.66713e-07 | 5e-06 | tbl_h2_master_summary.csv spec_id=4 |
| PASS | H2_SPECS | `spec4.se` | `0.000714907` | `0.000715` | -9.3302e-08 | 5e-06 | tbl_h2_master_summary.csv spec_id=4 |
| PASS | H2_SPECS | `spec4.lo` | `-0.00195951` | `-0.00196` | +4.86962e-07 | 5e-06 | tbl_h2_master_summary.csv spec_id=4 |
| PASS | H2_SPECS | `spec4.hi` | `0.000850246` | `0.00085` | +2.46464e-07 | 5e-06 | tbl_h2_master_summary.csv spec_id=4 |
| PASS | H2_SPECS | `spec4.p_match` | `True` | `True` | — | 0 | tbl_h2_master_summary.csv spec_id=4 p=0.43826 |
| PASS | H2_SPECS | `spec4.n` | `592` | `592` | +0 | 0 | tbl_h2_master_summary.csv spec_id=4 |
| PASS | H2_SPECS | `spec5.beta` | `-0.00305948` | `-0.003059` | -4.78929e-07 | 5e-06 | tbl_h2_master_summary.csv spec_id=5 |
| PASS | H2_SPECS | `spec5.se` | `0.000718263` | `0.000718` | +2.63138e-07 | 5e-06 | tbl_h2_master_summary.csv spec_id=5 |
| PASS | H2_SPECS | `spec5.lo` | `-0.00447025` | `-0.00447` | -2.54955e-07 | 5e-06 | tbl_h2_master_summary.csv spec_id=5 |
| PASS | H2_SPECS | `spec5.hi` | `-0.0016487` | `-0.001649` | +2.97096e-07 | 5e-06 | tbl_h2_master_summary.csv spec_id=5 |
| PASS | H2_SPECS | `spec5.p_match` | `True` | `True` | — | 0 | tbl_h2_master_summary.csv spec_id=5 p=2.3973e-05 |
| PASS | H2_SPECS | `spec5.n` | `702` | `702` | +0 | 0 | tbl_h2_master_summary.csv spec_id=5 |
| PASS | H2_SPECS | `spec6.beta` | `-5.78049e-05` | `-5.8e-05` | +1.95134e-07 | 5e-06 | tbl_h2_master_summary.csv spec_id=6 |
| PASS | H2_SPECS | `spec6.se` | `0.000723114` | `0.000723` | +1.14423e-07 | 5e-06 | tbl_h2_master_summary.csv spec_id=6 |
| PASS | H2_SPECS | `spec6.lo` | `-0.00147813` | `-0.001478` | -1.3105e-07 | 5e-06 | tbl_h2_master_summary.csv spec_id=6 |
| PASS | H2_SPECS | `spec6.hi` | `0.00136252` | `0.001363` | -4.78682e-07 | 5e-06 | tbl_h2_master_summary.csv spec_id=6 |
| PASS | H2_SPECS | `spec6.p_match` | `True` | `True` | — | 0 | tbl_h2_master_summary.csv spec_id=6 p=0.93631 |
| PASS | H2_SPECS | `spec6.n` | `696` | `696` | +0 | 0 | tbl_h2_master_summary.csv spec_id=6 |
| PASS | H2_SPECS | `spec7.beta` | `-0.00046118` | `-0.000461` | -1.79975e-07 | 5e-06 | tbl_h2_master_summary.csv spec_id=7 |
| PASS | H2_SPECS | `spec7.se` | `0.000697345` | `0.000697` | +3.44764e-07 | 5e-06 | tbl_h2_master_summary.csv spec_id=7 |
| PASS | H2_SPECS | `spec7.lo` | `-0.00183086` | `-0.001831` | +1.41071e-07 | 5e-06 | tbl_h2_master_summary.csv spec_id=7 |
| PASS | H2_SPECS | `spec7.hi` | `0.000908499` | `0.000908` | +4.98979e-07 | 5e-06 | tbl_h2_master_summary.csv spec_id=7 |
| PASS | H2_SPECS | `spec7.p_match` | `True` | `True` | — | 0 | tbl_h2_master_summary.csv spec_id=7 p=0.50866 |
| PASS | H2_SPECS | `spec7.n` | `702` | `702` | +0 | 0 | tbl_h2_master_summary.csv spec_id=7 |
| PASS | H2_REGIONAL | `SSA.n` | `122` | `122` | +0 | 0 | tbl_h2_regional_panel.csv spec_id=R_SSA |
| PASS | H2_REGIONAL | `SSA.nC` | `24` | `24` | +0 | 0 | tbl_h2_regional_panel.csv spec_id=R_SSA |
| PASS | H2_REGIONAL | `SSA.beta` | `-0.000912` | `-0.000912` | +0 | 5e-06 | tbl_h2_regional_panel.csv spec_id=R_SSA |
| PASS | H2_REGIONAL | `SSA.se` | `0.003009` | `0.003009` | +0 | 5e-06 | tbl_h2_regional_panel.csv spec_id=R_SSA |
| PASS | H2_REGIONAL | `SSA.lo` | `-0.00689` | `-0.00689` | +0 | 5e-06 | tbl_h2_regional_panel.csv spec_id=R_SSA |
| PASS | H2_REGIONAL | `SSA.hi` | `0.005066` | `0.005066` | +0 | 5e-06 | tbl_h2_regional_panel.csv spec_id=R_SSA |
| PASS | H2_REGIONAL | `SSA.p` | `0.7626` | `0.7626` | +0 | 0.005 | tbl_h2_regional_panel.csv spec_id=R_SSA |
| PASS | H2_REGIONAL | `SSA.r2` | `0.179` | `0.179` | +0 | 0.005 | tbl_h2_regional_panel.csv spec_id=R_SSA |
| PASS | H2_REGIONAL | `LAC.n` | `118` | `118` | +0 | 0 | tbl_h2_regional_panel.csv spec_id=R_LAC |
| PASS | H2_REGIONAL | `LAC.nC` | `20` | `20` | +0 | 0 | tbl_h2_regional_panel.csv spec_id=R_LAC |
| PASS | H2_REGIONAL | `LAC.beta` | `0.001044` | `0.001044` | +0 | 5e-06 | tbl_h2_regional_panel.csv spec_id=R_LAC |
| PASS | H2_REGIONAL | `LAC.se` | `0.001459` | `0.001459` | +0 | 5e-06 | tbl_h2_regional_panel.csv spec_id=R_LAC |
| PASS | H2_REGIONAL | `LAC.lo` | `-0.001855` | `-0.001855` | +0 | 5e-06 | tbl_h2_regional_panel.csv spec_id=R_LAC |
| PASS | H2_REGIONAL | `LAC.hi` | `0.003944` | `0.003944` | +0 | 5e-06 | tbl_h2_regional_panel.csv spec_id=R_LAC |
| PASS | H2_REGIONAL | `LAC.p` | `0.4761` | `0.4761` | +0 | 0.005 | tbl_h2_regional_panel.csv spec_id=R_LAC |
| PASS | H2_REGIONAL | `LAC.r2` | `0.036` | `0.036` | +0 | 0.005 | tbl_h2_regional_panel.csv spec_id=R_LAC |
| PASS | H2_REGIONAL | `SA_EAP.n` | `112` | `112` | +0 | 0 | tbl_h2_regional_panel.csv spec_id=R_SA_EAP |
| PASS | H2_REGIONAL | `SA_EAP.nC` | `19` | `19` | +0 | 0 | tbl_h2_regional_panel.csv spec_id=R_SA_EAP |
| PASS | H2_REGIONAL | `SA_EAP.beta` | `1.02e-06` | `1e-06` | +2e-08 | 5e-06 | tbl_h2_regional_panel.csv spec_id=R_SA_EAP |
| PASS | H2_REGIONAL | `SA_EAP.se` | `0.001415` | `0.001415` | +0 | 5e-06 | tbl_h2_regional_panel.csv spec_id=R_SA_EAP |
| PASS | H2_REGIONAL | `SA_EAP.lo` | `-0.002813` | `-0.002813` | +0 | 5e-06 | tbl_h2_regional_panel.csv spec_id=R_SA_EAP |
| PASS | H2_REGIONAL | `SA_EAP.hi` | `0.002815` | `0.002815` | +0 | 5e-06 | tbl_h2_regional_panel.csv spec_id=R_SA_EAP |
| PASS | H2_REGIONAL | `SA_EAP.p` | `0.9994` | `0.9994` | +0 | 0.005 | tbl_h2_regional_panel.csv spec_id=R_SA_EAP |
| PASS | H2_REGIONAL | `SA_EAP.r2` | `0.12` | `0.12` | +0 | 0.005 | tbl_h2_regional_panel.csv spec_id=R_SA_EAP |
| PASS | H2_DESCRIPTIVE | `y2020.n` | `149` | `149` | +0 | 0 | tbl_h2_descriptive.csv year=2020 |
| PASS | H2_DESCRIPTIVE | `y2020.mean` | `0.4647` | `0.4647` | +0 | 0.005 | tbl_h2_descriptive.csv year=2020 |
| PASS | H2_DESCRIPTIVE | `y2020.sd` | `0.3095` | `0.3095` | +0 | 0.005 | tbl_h2_descriptive.csv year=2020 |
| PASS | H2_DESCRIPTIVE | `y2021.n` | `148` | `148` | +0 | 0 | tbl_h2_descriptive.csv year=2021 |
| PASS | H2_DESCRIPTIVE | `y2021.mean` | `0.5149` | `0.5149` | +0 | 0.005 | tbl_h2_descriptive.csv year=2021 |
| PASS | H2_DESCRIPTIVE | `y2021.sd` | `0.285` | `0.285` | +0 | 0.005 | tbl_h2_descriptive.csv year=2021 |
| PASS | H2_DESCRIPTIVE | `y2022.n` | `142` | `142` | +0 | 0 | tbl_h2_descriptive.csv year=2022 |
| PASS | H2_DESCRIPTIVE | `y2022.mean` | `0.5045` | `0.5045` | +0 | 0.005 | tbl_h2_descriptive.csv year=2022 |
| PASS | H2_DESCRIPTIVE | `y2022.sd` | `0.2894` | `0.2894` | +0 | 0.005 | tbl_h2_descriptive.csv year=2022 |
| PASS | H2_DESCRIPTIVE | `y2023.n` | `148` | `148` | +0 | 0 | tbl_h2_descriptive.csv year=2023 |
| PASS | H2_DESCRIPTIVE | `y2023.mean` | `0.5049` | `0.5049` | +0 | 0.005 | tbl_h2_descriptive.csv year=2023 |
| PASS | H2_DESCRIPTIVE | `y2023.sd` | `0.2911` | `0.2911` | +0 | 0.005 | tbl_h2_descriptive.csv year=2023 |
| PASS | H2_DESCRIPTIVE | `y2024.n` | `145` | `145` | +0 | 0 | tbl_h2_descriptive.csv year=2024 |
| PASS | H2_DESCRIPTIVE | `y2024.mean` | `0.5023` | `0.5023` | +0 | 0.005 | tbl_h2_descriptive.csv year=2024 |
| PASS | H2_DESCRIPTIVE | `y2024.sd` | `0.2902` | `0.2902` | +0 | 0.005 | tbl_h2_descriptive.csv year=2024 |
| PASS | H2_DESCRIPTIVE | `y2025.n` | `129` | `129` | +0 | 0 | tbl_h2_descriptive.csv year=2025 |
| PASS | H2_DESCRIPTIVE | `y2025.mean` | `0.4917` | `0.4917` | +0 | 0.005 | tbl_h2_descriptive.csv year=2025 |
| PASS | H2_DESCRIPTIVE | `y2025.sd` | `0.2939` | `0.2939` | +0 | 0.005 | tbl_h2_descriptive.csv year=2025 |
| PASS | H2_INLINE | `preReg.spec1.actual_str` | `+0.0027` | `+0.0027` | — | 0 | H2_SPECS_RAW[id=1].beta=0.002748 → derived=+0.0027 |
| PASS | H2_INLINE | `preReg.spec1.p` | `0.066` | `0.066` | +0 | 0.001 | H2_SPECS_RAW[id=1].p=0.066030 |
| PASS | H2_INLINE | `preReg.spec3.actual_str` | `−0.0005` | `−0.0005` | — | 0 | H2_SPECS_RAW[id=3].beta=-0.000508 → derived=−0.0005 |
| PASS | H2_INLINE | `preReg.spec3.p` | `0.461` | `0.461` | +0 | 0.001 | H2_SPECS_RAW[id=3].p=0.461240 |
| PASS | H2_INLINE | `preReg.spec4.actual_str` | `−0.0006` | `−0.0006` | — | 0 | H2_SPECS_RAW[id=4].beta=-0.000555 → derived=−0.0006 |
| PASS | H2_INLINE | `preReg.spec4.p` | `0.438` | `0.438` | +0 | 0.001 | H2_SPECS_RAW[id=4].p=0.438258 |
| PASS | H2_INLINE | `preReg.spec6.actual_str` | `−0.0001` | `−0.0001` | — | 0 | H2_SPECS_RAW[id=6].beta=-0.000058 → derived=−0.0001 |
| PASS | H2_INLINE | `preReg.spec6.p` | `0.936` | `0.936` | +0 | 0.001 | H2_SPECS_RAW[id=6].p=0.936314 |
| PASS | H2_INLINE | `preReg.spec7.actual_str` | `−0.0005` | `−0.0005` | — | 0 | H2_SPECS_RAW[id=7].beta=-0.000461 → derived=−0.0005 |
| PASS | H2_INLINE | `preReg.spec7.p` | `0.509` | `0.509` | +0 | 0.001 | H2_SPECS_RAW[id=7].p=0.508663 |
| PASS | H2_INLINE | `spec8.beta_pos_0_0023` | `0.0023` | `0.0023` | +0 | 0.0001 | tbl_h2_master_summary.csv spec_id=8 headline_beta |
| PASS | H2_INLINE | `spec8.p_0_008` | `0.008` | `0.008` | +0 | 0.001 | tbl_h2_master_summary.csv spec_id=8 headline_p |
| PASS | H2_INLINE | `panel.n_702` | `702` | `702` | +0 | 0 | tbl_h2_master_summary.csv spec_id=3 (HEADLINE) n |
| PASS | H2_INLINE | `panel.countries_123` | `123` | `123` | +0 | 0 | tbl_h2_master_summary.csv spec_id=3 n_countries |
| PASS | H2_INLINE | `binscatter.pre.beta_derived` | `0.002` | `0.002` | +0 | 0.0005 | derived: OLS adoption_percentile ~ financial_account_baseline over spec-3 sample (pre, post_2022=0); h2_diffusion_dataset.csv |
| PASS | H2_INLINE | `binscatter.pre.se_derived` | `0.0006` | `0.0006` | +0 | 0.0005 | derived: OLS adoption_percentile ~ financial_account_baseline over spec-3 sample (pre, post_2022=0); h2_diffusion_dataset.csv |
| PASS | H2_INLINE | `binscatter.pre.n_within_3` | `True` | `True` | — | 0 | derived: OLS adoption_percentile ~ financial_account_baseline over spec-3 sample (pre, post_2022=0); h2_diffusion_dataset.csv · derived n=356, dashboard n=356 |
| PASS | H2_INLINE | `binscatter.post.beta_derived` | `0.001` | `0.0013` | -0.0003 | 0.0005 | derived: OLS adoption_percentile ~ financial_account_baseline over spec-3 sample (post, post_2022=1); h2_diffusion_dataset.csv |
| PASS | H2_INLINE | `binscatter.post.se_derived` | `0.0007` | `0.0007` | +0 | 0.0005 | derived: OLS adoption_percentile ~ financial_account_baseline over spec-3 sample (post, post_2022=1); h2_diffusion_dataset.csv |
| PASS | H2_INLINE | `binscatter.post.n_within_3` | `True` | `True` | — | 0 | derived: OLS adoption_percentile ~ financial_account_baseline over spec-3 sample (post, post_2022=1); h2_diffusion_dataset.csv · derived n=349, dashboard n=346 |
| PASS | H3_SPECS | `full.beta` | `-14.2244` | `-14.2244` | +0 | 0.005 | tbl_h3_master_summary.csv spec=full |
| PASS | H3_SPECS | `full.se` | `11.9142` | `11.9142` | +0 | 0.005 | tbl_h3_master_summary.csv spec=full |
| PASS | H3_SPECS | `full.lo` | `-37.5759` | `-37.5759` | +0 | 0.005 | tbl_h3_master_summary.csv spec=full |
| PASS | H3_SPECS | `full.hi` | `9.1271` | `9.1271` | +0 | 0.005 | tbl_h3_master_summary.csv spec=full |
| PASS | H3_SPECS | `full.r2` | `0.0774` | `0.0774` | +0 | 0.005 | tbl_h3_master_summary.csv spec=full |
| PASS | H3_SPECS | `full.n` | `72` | `72` | +0 | 0 | tbl_h3_master_summary.csv spec=full |
| PASS | H3_SPECS | `full.hac` | `4` | `4` | +0 | 0 | tbl_h3_master_summary.csv spec=full |
| PASS | H3_SPECS | `full.p_match` | `True` | `True` | — | 0 | tbl_h3_master_summary.csv spec=full p=0.23252 |
| PASS | H3_SPECS | `postJun22.beta` | `20.4089` | `20.4089` | +0 | 0.005 | tbl_h3_master_summary.csv spec=postJun22 |
| PASS | H3_SPECS | `postJun22.se` | `15.5904` | `15.5904` | +0 | 0.005 | tbl_h3_master_summary.csv spec=postJun22 |
| PASS | H3_SPECS | `postJun22.lo` | `-10.1478` | `-10.1478` | +0 | 0.005 | tbl_h3_master_summary.csv spec=postJun22 |
| PASS | H3_SPECS | `postJun22.hi` | `50.9656` | `50.9656` | +0 | 0.005 | tbl_h3_master_summary.csv spec=postJun22 |
| PASS | H3_SPECS | `postJun22.r2` | `0.1401` | `0.1401` | +0 | 0.005 | tbl_h3_master_summary.csv spec=postJun22 |
| PASS | H3_SPECS | `postJun22.n` | `42` | `42` | +0 | 0 | tbl_h3_master_summary.csv spec=postJun22 |
| PASS | H3_SPECS | `postJun22.hac` | `3` | `3` | +0 | 0 | tbl_h3_master_summary.csv spec=postJun22 |
| PASS | H3_SPECS | `postJun22.p_match` | `True` | `True` | — | 0 | tbl_h3_master_summary.csv spec=postJun22 p=0.19051 |
| PASS | H3_SPECS | `postDec22.beta` | `-7.0876` | `-7.0876` | +0 | 0.005 | tbl_h3_master_summary.csv spec=postDec22 |
| PASS | H3_SPECS | `postDec22.se` | `14.806` | `14.806` | +0 | 0.005 | tbl_h3_master_summary.csv spec=postDec22 |
| PASS | H3_SPECS | `postDec22.lo` | `-36.1069` | `-36.1069` | +0 | 0.005 | tbl_h3_master_summary.csv spec=postDec22 |
| PASS | H3_SPECS | `postDec22.hi` | `21.9317` | `21.9317` | +0 | 0.005 | tbl_h3_master_summary.csv spec=postDec22 |
| PASS | H3_SPECS | `postDec22.r2` | `0.0244` | `0.0244` | +0 | 0.005 | tbl_h3_master_summary.csv spec=postDec22 |
| PASS | H3_SPECS | `postDec22.n` | `36` | `36` | +0 | 0 | tbl_h3_master_summary.csv spec=postDec22 |
| PASS | H3_SPECS | `postDec22.hac` | `3` | `3` | +0 | 0 | tbl_h3_master_summary.csv spec=postDec22 |
| PASS | H3_SPECS | `postDec22.p_match` | `True` | `True` | — | 0 | tbl_h3_master_summary.csv spec=postDec22 p=0.63215 |
| PASS | H3_SPECS | `chow.beta` | `119.419` | `119.419` | +0 | 0.005 | tbl_h3_master_summary.csv spec=chow |
| PASS | H3_SPECS | `chow.se` | `19.4048` | `19.4048` | +0 | 0.005 | tbl_h3_master_summary.csv spec=chow |
| PASS | H3_SPECS | `chow.lo` | `81.3866` | `81.3866` | +0 | 0.005 | tbl_h3_master_summary.csv spec=chow |
| PASS | H3_SPECS | `chow.hi` | `157.452` | `157.452` | +0 | 0.005 | tbl_h3_master_summary.csv spec=chow |
| PASS | H3_SPECS | `chow.r2` | `0.7702` | `0.7702` | +0 | 0.005 | tbl_h3_master_summary.csv spec=chow |
| PASS | H3_SPECS | `chow.n` | `72` | `72` | +0 | 0 | tbl_h3_master_summary.csv spec=chow |
| PASS | H3_SPECS | `chow.hac` | `4` | `4` | +0 | 0 | tbl_h3_master_summary.csv spec=chow |
| PASS | H3_SPECS | `chow.p_match` | `True` | `True` | — | 0 | tbl_h3_master_summary.csv spec=chow p=7.5499e-10 |
| PASS | H3_SPECS | `top5.beta` | `-5.8656` | `-5.8656` | +0 | 0.005 | tbl_h3_master_summary.csv spec=top5 |
| PASS | H3_SPECS | `top5.se` | `11.8751` | `11.8751` | +0 | 0.005 | tbl_h3_master_summary.csv spec=top5 |
| PASS | H3_SPECS | `top5.lo` | `-29.1403` | `-29.1403` | +0 | 0.005 | tbl_h3_master_summary.csv spec=top5 |
| PASS | H3_SPECS | `top5.hi` | `17.4092` | `17.4092` | +0 | 0.005 | tbl_h3_master_summary.csv spec=top5 |
| PASS | H3_SPECS | `top5.r2` | `0.0139` | `0.0139` | +0 | 0.005 | tbl_h3_master_summary.csv spec=top5 |
| PASS | H3_SPECS | `top5.n` | `72` | `72` | +0 | 0 | tbl_h3_master_summary.csv spec=top5 |
| PASS | H3_SPECS | `top5.hac` | `4` | `4` | +0 | 0 | tbl_h3_master_summary.csv spec=top5 |
| PASS | H3_SPECS | `top5.p_match` | `True` | `True` | — | 0 | tbl_h3_master_summary.csv spec=top5 p=0.62135 |
| PASS | H3_SPECS | `firstDiff.beta` | `1.2369` | `1.2369` | +0 | 0.005 | tbl_h3_master_summary.csv spec=firstDiff |
| PASS | H3_SPECS | `firstDiff.se` | `1.9364` | `1.9364` | +0 | 0.005 | tbl_h3_master_summary.csv spec=firstDiff |
| PASS | H3_SPECS | `firstDiff.lo` | `-2.5584` | `-2.5584` | +0 | 0.005 | tbl_h3_master_summary.csv spec=firstDiff |
| PASS | H3_SPECS | `firstDiff.hi` | `5.0322` | `5.0322` | +0 | 0.005 | tbl_h3_master_summary.csv spec=firstDiff |
| PASS | H3_SPECS | `firstDiff.r2` | `0.014` | `0.014` | +0 | 0.005 | tbl_h3_master_summary.csv spec=firstDiff |
| PASS | H3_SPECS | `firstDiff.n` | `71` | `71` | +0 | 0 | tbl_h3_master_summary.csv spec=firstDiff |
| PASS | H3_SPECS | `firstDiff.hac` | `4` | `4` | +0 | 0 | tbl_h3_master_summary.csv spec=firstDiff |
| PASS | H3_SPECS | `firstDiff.p_match` | `True` | `True` | — | 0 | tbl_h3_master_summary.csv spec=firstDiff p=0.52297 |
| PASS | H3_EVENTS | `terra.hhi0` | `3357.9` | `3357.9` | +0 | 0.05 | tbl_h3_structural_events.csv event='Terra/UST collapse' |
| PASS | H3_EVENTS | `terra.hhi1` | `2971.5` | `2971.5` | +0 | 0.05 | tbl_h3_structural_events.csv event='Terra/UST collapse' |
| PASS | H3_EVENTS | `terra.delta` | `-386.4` | `-386.4` | +0 | 0.15 | tbl_h3_structural_events.csv event='Terra/UST collapse' |
| PASS | H3_EVENTS | `ftx.hhi0` | `3306.1` | `3306.1` | +0 | 0.05 | tbl_h3_structural_events.csv event='FTX Ch. 11' |
| PASS | H3_EVENTS | `ftx.hhi1` | `3327.9` | `3327.9` | +0 | 0.05 | tbl_h3_structural_events.csv event='FTX Ch. 11' |
| PASS | H3_EVENTS | `ftx.delta` | `21.7` | `21.7` | +0 | 0.15 | tbl_h3_structural_events.csv event='FTX Ch. 11' |
| PASS | H3_EVENTS | `svb.hhi0` | `3544.7` | `3544.7` | +0 | 0.05 | tbl_h3_structural_events.csv event='SVB / USDC depeg' |
| PASS | H3_EVENTS | `svb.hhi1` | `4335.1` | `4335.1` | +0 | 0.05 | tbl_h3_structural_events.csv event='SVB / USDC depeg' |
| PASS | H3_EVENTS | `svb.delta` | `790.4` | `790.4` | +0 | 0.15 | tbl_h3_structural_events.csv event='SVB / USDC depeg' |
| PASS | H3_EVENTS | `busd.hhi0` | `3507.3` | `3507.3` | +0 | 0.05 | tbl_h3_structural_events.csv event='BUSD wind-down' |
| PASS | H3_EVENTS | `busd.hhi1` | `5216` | `5216` | +0 | 0.05 | tbl_h3_structural_events.csv event='BUSD wind-down' |
| PASS | H3_EVENTS | `busd.delta` | `1708.7` | `1708.8` | -0.1 | 0.15 | tbl_h3_structural_events.csv event='BUSD wind-down' |
| PASS | H3_EVENTS | `scaleIn.hhi0` | `4681` | `4681` | +0 | 0.05 | tbl_h3_structural_events.csv event='FDUSD/PYUSD scale-in' |
| PASS | H3_EVENTS | `scaleIn.hhi1` | `5242.1` | `5242.1` | +0 | 0.05 | tbl_h3_structural_events.csv event='FDUSD/PYUSD scale-in' |
| PASS | H3_EVENTS | `scaleIn.delta` | `561.1` | `561.1` | +0 | 0.15 | tbl_h3_structural_events.csv event='FDUSD/PYUSD scale-in' |
| PASS | H3_TOP3 | `start.rank1.sym` | `USDT` | `USDT` | — | 0 | tbl_h3_top3_stablecoins.csv rank=1 2020-01 |
| PASS | H3_TOP3 | `start.rank1.share` | `0.7681` | `0.7681` | +0 | 0.005 | tbl_h3_top3_stablecoins.csv rank=1 2020-01 |
| PASS | H3_TOP3 | `start.rank1.supply` | `3.19883e+09` | `3.19883e+09` | +0 | 15994.173270000001 | tbl_h3_top3_stablecoins.csv rank=1 2020-01 |
| PASS | H3_TOP3 | `start.rank2.sym` | `USDC` | `USDC` | — | 0 | tbl_h3_top3_stablecoins.csv rank=2 2020-01 |
| PASS | H3_TOP3 | `start.rank2.share` | `0.124` | `0.124` | +0 | 0.005 | tbl_h3_top3_stablecoins.csv rank=2 2020-01 |
| PASS | H3_TOP3 | `start.rank2.supply` | `5.16598e+08` | `5.16598e+08` | +0 | 2582.9885600000002 | tbl_h3_top3_stablecoins.csv rank=2 2020-01 |
| PASS | H3_TOP3 | `start.rank3.sym` | `USDP` | `USDP` | — | 0 | tbl_h3_top3_stablecoins.csv rank=3 2020-01 |
| PASS | H3_TOP3 | `start.rank3.share` | `0.0537` | `0.0537` | +0 | 0.005 | tbl_h3_top3_stablecoins.csv rank=3 2020-01 |
| PASS | H3_TOP3 | `start.rank3.supply` | `2.23523e+08` | `2.23523e+08` | +0 | 1117.61355 | tbl_h3_top3_stablecoins.csv rank=3 2020-01 |
| PASS | H3_TOP3 | `end.rank1.sym` | `USDT` | `USDT` | — | 0 | tbl_h3_top3_stablecoins.csv rank=1 2025-12 |
| PASS | H3_TOP3 | `end.rank1.share` | `0.6029` | `0.6029` | +0 | 0.005 | tbl_h3_top3_stablecoins.csv rank=1 2025-12 |
| PASS | H3_TOP3 | `end.rank1.supply` | `1.85088e+11` | `1.85088e+11` | +0 | 925437.54376 | tbl_h3_top3_stablecoins.csv rank=1 2025-12 |
| PASS | H3_TOP3 | `end.rank2.sym` | `USDC` | `USDC` | — | 0 | tbl_h3_top3_stablecoins.csv rank=2 2025-12 |
| PASS | H3_TOP3 | `end.rank2.share` | `0.248` | `0.248` | +0 | 0.005 | tbl_h3_top3_stablecoins.csv rank=2 2025-12 |
| PASS | H3_TOP3 | `end.rank2.supply` | `7.61439e+10` | `7.61439e+10` | +0 | 380719.39527000004 | tbl_h3_top3_stablecoins.csv rank=2 2025-12 |
| PASS | H3_TOP3 | `end.rank3.sym` | `USDe` | `USDe` | — | 0 | tbl_h3_top3_stablecoins.csv rank=3 2025-12 |
| PASS | H3_TOP3 | `end.rank3.share` | `0.0234` | `0.0234` | +0 | 0.005 | tbl_h3_top3_stablecoins.csv rank=3 2025-12 |
| PASS | H3_TOP3 | `end.rank3.supply` | `7.18423e+09` | `7.18423e+09` | +0 | 35921.125985000006 | tbl_h3_top3_stablecoins.csv rank=3 2025-12 |
| PASS | H3_TOP3 | `start.total_within_1pct` | `True` | `True` | — | 0 | h3_concentration.csv date=2020-01-01 total_supply_usd=3,952,167,565; dashboard=3,952,167,565; rel_diff=0.000% |
| PASS | H3_TOP3 | `end.total_within_1pct` | `True` | `True` | — | 0 | h3_concentration.csv date=2025-12-01 total_supply_usd=308,351,349,464; dashboard=307,076,789,530; rel_diff=0.413% |
| PASS | H3_INLINE | `chow.pre_break_slope_neg_126_5` | `-126.5` | `-126.5` | +0 | 0.1 | post-Dec-2022 β (-7.0876) − chow β (119.4193) = -126.5000 |
| PASS | H3_INLINE | `chow.post_break_slope_neg_7_1` | `-7.1` | `-7.1` | +0 | 0.1 | tbl_h3_master_summary.csv post-Dec-2022 β = -7.0876 |
| PASS | H3_INLINE | `chow.z_stat_6_15` | `6.15` | `6.15` | +0 | 0.05 | chow β/SE = 119.4193/19.4048 = 6.1500 |
| PASS | H3_INLINE | `usdt_share_77pct_2020` | `77` | `77` | +0 | 0 | tbl_h3_top3_stablecoins.csv USDT share 2020-01 = 0.7681 |
| PASS | H3_INLINE | `usdt_share_60pct_2025` | `60` | `60` | +0 | 0 | tbl_h3_top3_stablecoins.csv USDT share 2025-12 = 0.6029 |
| PASS | H3_INLINE | `trendOverlay.full_beta_neg_14_22` | `-14.2244` | `-14.2244` | +0 | 0.005 | tbl_h3_master_summary.csv full window β |
| PASS | H3_INLINE | `trendOverlay.postDec22_beta_neg_7_09` | `-7.0876` | `-7.0876` | +0 | 0.005 | tbl_h3_master_summary.csv post-Dec-2022 β |
| PASS | H3_INLINE | `trendOverlay.postJun22_beta_pos_20_41` | `20.4089` | `20.4089` | +0 | 0.005 | tbl_h3_master_summary.csv post-Jun-2022 β |
| PASS | Synthesis | `metcalfe.n_specs_eq_8` | `8` | `8` | +0 | 0 | tbl_h1_master_summary.csv rows with specification ~ 'levels OLS' (excludes first-diff robustness) |
| PASS | Synthesis | `metcalfe.max_p_lt_1e_40` | `True` | `True` | — | 0 | tbl_h1_master_summary.csv max(p_beta_equals_2) over 'levels OLS' specs = 1.10e-46 |
| PASS | Synthesis | `metcalfe.usdc_beta_near_1` | `True` | `True` | — | 0 | tbl_h1_master_summary.csv USDC full beta = 0.9821 |
| PASS | Synthesis | `metcalfe.usdt_beta_near_1` | `True` | `True` | — | 0 | tbl_h1_master_summary.csv USDT full beta = 1.0145 |
| PASS | Synthesis | `chow.beta_119_4` | `119.4` | `119.4` | +0 | 0 | tbl_h3_master_summary.csv Chow interaction beta = 119.4193 |
| PASS | Synthesis | `chow.p_lt_1e_9` | `True` | `True` | — | 0 | tbl_h3_master_summary.csv Chow interaction p_value = 7.55e-10 |
| PASS | Synthesis | `synth.tron_259x_at_200` | `259` | `259` | +0 | 0 | tbl_h4_cost_comparison.csv ratio_legacy_mean_to_tron_median @ $200 = 259.41 |
| PASS | Synthesis | `synth.eth_0_56x_at_200` | `0.56` | `0.56` | +0 | 0 | tbl_h4_cost_comparison.csv ratio_legacy_mean_to_eth_mean @ $200 = 0.56 |
| PASS | Synthesis | `synth.eth_worse_than_legacy_at_200` | `True` | `True` | — | 0 | ratio < 1 ⇒ legacy cheaper than ETH at $200 |
| PASS | Synthesis | `synth.eth_405_at_10k` | `405` | `405` | +0 | 0 | tbl_h4_master_summary.csv diff_10000_eth full window β = 404.7431 → rounds to $405 |
| PASS | Synthesis | `synth.eth_405_vs_legacy_mean_diff` | `True` | `True` | — | 0 | ($419.67 legacy_mean − $14.92 ETH_mean = $404.74 ≈ $405) per H4_COST + H4_SPECS |
| PASS | Synthesis | `masthead.h3_72_months` | `72` | `72` | +0 | 0 | tbl_h3_master_summary.csv full-window n |
| PASS | Synthesis | `masthead.h2_123_countries` | `123` | `123` | +0 | 0 | tbl_h2_master_summary.csv n_countries (any spec) |
| PASS | Synthesis | `masthead.h1_2192_daily` | `2192` | `2192` | +0 | 0 | tbl_h1_master_summary.csv USDC levels OLS full-window n |
| PASS | DATA | `data_js.has_h3_key` | `True` | `True` | — | 0 | window.DATA top-level keys = ['h3', 'h4', 'h1_monthly', 'h1_usdc', 'h1_usdt'] |
| PASS | DATA | `data_js.h3_72_rows` | `72` | `72` | +0 | 0 | len(window.DATA.h3) should match 72 monthly observations |

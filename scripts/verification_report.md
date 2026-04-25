# Dashboard verification report

- Repository: `C:\dev\ine`
- Total checks: **160**
- Pass: **160**  ·  Fail: **0**  ·  Skip: **0**

Tolerances: fee 1e-2 · ratio 1e-1 · regression coef 5e-3 · SE/CI 5e-2 · counts exact.

## Per-category summary

| Category | Total | Pass | Fail | Skip |
|---|---|---|---|---|
| DATA | 2 | 2 | 0 | 0 |
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

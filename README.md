# k6 Performance Testing

> Performance testing suite for API backend

## Test Scenarios

| Test | Description | Users | Duration |
|------|------------|--------|---------|
| `smoke.js` | Quick sanity check | 1 | 30s |
| `load.js` | Normal traffic simulation | 10 | 9 min |
| `stress.js` | Break the system | 10-100 | 16 min |
| `spike.js` | Sudden traffic burst | 10-100-10 | 4 min |
| `soak.js` | Long run stability | 10 | 40 min |
| `report.js` | Full report export | varies | varies |

## Usage

```bash
# Quick smoke test
k6 run smoke.js

# Load test
k6 run load.js

# Stress test
k6 run stress.js

# Export JSON
k6 run report.js --out json=results.json

# Export CSV (Excel compatible)
k6 run smoke.js --summary-export=report.csv
```

## Tested APIs

- **Employee** - `/component/modules/people/employee/e-onboarding-steps/form-component/store-content`
- **Announcement** - `/component/modules/announcements/announcement/form/form-component/store-content`
- **Award** - `/component/modules/appreciations/award/form/form-component/store-content`

## Install

```bash
# Windows
choco install k6

# macOS
brew install k6

# Linux
sudo apt install k6
```

## Project Structure

```
tests/
├── config.js     # Setup & tokens
├── lib.js      # Shared functions
├── smoke.js    # Smoke test
├── load.js    # Load test
├── stress.js   # Stress test
├── spike.js   # Spike test
├── soak.js    # Soak test
├── report.js  # Reporter
└── README.md # Docs
```
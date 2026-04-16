# k6 Performance Testing

> Performance testing suite for the YoSuite HR platform API backend using [Grafana k6](https://k6.io/)

## Project Video

[Watch the full video](https://drive.google.com/file/d/1OUtEMVd0TxaHnVbWnMOZpPVew09zsvCP/view?usp=sharing)

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Test Scenarios](#test-scenarios)
- [Tested APIs](#tested-apis)
- [Usage](#usage)
- [Thresholds & Pass Criteria](#thresholds--pass-criteria)
- [Test Payloads](#test-payloads)
- [Extending the Suite](#extending-the-suite)
- [Troubleshooting](#troubleshooting)

---

## Overview

This project uses **Grafana k6** to run performance tests against the YoSuite HR platform's REST API. Each test simulates virtual users (VUs) creating resources — employees, announcements, and awards — via `POST` requests with `multipart/form-data` payloads. The suite covers five standard performance test types: smoke, load, stress, spike, and soak.

**Target API:** `https://api-backend.yosuite.net` (configurable via `BASE_URL` env var)

---

## Architecture

```
┌─────────────┐     ┌──────────┐     ┌──────────────────────┐
│  Test Script │────▶│  lib.js  │────▶│  YoSuite API Backend  │
│ (smoke.js   │     │ (shared  │     │  (api-backend.       │
│  load.js    │     │  helpers) │     │   yosuite.net)       │
│  stress.js  │     └──────────┘     └──────────────────────┘
│  spike.js   │            ▲
│  soak.js)   │            │
└─────────────┘     ┌──────────┐
                    │ config.js│
                    │ (base URL│
                    │  tokens, │
                    │  stages, │
                    │thresholds│
                    │  headers)│
                    └──────────┘
```

- **`config.js`** — Single source of truth for all configuration (URL, tokens, stages, thresholds, headers)
- **`lib.js`** — Shared test functions imported by all test scripts
- **Test scripts** — Each defines its own k6 `options` (scenario + thresholds) and delegates work to `lib.js`

---

## Project Structure

```
using-k6-for-performance-testing/
├── config.js          # Central configuration (URL, tokens, stages, thresholds, headers)
├── lib.js             # Shared test functions (createEmployee, announcementCreation, awardCreation)
├── smoke.js           # Smoke test — quick sanity check
├── load.js            # Load test — normal traffic simulation
├── stress.js          # Stress test — find breaking point
├── spike.js           # Spike test — sudden traffic burst
├── soak.js            # Soak test — long-run stability
├── report.js          # Stress test with inline functions (for report export)
├── run-stress.js      # Alias for stress test
├── results.json       # Test output (JSON format)
├── report.csv         # Test output (CSV format)
└── README.md          # This file
```

---

## Installation

### Install k6

```bash
# Windows (Chocolatey)
choco install k6

# macOS (Homebrew)
brew install k6

# Linux (APT)
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg \
  --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A36442D57E1C5C4A4DF0B7618
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" \
  | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt update
sudo apt install k6
```

Verify installation:

```bash
k6 version
```

---

## Configuration

All configuration lives in **`config.js`**:

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `BASE_URL` | `https://api-backend.yosuite.net` | Target API base URL |

Override at runtime:

```bash
k6 run -e BASE_URL=https://staging-api.yosuite.net smoke.js
```

### Auth Tokens

Two Bearer tokens are hardcoded in `config.js`:

| Token | Used By |
|-------|---------|
| `EMPLOYEE_TOKEN` | Employee onboarding endpoint |
| `ANNOUNCEMENT_TOKEN` | Announcement and Award endpoints |

> **Note:** Tokens are AES-encrypted session tokens that expire. When tests fail with `401 Unauthorized`, update the tokens in `config.js`.

### Common Headers

All requests include browser-like headers (User-Agent, CORS headers, Referer, etc.) to match real frontend traffic patterns.

---

## Test Scenarios

| Test | File | Executor | VUs | Duration | Purpose |
|------|------|----------|-----|----------|---------|
| **Smoke** | `smoke.js` | `constant-vus` | 1 | 30s | Verify the API works at all |
| **Load** | `load.js` | `ramping-vus` | 0→10→10→0 | 9 min | Simulate normal expected traffic |
| **Stress** | `stress.js` | `ramping-vus` | 0→10→50→100→100→0 | 16 min | Find the system's breaking point |
| **Spike** | `spike.js` | `ramping-vus` | 0→10→100→10→0 | 4 min | Test recovery from sudden traffic surge |
| **Soak** | `soak.js` | `ramping-vus` | 0→10→10→0 | 40 min | Detect memory leaks / long-run degradation |

### Stage Details

**Load** (9 min total):
```
0 → 10 VUs  (2 min ramp-up)
10 → 10 VUs (5 min sustain)
10 → 0 VUs  (2 min ramp-down)
```

**Stress** (16 min total):
```
0 → 10 VUs   (2 min ramp-up)
10 → 50 VUs  (5 min ramp-up)
50 → 100 VUs (2 min ramp-up)
100 → 100 VUs (5 min sustain at peak)
100 → 0 VUs  (2 min ramp-down)
```

**Spike** (4 min total):
```
0 → 10 VUs   (1 min baseline)
10 → 100 VUs (1 min sudden spike)
100 → 10 VUs (1 min recovery)
10 → 0 VUs   (1 min ramp-down)
```

**Soak** (40 min total):
```
0 → 10 VUs  (5 min ramp-up)
10 → 10 VUs (30 min sustain)
10 → 0 VUs  (5 min ramp-down)
```

---

## Tested APIs

All endpoints use `POST` with `multipart/form-data` containing a JSON `data` field.

### 1. Employee Onboarding

| Property | Value |
|----------|-------|
| **URL** | `/component/modules/people/employee/e-onboarding-steps/form-component/store-content` |
| **Method** | `POST` |
| **Auth** | `Bearer EMPLOYEE_TOKEN` |
| **Content-Type** | `multipart/form-data` |
| **Success Message** | `Employee Added Successfully!` |

### 2. Announcement Creation

| Property | Value |
|----------|-------|
| **URL** | `/component/modules/announcements/announcement/form/form-component/store-content` |
| **Method** | `POST` |
| **Auth** | `Bearer ANNOUNCEMENT_TOKEN` |
| **Content-Type** | `multipart/form-data` |
| **Success Message** | `Data Inserted Successfully` |

### 3. Award Creation

| Property | Value |
|----------|-------|
| **URL** | `/component/modules/appreciations/award/form/form-component/store-content` |
| **Method** | `POST` |
| **Auth** | `Bearer ANNOUNCEMENT_TOKEN` |
| **Content-Type** | `multipart/form-data` |
| **Success Message** | `Data Inserted Successfully` |

---

## Usage

### Run Individual Tests

```bash
# Smoke test (quick sanity check)
k6 run smoke.js

# Load test (normal traffic)
k6 run load.js

# Stress test (find breaking point)
k6 run stress.js

# Spike test (sudden burst)
k6 run spike.js

# Soak test (long-run stability — takes 40 min)
k6 run soak.js
```

### Override Base URL

```bash
k6 run -e BASE_URL=https://your-api.example.com smoke.js
```

### Export Reports

```bash
# Export to JSON (for programmatic processing)
k6 run report.js --out json=results.json

# Export summary to CSV (Excel compatible)
k6 run smoke.js --summary-export=report.csv
```

### Run with Increased Duration/Iterations (for debugging)

```bash
# Run only 1 iteration
k6 run --iterations 1 smoke.js

# Run with custom VU count
k6 run --vus 5 --duration 60s smoke.js
```

### Run with k6 Cloud

```bash
k6 cloud smoke.js
```

---

## Thresholds & Pass Criteria

Tests will **fail** if any threshold is breached:

| Metric | Threshold | Meaning |
|--------|-----------|---------|
| `http_req_duration` | `p(95) < 500ms` | 95% of requests must complete under 500ms |
| `http_req_duration` | `p(99) < 1000ms` | 99% of requests must complete under 1s |
| `http_req_failed` | `rate < 0.1` | Less than 10% of requests may fail |
| `http_reqs` | `count > 0` | At least one request must succeed |

The smoke test uses a relaxed threshold (`p(95) < 500ms` only).

---

## Test Payloads

Each virtual user generates randomized test data on every iteration:

### Employee Payload

| Field | Generation |
|-------|-----------|
| `first_name` | `FN_{100-999}` |
| `last_name` | `LN_{100-999}` |
| `middle_name` | `MN_{100-999}` |
| `email` | `user{timestamp}@test.com` |
| `phone` | `8801{30000000-99999999}` |
| `staff_id` | `{100000-999999}` |
| `date_of_birth` | Random date between 1990–2002 |
| `hire_date` / `joining_date` | Current date |
| `address` | Randomized street, city, zip; country fixed as Anguilla |

### Announcement Payload

| Field | Generation |
|-------|-----------|
| `title` | `test_{0-10000}` |
| `content` | HTML paragraph with random text |
| `pinned` | Random boolean |
| `enable_comments` | Random boolean |

### Award Payload

| Field | Generation |
|-------|-----------|
| `name` | `test_{0-10000}` |
| `note` | `note_{timestamp}` |
| `award_item[].temp` | `Award_{0-100}` |
| `award_item[].gift_name` | `gift_{0-1000}` |
| `award_item[].price` | Random $50–$549 |
| `award_item[].currency` | Fixed `USD` |

---

## Extending the Suite

### Add a New API Endpoint

1. Add the endpoint URL and token to `config.js`
2. Create a new function in `lib.js` following the existing pattern (`createEmployee`, `announcementCreation`, `awardCreation`)
3. Import and call it in each test script's `default` function

### Add a New Test Scenario

1. Define new stages in `config.js` under `STAGES`
2. Create a new `.js` file following the pattern:
   ```js
   import { STAGES, THRESHOLDS } from './config.js';
   import { createEmployee, announcementCreation, awardCreation } from './lib.js';

   export const options = {
     scenarios: {
       yourScenario: {
         executor: 'ramping-vus',
         startVUs: 0,
         stages: STAGES.yourScenario,
       },
     },
     thresholds: THRESHOLDS,
   };

   export default function () {
     createEmployee();
     announcementCreation();
     awardCreation();
   }
   ```
3. Update the README test scenarios table

### Custom Thresholds

Override thresholds per test by modifying the `options.thresholds` object in the test file:

```js
export const options = {
  scenarios: { /* ... */ },
  thresholds: {
    http_req_duration: ['p(95)<200'],  // stricter
    http_req_failed: ['rate<0.01'],    // 1% failure tolerance
  },
};
```

---

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| `401 Unauthorized` | Expired auth token | Update `EMPLOYEE_TOKEN` / `ANNOUNCEMENT_TOKEN` in `config.js` |
| `Connection refused` | Wrong `BASE_URL` or server down | Verify the API is reachable: `curl https://api-backend.yosuite.net` |
| `p(95) > 500ms` threshold fail | Server under too much load | Reduce VUs in the stage definition or increase the threshold |
| `rate > 0.1` failure threshold | Too many HTTP errors | Check server logs; tokens may be expired or rate-limited |
| `SyntaxError` in k6 | ES module import issue | Ensure all imports use `.js` extension (e.g., `./config.js`) |

---

## Tech Stack

- **[Grafana k6](https://k6.io/)** — Open-source load testing tool
- **JavaScript (ES Modules)** — Test scripting language
- **YoSuite API** — Target system under test

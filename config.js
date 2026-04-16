// K6 Test Configuration

export const BASE_URL = __ENV.BASE_URL || 'https://api-backend.yosuite.net';

export const EMPLOYEE_TOKEN = 'AES-eyJjaXBoZXJ0ZXh0IjoiTmZ1c3B6VFpMNS9JZld5T1JZd0VFZW82UU5FYUdRWVJveGZHQjYrMzdlVnUvYWVkNXJOR1B6d0ZnMkxrblJWQkMrZXA0U3ZkTldTL0FzQWViQmxIcUxkOHIwSEh3SVE2YnR5TFYwQTlvSEVSYnZXWGZucnlvbXhxTTUxTUNONThLK3NTQ1lQOWZ5N01aSnl2eU1IMnBSSlo1NnlHTU1oMk1idjM4QUErcEhBZVhSUjFXd2M5dVRQdlpieC9FRkY4akhxQlJrT3dJK0hzcHNxQVVMNVd0c0psL0JRVjZMUXZyTiswRXlEUVB0ZStPaWt1cHRRNEQ3YWZVWUUvdWhPMjUzUTFXbnpyT0VVYUg0WDBUaXFJQ1VrNUdSWjVpanBBSm5qb0RhZGxwRGMzNHhCa3NQL1BxU21IblBnSWcvMnBFUDVody96MlZZamxDTXBJYnVJdEJOYnZNWmdHT0JSVVNVenFJdDl1MnIxT0wvWENEdnZPYXNrTEU0L0ZJWU5WQ2NyOGZraDZLMlQ3a0k3Q0ltZHJ2MXNVd0dLREZrZUpXblAyZkpEcUFLVEVvbmVmWUpTdGlMaENKVnV3bHBLMXJxOU1WTzgxSllSQ3k4K0dEUExjUkthWWlYQWFydk5kcUJ4RE1ZbGUxTDl6ellYYkxHbmJWang5WmFvMEZ5aFAiLCJzYWx0IjoiOTc1N2Y0NGIwODcxMTEzZGViODAwNTc1N2JmN2U5NjQiLCJpdiI6IjBiMzg5YjFiNmRlZWRkOTYxNmQxYTc3ODI3MzU3OGEzIiwiaXRlcmF0aW9ucyI6OTk5fQ==';
export const ANNOUNCEMENT_TOKEN = 'AES-eyJjaXBoZXJ0ZXh0IjoiSFlKbW8vYzVvTTRLSHlsaXJ0bk1aa1UzL3Bpelh3NCtETE0rNy90bGFpTGJDWmpEaHJMT3lncVR2azdvOTBUL1pPOGRIdE1VTXAwN004S0Jpc3VQMVJBQWhMblpHazlzVWtGMThISnd1czlqREhacTJqeFZMaHkxWU40ZHpYYUFqTW02emdyclpwTDUrQXhDT0taT3lrTUVSTlR5TnVLYUhXZGt5MjBUZkRMN1ZGVlR3bW14ZlVtbk1adkNURE91cXQvNmFwYmt3VGYxSjc1TVhEOHJyanR1K3N4VktYQkx5QnhJWVpmbStvdVl5MFdvb25IVE5EYlc3b2d0MDZSZDBZSGJ4Yk9wU1ZLN1BWWFRQdDE1bWo4RXBYSGJ2cktxbzd3R0k3Nk1XNFJwZnJuNHg0WGJIZDFUT1ZFTGlaUkpYSjdSUmNzclBuMmRvNm9nUXhTZXJYSitTVU9PVy9JN3A4OThmZEVXcFIrYzJoWXUrTEc4VWJ0R3lUUTNsaUhxWDF4bm1MK2ZEaFdnTC9MSnZXOHVuSjhDMi9zMy9mR25uMVNveVhsOTZtbDYxSVRYbmZEOTFZaCs3RTVZaHNPbEdQUzFXaGhiSFhTd0oxSTQxelNjeitja08veHVyUHlBVG94UlYwMVZhNkI0NTRYRUtHcXJsLzJteCtlc1dTUTkiLCJzYWx0IjoiZGJiMmQ4ZTRlMjBiNzllOTVlZTA3ZjE4ZDlkNzlhOWYiLCJpdiI6IjMxM2M1ZjQzMjU0MTkwNGE1MzFhNGY1ZDA5YjAyMmYyIiwiaXRlcmF0aW9ucyI6OTk5fQ==';

export const STAGES = {
  smoke: [
    { duration: '30s', target: 1 },
  ],
  load: [
    { duration: '2m', target: 10 },
    { duration: '5m', target: 10 },
    { duration: '2m', target: 0 },
  ],
  stress: [
    { duration: '2m', target: 10 },
    { duration: '5m', target: 50 },
    { duration: '2m', target: 100 },
    { duration: '5m', target: 100 },
    { duration: '2m', target: 0 },
  ],
  spike: [
    { duration: '1m', target: 10 },
    { duration: '1m', target: 100 },
    { duration: '1m', target: 10 },
    { duration: '1m', target: 0 },
  ],
  soak: [
    { duration: '5m', target: 10 },
    { duration: '30m', target: 10 },
    { duration: '5m', target: 0 },
  ],
};

export const THRESHOLDS = {
  'http_req_duration': ['p(95)<500', 'p(99)<1000'],
  'http_req_failed': ['rate<0.1'],
  'http_reqs': ['count>0'],
};

export const commonHeaders = {
  'accept': '*/*',
  'accept-language': 'en-US,en;q=0.9',
  'origin': 'https://microsoft.yosuite.net',
  'priority': 'u=1, i',
  'referer': 'https://microsoft.yosuite.net/',
  'sec-ch-ua': '"Chromium";v="146", "Not-A.Brand";v="24", "Google Chrome";v="146"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Windows"',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'same-site',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36',
};
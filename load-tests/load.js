/**
 * Load test — ramps to 50 concurrent users over 2 minutes.
 * Run: k6 run load-tests/load.js -e BASE_URL=https://your-tiza.vercel.app
 */
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const errorRate   = new Rate('errors');
const ttfb        = new Trend('ttfb', true);

export const options = {
  stages: [
    { duration: '30s', target: 10  },   // ramp up
    { duration: '60s', target: 50  },   // hold at 50 users
    { duration: '30s', target: 0   },   // ramp down
  ],
  thresholds: {
    errors:            ['rate<0.05'],    // < 5% error rate
    http_req_duration: ['p(95)<3000'],   // 95th percentile < 3s
    ttfb:              ['p(90)<800'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:4173';

const PAGES = ['/', '/login', '/register'];

export default function () {
  const page = PAGES[Math.floor(Math.random() * PAGES.length)];
  const res  = http.get(`${BASE_URL}${page}`, {
    headers: { 'Accept': 'text/html' },
  });

  ttfb.add(res.timings.waiting);

  const ok = check(res, {
    'status 2xx': (r) => r.status >= 200 && r.status < 300,
  });
  errorRate.add(!ok);
  sleep(Math.random() * 2 + 1);
}
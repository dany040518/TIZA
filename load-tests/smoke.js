/**
 * Smoke test — verifies the app is up and responds fast.
 * Run: k6 run load-tests/smoke.js -e BASE_URL=https://your-tiza.vercel.app
 */
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus:      1,
  duration: '30s',
  thresholds: {
    http_req_failed:   ['rate<0.01'],
    http_req_duration: ['p(95)<1500'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:4173';

export default function () {
  const res = http.get(BASE_URL);
  check(res, {
    'status 200':          (r) => r.status === 200,
    'has TIZA title':      (r) => r.body.includes('TIZA'),
    'response < 1.5s':     (r) => r.timings.duration < 1500,
  });
  sleep(1);
}
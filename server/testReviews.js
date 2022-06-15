import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 100,
  duration: '30s'
}

export default function () {
  let product_id = Math.random() * (1000011 - 900002 + 1) + 900002;
  http.get(`http://localhost:5433/reviews`, { product_id });
  sleep(.1);
}
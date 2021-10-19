import axios from 'axios';

const INGRESS_NGINX = 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local';
const BASE_URL = process.env.BASE_URL || INGRESS_NGINX;

export default ({ req }) => {
  if (typeof window === 'undefined') {
    // We are on the server

    return axios.create({
      baseURL: BASE_URL,
      headers: req.headers,
    });
  } else {
    // We must be on the browser
    return axios.create({
      baseUrl: '/',
    });
  }
};

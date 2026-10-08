export const API_BASE = ['localhost','127.0.0.1'].includes(location.hostname)
  ? 'http://127.0.0.1:8787'
  : 'API_URL_PENDING_DEPLOY';

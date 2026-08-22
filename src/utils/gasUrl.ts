let cachedGasUrl: string | null = null;
let isCached = false;

export function getGasUrl(): string | null {
  if (!isCached) {
    cachedGasUrl = localStorage.getItem('blackout_gas_url');
    isCached = true;
  }
  return cachedGasUrl;
}

export function setGasUrl(url: string): void {
  localStorage.setItem('blackout_gas_url', url);
  cachedGasUrl = url;
  isCached = true;
}

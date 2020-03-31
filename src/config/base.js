export const APP_SLUG = 'shw';
export const SECONDARY_COLOR = '#19a79a';
export const DANGER_COLOR = SECONDARY_COLOR;

export const { REACT_APP_IS_DEV: IS_DEV } = process.env;

export const LOGIC_TYPES_KEYFILE = 'LOGIC_TYPES_KEYFILE';
export const LOGIC_TYPES_MNEMONIC = 'LOGIC_TYPES_MNEMONIC';

export const CHAINS_LIST = [
  { id: 'etc', name: 'Ethereum Classic', tokenSymbol: 'ETC' },
  { id: 'eth', name: 'Ethereum', tokenSymbol: 'ETH' },
];

export const CHAINS_MAP = {};
CHAINS_LIST.forEach(c => (CHAINS_MAP[c.id] = c));

export const ETC_NETWORKS = [
  { name: 'mainnet', providerUrl: 'https://www.ethercluster.com/etc' },
  { name: 'kotti', providerUrl: 'https://www.ethercluster.com/kotti' },
  {
    name: 'mordor',
    providerUrl: 'https://www.ethercluster.com/mordor',
  },
].map(n => ({ ...n, id: `etc-${n.name}`, chain: 'etc' }));

export const ETH_NETWORKS = [
  'mainnet',
  'ropsten',
  'kovan',
  'rinkeby',
  'goerli',
].map(name => ({
  id: `eth-${name}`,
  name,
  chain: 'eth',
  providerUrl: `https://${name}.infura.io/v3/`,
}));

export const NETWORKS_LIST = [...ETC_NETWORKS, ...ETH_NETWORKS];

export const NETWORKS_MAP = {};
NETWORKS_LIST.forEach(n => (NETWORKS_MAP[n.id] = n));

export const DEFAULT_SIGNATORY_SERVER_URL = `${window.location.protocol}//${window.location.hostname}:1999`;
export const DEFAULT_NETWORK = 'etc-mainnet';

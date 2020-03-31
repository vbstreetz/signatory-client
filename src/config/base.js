export const APP_SLUG = 'shw';
export const SECONDARY_COLOR = '#19a79a';
export const DANGER_COLOR = SECONDARY_COLOR;

export const { REACT_APP_IS_DEV: IS_DEV } = process.env;
export const INFURA_API_KEY = process.env.REACT_APP_INFURA_API_KEY;

export const LOGIC_TYPES_KEYFILE = 'LOGIC_TYPES_KEYFILE';
export const LOGIC_TYPES_MNEMONIC = 'LOGIC_TYPES_MNEMONIC';

export const ETH_CHAIN = 1;
export const ETC_CHAIN = 61;
export const CHAINS = {
  [ETH_CHAIN]: {
    name: 'Ethereum',
    tokenSymbol: 'ETH',
    networks: {
      3: { name: 'ropsten' },
      42: { name: 'kovan' },
      4: { name: 'rinkeby' },
      5: { name: 'goerli' },
      1: { name: 'mainnet' },
    },
  },
  [ETC_CHAIN]: {
    name: 'Ethereum Classic',
    tokenSymbol: 'ETC',
    networks: {
      1: { name: 'mainnet', providerUrl: 'https://www.ethercluster.com/etc' },
      6: { name: 'kotti', providerUrl: 'https://www.ethercluster.com/kotti' },
      63: { name: 'kotti', providerUrl: 'https://www.ethercluster.com/mordor' },
    },
  },
};

Object.entries(CHAINS[ETH_CHAIN].networks).forEach(([id, network]) => {
  network.providerUrl = `https://${network.name}.infura.io/v3/${INFURA_API_KEY}`;
});

export const DEFAULT_SIGNATORY_SERVER_URL = `${window.location.protocol}//${window.location.hostname}:1999`;
export const DEFAULT_CHAIN_ID = ETC_CHAIN;
export const DEFAULT_NETWORK_ID = 1;

import { createSelector } from 'reselect';
import Web3 from 'web3';
import { NETWORKS_MAP } from 'config';

export const web3Selector = createSelector(
  state => state.wallet.network,
  state => state.wallet.infuraApiKey,
  (network, infuraApiKey) => {
    const { providerUrl, chain } = NETWORKS_MAP[network];
    return new Web3(
      new Web3.providers.HttpProvider(
        providerUrl + (chain === 'eth' ? infuraApiKey : '')
      )
    );
  }
);

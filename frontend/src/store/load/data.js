import cache from 'utils/cache';
import {
  DEFAULT_SIGNATORY_SERVER_URL,
  DEFAULT_CHAIN_ID,
  DEFAULT_NETWORK_ID,
} from 'config';

export default Base =>
  class extends Base {
    async loadData() {
      try {
        const type = cache('login_type');
        const wallet = cache('wallet');
        const passphrase = cache('passphrase');
        const accounts = cache('accounts') || [];
        const account = cache('account');

        this.state.wallet.type = type;
        this.state.wallet.wallet = wallet;
        this.state.wallet.account = account;
        this.state.wallet.passphrase = passphrase || cache('passphrase');
        this.state.wallet.accounts = accounts;
        this.state.wallet.signatoryServerUrl =
          cache('signatoryServerUrl') || DEFAULT_SIGNATORY_SERVER_URL;
        this.state.wallet.chainId = cache('chainId') || DEFAULT_CHAIN_ID;
        this.state.wallet.networkId = cache('networkId') || DEFAULT_NETWORK_ID;
      } catch (error) {
        console.log(error);
      }
    }
  };
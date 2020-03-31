import cache from 'utils/cache';
import { DEFAULT_SIGNATORY_SERVER_URL, DEFAULT_NETWORK } from 'config';

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
        this.state.wallet.network = cache('network') || DEFAULT_NETWORK;
        this.state.wallet.infuraApiKey = cache('infuraApiKey');
      } catch (error) {
        console.log(error);
      }
    }
  };

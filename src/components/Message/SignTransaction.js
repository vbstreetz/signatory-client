import React from 'react';
import { connect } from 'react-redux';
import clsx from 'clsx';
import NProgress from 'nprogress';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button, Paper, Tooltip } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import LaunchIcon from '@material-ui/icons/Launch';
import { stringToHex, numberToHex } from '@etclabscore/eserialize';

import sl from 'utils/sl';
import { sleep } from 'utils';
import * as mapDispatchToProps from 'actions';
import { IS_DEV, CHAINS_MAP, NETWORKS_MAP, SECONDARY_COLOR } from 'config';
import { web3Selector } from 'selectors/wallet';

const useStyles = makeStyles(theme => ({
  result: {
    wordBreak: 'break-all',
  },
  row: {
    marginBottom: 20,
  },
  buttons: {
    '& > *': {
      width: 150,
    },
  },
  transactionLink: {
    color: SECONDARY_COLOR,
    '& > svg': {
      marginLeft: 5,
    },
  },
}));

const SAMPLE = {
  value: '0.1',
  data: '',
  gasPrice: '0.08',
  gasLimit: '23000',
};

const Component = ({
  from,
  accounts,
  passphrase,
  rpc,
  web3,
  network,
  updateWallet,
  latestTxnHash,
}) => {
  const classes = useStyles();
  const [result, setResult] = React.useState(null);
  const [to, setTo] = React.useState('');
  const [nonce, setNonce] = React.useState(0);
  const n = NETWORKS_MAP[network];
  const { tokenSymbol } = CHAINS_MAP[n.chain];

  const getNounce = () => web3.eth.getTransactionCount(from);

  const updateNonce = async () => {
    setNonce(await getNounce());
  };

  React.useEffect(() => {
    updateNonce(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, network, latestTxnHash]);

  //

  const onSignTransaction = async e => {
    e.preventDefault();

    setResult(null);

    const payload = {};
    ['value', 'gasLimit', 'gasPrice', 'nonce', 'data'].forEach(k => {
      payload[k] = (e.target[k].value ?? '').trim();
    });

    try {
      const data = stringToHex(payload.data);
      const transactionSig = await rpc(
        'signTransaction',
        {
          from,
          nonce: numberToHex(await getNounce()), // refetch just in case
          gas: numberToHex(parseInt(payload.gasLimit)),
          gasPrice: web3.utils.toHex(
            web3.utils.toWei(payload.gasPrice, 'gwei')
          ),
          to,
          value: web3.utils.toHex(web3.utils.toWei(payload.value, 'ether')),
          data: data === '0x' ? '0x00' : data,
        },
        passphrase,
        numberToHex(await web3.eth.getChainId())
      );

      setResult({ transactionSig });
    } catch (e) {
      console.log(JSON.stringify(e.data, null, 2) || e.message);
    }
  };

  const onBroadcastTransaction = async () => {
    setResult(null);
    NProgress.start();
    NProgress.set(0.4);

    try {
      const { transactionHash } = await web3.eth.sendSignedTransaction(
        result.transactionSig
      );
      setResult({ transactionHash });
      await sleep(1000);
      updateWallet({ latestTxnHash: transactionHash });
    } catch (e) {
      sl('error', e.message);
    } finally {
      NProgress.done();
    }
  };

  return (
    <form onSubmit={onSignTransaction} className="flex flex--column">
      <div className={classes.row}>
        <TextField
          id="from"
          label="From Address"
          type="text"
          InputLabelProps={{
            shrink: true,
          }}
          placeholder={'0x1234...'}
          disabled
          value={from}
          fullWidth
          required
        />
      </div>

      <div className={classes.row}>
        <Autocomplete
          id="to-autocomplete"
          options={accounts.filter(a => a !== from)}
          value={to}
          onChange={(e, value) => setTo(value)}
          onInputChange={e => setTo(e.target.value)}
          renderInput={params => (
            <TextField
              {...params}
              id="to"
              label="To Address"
              type="text"
              InputLabelProps={{
                shrink: true,
              }}
              placeholder={'0x5678...'}
              fullWidth
              required
            />
          )}
        />
      </div>

      <div className={classes.row}>
        <TextField
          id="value"
          label={`Value / Amount to Send (${tokenSymbol})`}
          type="text"
          InputLabelProps={{
            shrink: true,
          }}
          placeholder={'Amount...'}
          defaultValue={IS_DEV ? SAMPLE.value : ''}
          fullWidth
          required
        />
      </div>

      <div className={classes.row}>
        <TextField
          id="gasLimit"
          label="Gas Limit"
          type="text"
          InputLabelProps={{
            shrink: true,
          }}
          placeholder={'21000'}
          defaultValue={SAMPLE.gasLimit}
          fullWidth
          required
        />
      </div>

      <div className={classes.row}>
        <TextField
          id="gasPrice"
          label="Gas Price (GWEI)"
          type="text"
          InputLabelProps={{
            shrink: true,
          }}
          placeholder={'0'}
          defaultValue={SAMPLE.gasPrice}
          fullWidth
          required
        />
      </div>

      <div className={classes.row}>
        <TextField
          id="nonce"
          label="Nonce"
          type="text"
          InputLabelProps={{
            shrink: true,
          }}
          value={nonce}
          disabled
          fullWidth
        />
      </div>

      <div className={classes.row}>
        <TextField
          id="data"
          label="Data"
          type="text"
          InputLabelProps={{
            shrink: true,
          }}
          placeholder={'0x5d1b...'}
          defaultValue={IS_DEV ? SAMPLE.data : ''}
          fullWidth
        />
      </div>

      <div className={clsx(classes.row, classes.buttons)}>
        <Button type="submit" variant="contained" color="secondary">
          Sign
        </Button>
        &nbsp;
        <Button
          type="button"
          variant="contained"
          color="secondary"
          disabled={!result?.transactionSig}
          onClick={onBroadcastTransaction}
        >
          Broadcast
        </Button>
      </div>

      {!result ? null : (
        <div className={classes.row}>
          <Paper elevation={0} className={classes.result}>
            {!result.transactionSig ? null : result.transactionSig}
            {!result.transactionHash ? null : (
              <Tooltip title="View transaction in blockexplorer">
                <a
                  href={n.explorerBaseDomain + result.transactionHash}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={clsx(
                    classes.transactionLink,
                    'flex',
                    'flex--align-center'
                  )}
                >
                  {result.transactionHash} <LaunchIcon />
                </a>
              </Tooltip>
            )}
          </Paper>
        </div>
      )}
    </form>
  );
};

export default connect(state => {
  const {
    wallet: { account, accounts, passphrase, network, latestTxnHash },
  } = state;
  return {
    accounts,
    from: account,
    passphrase,
    network,
    web3: web3Selector(state),
    latestTxnHash,
  };
}, mapDispatchToProps)(Component);

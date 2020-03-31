import React from 'react';
import { connect } from 'react-redux';
import clsx from 'clsx';
import NProgress from 'nprogress';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button, Paper } from '@material-ui/core';
import { stringToHex, numberToHex } from '@etclabscore/eserialize';

import sl from 'utils/sl';
import * as mapDispatchToProps from 'actions';
import { IS_DEV, CHAINS_MAP, NETWORKS_MAP } from 'config';
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
}));

const SAMPLE = {
  value: '0.1',
  data: '',
  gasPrice: '0.08',
  gasLimit: '23000',
};

const Component = ({ from, to, passphrase, rpc, web3, network }) => {
  const classes = useStyles();
  const [result, setResult] = React.useState(null);
  const { tokenSymbol } = CHAINS_MAP[NETWORKS_MAP[network].chain];

  const onSignTrasaction = async e => {
    e.preventDefault();

    setResult(null);

    const payload = {};
    ['from', 'to', 'value', 'gasLimit', 'gasPrice', 'nonce', 'data'].forEach(
      k => {
        payload[k] = (e.target[k].value ?? '').trim();
      }
    );

    try {
      payload.nonce = await web3.eth.getTransactionCount(payload.from);
      const data = stringToHex(payload.data);
      const sig = await rpc(
        'signTransaction',
        {
          from: payload.from,
          nonce: numberToHex(parseInt(payload.nonce)),
          gas: numberToHex(parseInt(payload.gasLimit)),
          gasPrice: web3.utils.toHex(
            web3.utils.toWei(payload.gasPrice, 'gwei')
          ),
          to: payload.to,
          value: web3.utils.toHex(web3.utils.toWei(payload.value, 'ether')),
          data: data === '0x' ? '0x00' : data,
        },
        passphrase,
        numberToHex(await web3.eth.getChainId())
      );

      setResult(sig);
    } catch (e) {
      console.log(JSON.stringify(e.data, null, 2) || e.message);
    }
  };

  const onBroadcastTrasaction = async() => {
    setResult('');
    NProgress.start();
    NProgress.set(0.4);

    try {
      const { transactionHash } = await web3.eth.sendSignedTransaction(result);
      setResult(transactionHash);
    } catch (e) {
      sl('error', e.message);
    } finally {
      NProgress.done();
    }
  };

  return (
    <form onSubmit={onSignTrasaction} className="flex flex--column">
      <div className={classes.row}>
        <TextField
          id="from"
          label="From Address"
          type="text"
          InputLabelProps={{
            shrink: true,
          }}
          placeholder={'0x1234...'}
          defaultValue={from || ''}
          fullWidth
          required
        />
      </div>

      <div className={classes.row}>
        <TextField
          id="to"
          label="To Address"
          type="text"
          InputLabelProps={{
            shrink: true,
          }}
          placeholder={'0x5678...'}
          defaultValue={to || ''}
          fullWidth
          required
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
          placeholder={'0'}
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
          disabled={!result}
          onClick={onBroadcastTrasaction}
        >
          Broadcast
        </Button>
      </div>

      {!result ? null : (
        <div className={classes.row}>
          <Paper elevation={0} className={classes.result}>
            {result}
          </Paper>
        </div>
      )}
    </form>
  );
};

export default connect((state, { match }) => {
  const {
    wallet: { account, accounts, passphrase, network },
  } = state;
  return {
    from: account,
    to: accounts[1],
    passphrase,
    network,
    web3: web3Selector(state),
  };
}, mapDispatchToProps)(Component);

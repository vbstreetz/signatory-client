import React from 'react';
import { connect } from 'react-redux';
import NProgress from 'nprogress';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button, Paper } from '@material-ui/core';

import * as mapDispatchToProps from 'actions';
import { web3Selector } from 'selectors/wallet';

const useStyles = makeStyles(theme => ({
  result: {
    wordBreak: 'break-all',
  },
  row: {
    marginBottom: 20,
  },
}));

const Component = ({ web3 }) => {
  const classes = useStyles();
  const [result, setResult] = React.useState(null);

  const onSubmit = async e => {
    e.preventDefault();

    setResult('');
    NProgress.start();
    NProgress.set(0.4);

    const signedTransaction = (e.target.signedTransaction.value ?? '').trim();
    const { transactionHash } = await web3.eth.sendSignedTransaction(
      signedTransaction
    );

    NProgress.done();
    setResult(transactionHash);
  };

  return (
    <form {...{ onSubmit }} className="flex flex--column">
      <div className={classes.row}>
        <TextField
          id="signedTransaction"
          label="Signed Transaction"
          type="text"
          InputLabelProps={{
            shrink: true,
          }}
          placeholder={'0x4355c47d63924e8a...'}
          fullWidth
          multiline
          rows="2"
          required
        />
      </div>
      <div className={classes.row}>
        <Button type="submit" variant="contained" color="secondary">
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
  return { web3: web3Selector(state) };
}, mapDispatchToProps)(Component);

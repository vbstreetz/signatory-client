import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button, Paper } from '@material-ui/core';
import { stringToHex, numberToHex } from '@etclabscore/eserialize';
import { web3Selector } from 'selectors/wallet';

const useStyles = makeStyles(theme => ({
  result: {
    wordBreak: 'break-all',
  },
  row: {
    marginBottom: 20,
  },
}));

const Component = ({ account, passphrase, rpc, web3 }) => {
  const classes = useStyles();
  const [result, setResult] = React.useState(null);

  const onSubmit = async e => {
    e.preventDefault();

    setResult(null);

    const msg = (e.target.message.value ?? '').trim();
    const sig = await rpc(
      'sign',
      stringToHex(msg),
      account,
      passphrase,
      numberToHex(await web3.eth.getChainId())
    );

    setResult(sig);
  };

  return (
    <form {...{ onSubmit }} className="flex flex--column">
      <div className={classes.row}>
        <TextField
          id="message"
          label="Message"
          type="text"
          InputLabelProps={{
            shrink: true,
          }}
          placeholder={'Enter message...'}
          fullWidth
          multiline
          rows="2"
          required
        />
      </div>

      <div className={classes.row}>
        <Button type="submit" variant="contained" color="secondary">
          Sign
        </Button>
      </div>

      {!result ? null : (
        <Paper elevation={0} className={classes.result}>
          {result}
        </Paper>
      )}
    </form>
  );
};

export default connect((state, { match }) => {
  const {
    wallet: { account, passphrase },
  } = state;
  return { account, passphrase, web3: web3Selector(state) };
}, mapDispatchToProps)(Component);

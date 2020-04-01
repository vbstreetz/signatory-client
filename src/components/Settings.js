import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Button,
  TextField,
  Paper,
  NativeSelect,
  FormControl,
  InputLabel,
} from '@material-ui/core';
import { CHAINS_LIST, NETWORKS_LIST } from 'config';
import * as mapDispatchToProps from 'actions';
import { makeStyles } from '@material-ui/core/styles';
import qs from 'query-string';
import clsx from 'clsx';
import cache from 'utils/cache';
import * as string from 'utils/string';

const useStyles = makeStyles(theme => ({
  container: { width: 800 },
  containerinner: {
    padding: 50,
  },
  row: {
    marginBottom: 20,
    width: '100%',
  },
  heading: {
    marginBottom: 30,
  },
  button: {
    width: 150,
  },
}));

function Component({ match, updateWallet, wallet, history }) {
  const classes = useStyles();
  const query = qs.parse(window.location.search.replace('?', ''));
  const backTo = query['back-to'] || '/';
  const [formData, setFormData] = React.useState({
    ...wallet,
    chain: wallet.network.split('-')[0],
  });
  const handleFormDataChange = data => {
    setFormData({
      ...formData,
      ...data,
    });
  };

  const onSubmit = async e => {
    e.preventDefault();
    const { signatoryServerUrl, network, infuraApiKey } = formData;
    cache('signatoryServerUrl', formData.signatoryServerUrl);
    cache('chain', formData.chain);
    cache('network', formData.network);
    cache('infuraApiKey', formData.infuraApiKey);
    updateWallet({ network, signatoryServerUrl, infuraApiKey });
    history.push(backTo);
  };

  return (
    <div className={clsx('flex flex--justify-center')}>
      <Paper className={classes.container}>
        <form
          {...{ onSubmit }}
          className={clsx(
            classes.containerinner,
            'flex flex--column flex--grow'
          )}
        >
          <h1 className={classes.heading}>Settings</h1>

          <div className={classes.row}>
            <TextField
              id="signatoryServerUrl"
              label="Signatory Server Url"
              type="url"
              InputLabelProps={{
                shrink: true,
              }}
              placeholder={'http://localhost:1999'}
              value={formData.signatoryServerUrl || ''}
              onChange={e =>
                handleFormDataChange({ signatoryServerUrl: e.target.value })
              }
              fullWidth
              required
            />
          </div>

          <FormControl className={classes.row}>
            <InputLabel shrink htmlFor="age-native-label-placeholder">
              Chain*
            </InputLabel>
            <NativeSelect
              value={formData.chain}
              onChange={e => {
                const chain = e.target.value;
                handleFormDataChange({
                  chain,
                  network: `${chain}-mainnet`,
                });
              }}
              inputProps={{
                name: 'chain',
                id: 'chain',
              }}
              fullWidth
            >
              {CHAINS_LIST.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </NativeSelect>
          </FormControl>

          <FormControl className={classes.row}>
            <InputLabel shrink htmlFor="age-native-label-placeholder">
              Network*
            </InputLabel>
            <NativeSelect
              value={formData.network}
              onChange={e => handleFormDataChange({ network: e.target.value })}
              inputProps={{
                name: 'network',
                id: 'network',
              }}
              fullWidth
            >
              {NETWORKS_LIST.filter(n => n.chain === formData.chain).map(n => (
                <option key={n.name} value={n.id}>
                  {string.toTitleCase(n.name)}
                </option>
              ))}
            </NativeSelect>
          </FormControl>

          <div className={classes.row}>
            <TextField
              id="infuraApiKey"
              label="Infura Api Key"
              type="text"
              InputLabelProps={{
                shrink: true,
              }}
              value={formData.infuraApiKey || ''}
              placeholder="Used to broadcast ETH transactions..."
              onChange={e =>
                handleFormDataChange({ infuraApiKey: e.target.value })
              }
              fullWidth
            />
          </div>

          <div className={clsx('flex flex--align-center')}>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              className={classes.button}
            >
              Save
            </Button>
            &nbsp; &nbsp;
            <Button
              variant="outlined"
              to={backTo}
              component={Link}
              className={classes.button}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Paper>
    </div>
  );
}

export default connect(
  ({ wallet }) => ({ wallet }),
  mapDispatchToProps
)(Component);

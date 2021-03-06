import React from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { Button } from '@material-ui/core';
import * as mapDispatchToProps from 'actions';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import download from 'utils/download';
import sl from 'utils/sl';

const useStyles = makeStyles(theme => ({
  container: {},
  row: {
    marginBottom: 20,
    width: '100%',
  },
  heading: {
    marginBottom: 30,
  },
}));

function Component({
  match: {
    params: { account },
  },
  updateWallet,
  history,
  rpc,
}) {
  const classes = useStyles();
  const [downloaded, setDownloaded] = React.useState(false);

  const onSubmit = async e => {
    e.preventDefault();

    if (!downloaded) {
      const keystore = JSON.stringify(await rpc('exportAccount', account));
      download('text/plain', keystore, 'keyfile');
      setDownloaded(true);
    } else {
      sl('success', 'You can now import your keyfile', 'Success', () =>
        history.push('/import/keystore')
      );
    }
  };

  return !account ? (
    <Redirect to="/generate/keystore" />
  ) : (
    <div
      {...{ onSubmit }}
      className={clsx(
        classes.container,
        'flex flex--column flex--align-center'
      )}
    >
      <h1 className={classes.heading}>Save your Keystore File</h1>

      <div
        className={clsx(classes.row, 'flex flex--column flex--align-center')}
      >
        <p>Don't lose it! It can't be recovered if you lose it.</p>

        <p>
          Don't share it! Your funds will be stolen if you use this file on a
          malicious site.
        </p>

        <p>
          Make a Backup! Secure it like the millions of dollars it may one day
          be worth.
        </p>
      </div>

      <div className={clsx('flex flex--align-center')}>
        <Button
          variant="outlined"
          fullWidth
          to={'/generate/keystore'}
          component={Link}
        >
          Back
        </Button>
        &nbsp; &nbsp;
        <Button
          variant="contained"
          fullWidth
          color="secondary"
          onClick={onSubmit}
        >
          {downloaded ? 'Continue' : 'Download'}
        </Button>
      </div>
    </div>
  );
}

export default connect(() => ({}), mapDispatchToProps)(Component);

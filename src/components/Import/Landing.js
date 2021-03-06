import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as mapDispatchToProps from 'actions';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { Button } from '@material-ui/core';
import { SECONDARY_COLOR } from 'config';

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
  },
  heading: {
    marginBottom: 50,
    width: '100%',
    textAlign: 'center',
  },
  section: {
    marginLeft: 10,
    marginRight: 10,
  },
  button: {
    width: 200,
  },
  toGenerateLink: {
    marginTop: 50,
    '& > a': {
      color: SECONDARY_COLOR,
    },
  },
}));

function Component() {
  const classes = useStyles();

  return (
    <div
      className={clsx(
        classes.container,
        'flex flex flex--column flex--justify-center flex--align-center flex--grow'
      )}
    >
      <h1
        className={clsx(classes.heading, 'flex flex-justify-center flex--grow')}
      >
        How would you like to access your wallet?
      </h1>

      <div className="flex flex--justify-center">
        <div
          className={clsx(
            classes.section,
            'flex flex--column flex--align-center'
          )}
        >
          <Button
            variant="contained"
            fullWidth
            color="secondary"
            to={'/import/keystore'}
            component={Link}
            className={classes.button}
          >
            Keystore File
          </Button>
        </div>

        <div
          className={clsx(
            classes.section,
            'flex flex--column flex--align-center'
          )}
        >
          <Button
            variant="contained"
            fullWidth
            color="secondary"
            to={'/import/mnemonic'}
            component={Link}
            className={classes.button}
          >
            Mnemonic Phrase
          </Button>
        </div>
      </div>

      <div className={classes.toGenerateLink}>
        <Link to="/generate">Don’t have a wallet?</Link>
      </div>
    </div>
  );
}

export default connect(() => ({}), mapDispatchToProps)(Component);

import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Badge } from '@material-ui/core';
import * as mapDispatchToProps from 'actions';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { IS_DEV } from 'config';
import { sleep } from 'utils';
import sl from 'utils/sl';

const useStyles = makeStyles(theme => ({
  container: {},
  heading: {},
  grid: {
    marginBottom: 20,
    width: '100%',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
  },
  gridItem: {
    margin: 10,
    width: 200,
  },
  gridItemButton: {
    width: 200,
  },
  buttons: {
    width: '100%',
  },
  buttonError: {
    background: '#f48fb1 !important',
  },
  buttonHighlight: {
    background: '#90caf9 !important',
  },
}));

function Component({
  match: {
    params: { account },
  },
  updateWallet,
  history,
  shuffledMnemonic = [],
  mnemonic = [],
}) {
  const classes = useStyles();
  const [inputMnemonic, setInputMnemonic] = React.useState([]);
  const [wordState, setWordState] = React.useState({});
  const inputMnemonicIsValid = inputMnemonic.length === mnemonic.length;

  const hintWord = async({ state, index }) => {
    setWordState({ index, state });
    await sleep(300);
    setWordState({});
  };

  const onClickWord = async({ index, word }) => {
    if (index !== inputMnemonic.length) {
      return await hintWord({ index, state: 'buttonError' });
    }
    setInputMnemonic(inputMnemonic.concat(word));
  };

  const onRevealNextWord = async() => {
    await hintWord({
      index: inputMnemonic.length,
      state: 'buttonHighlight',
    });
  };

  const onFinish = () => {
    sl('success', 'You can now import your mnemonic phrase', 'Success', () =>
      history.push('/import/mnemonic')
    );
  };

  React.useEffect(() => {
    if (IS_DEV && !shuffledMnemonic.length) {
      const mnemonic = 'jelly practice crash endless sphere abuse eye angry flash oblige cycle brain'
        .split(' ')
        .map((word, index) => ({ word, index }));
      updateWallet({
        mnemonic,
        shuffledMnemonic: _.shuffle(mnemonic),
      });
    }
  }, [shuffledMnemonic.length, updateWallet]);

  return (
    <div
      className={clsx(
        classes.container,
        'flex flex--column flex--align-center'
      )}
    >
      <h1 className={classes.heading}>Confirm Mnemonic Phrase</h1>

      <p className="center-align">
        Click the words of your phrase in order.
        <br />
        If you've forgotten the next word, click the 'Reveal Next Word' button
        below.
      </p>

      <div className={'flex flex--justify-center'}>
        <div className={classes.grid}>
          {shuffledMnemonic.map(({ word, index }) => {
            const isValid = inputMnemonic[index];
            return (
              <div className={classes.gridItem} key={word}>
                <Badge
                  badgeContent={index + 1}
                  color="primary"
                  invisible={!isValid}
                >
                  <Button
                    variant={
                      wordState.index === index
                        ? 'contained'
                        : isValid
                        ? 'contained'
                        : 'outlined'
                    }
                    fullWidth
                    color="secondary"
                    className={clsx(
                      classes.gridItemButton,
                      wordState.index !== index
                        ? null
                        : classes[wordState.state]
                    )}
                    onClick={() => onClickWord({ word, index })}
                  >
                    {word}
                  </Button>
                </Badge>
              </div>
            );
          })}
        </div>
      </div>

      <div className={clsx(classes.buttons, 'flex flex--align-center')}>
        <Button
          variant="outlined"
          fullWidth
          to={'/generate/mnemonic'}
          component={Link}
        >
          Back
        </Button>
        &nbsp; &nbsp;
        <Button
          variant="outlined"
          fullWidth
          color="secondary"
          onClick={onRevealNextWord}
        >
          Reveal Next Word
        </Button>
        &nbsp; &nbsp;
        <Button
          variant="contained"
          fullWidth
          color="secondary"
          onClick={onFinish}
          disabled={!inputMnemonicIsValid}
        >
          Confirm
        </Button>
      </div>
    </div>
  );
}

export default connect(
  ({ wallet: { mnemonic, shuffledMnemonic } }) => ({
    mnemonic,
    shuffledMnemonic,
  }),
  mapDispatchToProps
)(Component);

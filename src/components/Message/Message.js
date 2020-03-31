import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';
import { Paper, Tabs, Tab } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Route, Switch } from 'react-router-dom';
import Sign from './Sign';
import Verify from './Verify';
import SignTransaction from './SignTransaction';
import BroadcastSignedTransaction from './BroadcastSignedTransaction';
import { history } from 'store';

const useStyles = makeStyles(theme => ({
  container: { width: 800, padding: 50 },
  tab: {
    minWidth: 'auto',
    padding: 7,
    fontSize: 13,
  },
  activeTabContent: {
    paddingTop: 20,
  },
}));

const ROUTES = [
  '/',
  '/verify',
  '/sign-transaction',
  '/broadcast-signed-transaction',
];
const ROUTE_COMPONENTS = [
  Sign,
  Verify,
  SignTransaction,
  BroadcastSignedTransaction,
];
const ROUTE_LABELS = [
  'Sign Message',
  'Verify Message',
  'Sign Transaction',
  'Broadcast Signed Transaction',
];

const Component = ({ path, match }) => {
  const classes = useStyles();
  let activeTab = ROUTES.indexOf(path);
  activeTab = -1 === activeTab ? 0 : activeTab;

  const handleActiveTabChange = (event, newValue) => {
    history.push(`/message${newValue ? ROUTES[newValue] : ''}`);
  };

  return (
    <div className={'flex flex--justify-center'}>
      <Paper className={classes.container}>
        <Tabs
          value={activeTab}
          indicatorColor="secondary"
          textColor="inherit"
          onChange={handleActiveTabChange}
          aria-label="tabs"
        >
          {ROUTE_LABELS.map(label => (
            <Tab className={classes.tab} key={label} {...{ label }} />
          ))}
        </Tabs>

        <div className={classes.activeTabContent}>
          <Switch>
            {ROUTES.map((path, i) => (
              <Route
                exact
                key={path}
                path={`/message${ROUTES[i]}`}
                component={ROUTE_COMPONENTS[i]}
              />
            ))}
          </Switch>
        </div>
      </Paper>
    </div>
  );
};

export default connect((_, { match }) => {
  return {
    path: window.location.pathname.replace('/message', ''),
  };
}, mapDispatchToProps)(Component);

import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';
import { Link } from 'react-router-dom';
import copyToClipboard from 'clipboard-copy';
import {
  IconButton,
  Tooltip,
  AppBar,
  Typography,
  Toolbar,
  Menu,
  MenuItem,
  Button,
  Divider,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import LightIcon from '@material-ui/icons/Brightness7';
import DarkIcon from '@material-ui/icons/Brightness2';
import CheckIcon from '@material-ui/icons/Check';
import AddIcon from '@material-ui/icons/Add';
import LogoutIcon from '@material-ui/icons/ExitToApp';
import SettingsIcon from '@material-ui/icons/Settings';
import CopyIcon from '@material-ui/icons/FileCopy';
import { isDarkSelector } from 'selectors/theme';
import { web3Selector } from 'selectors/wallet';
import {
  LOGIC_TYPES_MNEMONIC,
  CHAINS_MAP,
  NETWORKS_MAP,
  NETWORKS_LIST,
} from 'config';

function Component({
  toggleTheme,
  isDark,
  account,
  accounts,
  addAccount,
  chooseAccount,
  logout,
  isMnemonicType,
  network,
  web3,
  updateWallet,
}) {
  const [accountMenuAnchorEl, setAaccountMenuAnchorEl] = React.useState(null);
  const [networkMenuAnchorEl, setNerworkMenuAnchorEl] = React.useState(null);
  const [balance, setBalance] = React.useState('0');

  const { name: networkName, chain, tokenSymbol } = NETWORKS_MAP[network];
  const { name: chainName } = CHAINS_MAP[chain];

  //

  const handleOpenAccounts = event => {
    setAaccountMenuAnchorEl(event.currentTarget);
  };

  const handleCloseAccounts = () => {
    setAaccountMenuAnchorEl(null);
  };

  const handleAddAccount = async() => {
    await addAccount();
    handleCloseAccounts();
  };

  const handleChooseAccount = async account => {
    await chooseAccount(account);
    handleCloseAccounts();
  };

  //

  const handleOpenNetworks = event => {
    setNerworkMenuAnchorEl(event.currentTarget);
  };

  const handleCloseNetworks = () => {
    setNerworkMenuAnchorEl(null);
  };

  const handleChooseNetwork = async network => {
    updateWallet({ network });
    handleCloseNetworks();
  };

  //

  const handleLogout = () => {
    handleCloseAccounts();
    logout();
  };

  const copyAddress = () => {
    copyToClipboard(account);
  };

  const onMount = async() => {
    if (account) {
      console.log('chain(%s)', await web3.eth.getChainId());
      setBalance(await web3.eth.getBalance(account));
    }
  };

  React.useEffect(() => {
    onMount(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, web3]);

  return (
    <AppBar position="fixed" color="inherit">
      <Toolbar color="inherit">
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          to={'/'}
          component={Link}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          className={'flex flex--justify-center flex--grow'}
        >
          {/*Signatory Wallet Manager*/}
        </Typography>
        &nbsp;
        {!account ? null : (
          <React.Fragment>
            <Button
              aria-controls="chain-network"
              aria-haspopup="true"
              onClick={handleOpenNetworks}
            >
              Network: {chainName}({networkName})
            </Button>

            <Menu
              id="networks"
              anchorEl={networkMenuAnchorEl}
              keepMounted
              open={Boolean(networkMenuAnchorEl)}
              onClose={handleCloseNetworks}
            >
              <MenuItem>ETHEREUM CLASSIC</MenuItem>
              <Divider />
              {NETWORKS_LIST.filter(n => n.chain === 'etc').map(n => (
                <MenuItem onClick={() => handleChooseNetwork(n.id)} key={n.id}>
                  {n.name}
                </MenuItem>
              ))}

              <Divider />
              <MenuItem>ETHEREUM</MenuItem>
              <Divider />

              {NETWORKS_LIST.filter(n => n.chain === 'eth').map(n => (
                <MenuItem onClick={() => handleChooseNetwork(n.id)} key={n.id}>
                  {n.name}
                </MenuItem>
              ))}
            </Menu>

            <Button
              aria-controls="accounts"
              aria-haspopup="true"
              onClick={handleOpenAccounts}
            >
              Account: {account} Balance: {web3.utils.fromWei(balance, 'ether')}{' '}
              {tokenSymbol}
            </Button>

            <Tooltip title="Copy Address">
              <IconButton
                color="inherit"
                aria-label="Copy Address"
                onClick={copyAddress}
              >
                <CopyIcon />
              </IconButton>
            </Tooltip>

            <Menu
              id="accounts"
              anchorEl={accountMenuAnchorEl}
              keepMounted
              open={Boolean(accountMenuAnchorEl)}
              onClose={handleCloseAccounts}
            >
              {isMnemonicType ? null : <MenuItem>SELECT ACCOUNT</MenuItem>}
              {isMnemonicType ? null : <Divider />}
              {accounts.map(a => (
                <MenuItem onClick={() => handleChooseAccount(a)} key={a}>
                  {a}&nbsp;&nbsp;{a !== account ? null : <CheckIcon />}
                </MenuItem>
              ))}
              {isMnemonicType !== LOGIC_TYPES_MNEMONIC ? null : <Divider />}
              {isMnemonicType ? null : (
                <MenuItem onClick={handleAddAccount}>
                  <AddIcon />
                  &nbsp;&nbsp;Add Account
                </MenuItem>
              )}

              <Divider />
              {/*
                <MenuItem to={'/settings'} component={Link}>
                  <SettingsIcon />
                  &nbsp;&nbsp;Settings
                </MenuItem>
              */}
              <MenuItem onClick={handleLogout}>
                <LogoutIcon />
                &nbsp;&nbsp;Logout
              </MenuItem>
            </Menu>
          </React.Fragment>
        )}
        <Tooltip title="Settings">
          <IconButton
            color="inherit"
            aria-label="Settings"
            to={'/settings'}
            component={Link}
          >
            <SettingsIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Toggle light/dark theme">
          <IconButton
            onClick={toggleTheme}
            color="inherit"
            aria-label="Toggle light/dark theme"
          >
            {isDark ? <LightIcon /> : <DarkIcon />}
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}

const mapStateToProps = state => {
  const {
    wallet: { account, accounts, type: loginType, network },
  } = state;
  return {
    isDark: isDarkSelector(state),
    account,
    accounts,
    isMnemonicType: loginType !== LOGIC_TYPES_MNEMONIC,
    network,
    web3: web3Selector(state),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);

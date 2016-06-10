import React, { Component, PropTypes } from 'react'
import Provider from 'react-redux';

import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import {deepOrange500} from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

import FacebookWidget from './FacebookWidget';
import 'isomorphic-fetch'

const styles = {
  container: {
    textAlign: 'center',
    // paddingTop: 200,
  },
};

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepOrange500,
  },
});


function purgeUser () {
  var userURL = `${window.location.protocol}://${window.location.host}/api/users/${loggedInUser.user_uuid}?auth_token=${loggedInUser.auth_token}`
  console.log(userURL)
  fetch(userURL, {
      method: 'DELETE'
  }).then(response => { console.log("We did it", response); window.location.href = '/logout' })
}

function refreshUserFeed () {
  var userURL = `${window.location.protocol}://${window.location.host}/api/users/${loggedInUser.user_uuid}/refresh?auth_token=${loggedInUser.auth_token}`
  console.log(userURL)
  fetch(userURL, {
      method: 'POST'
  }).then(response => { console.log("We did it", response); })
}

class MainBody extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.handleTouchTap = this.handleTouchTap.bind(this);

    this.state = {
      open: false,
    };
  }

  handleRequestClose() {
    this.setState({
      open: false,
    });
  }

  handleTouchTap() {
    this.setState({
      open: true,
    });
  }

  render() {

    var mainMenu = 
      (
	  <IconMenu
	iconButtonElement={
            <IconButton><MoreVertIcon /></IconButton>
	}
	targetOrigin={{horizontal: 'right', vertical: 'top'}}
	anchorOrigin={{horizontal: 'right', vertical: 'top'}}
	  >
          <MenuItem primaryText="Check for new" onTouchTap={(e) => {console.log("We should Refresh"); refreshUserFeed()} }/>
          <MenuItem primaryText="Purge account" onTouchTap={(e) => {console.log("purging"); purgeUser()} }/>
          <MenuItem primaryText="logout" onTouchTap={(e) => {window.location.href = '/logout'} }/>
	  </IconMenu>
      );

    if (!loggedInUser || !loggedInUser.user_uuid) {
      mainMenu = <div/>
    }
    return (
	<div>
	<MuiThemeProvider muiTheme={muiTheme} >
        <div style={styles.container}>
	<AppBar
      title="Image Categorizer"
      iconElementRight={mainMenu}
        ></AppBar>
      
        <FacebookWidget/>
        </div>
	</MuiThemeProvider>
	</div>
    );
  }
}


export default MainBody;

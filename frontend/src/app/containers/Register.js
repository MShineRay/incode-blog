/**
 * In this file, we create a React component
 * which incorporates components providedby material-ui.
 */

import React, { Component, PropTypes } from 'react'
import { Provider, connect } from 'react-redux';

import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';

import {deepOrange500} from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import FacebookWidget from './FacebookWidget';
import { updateUser, postUser } from '../actions'

// import RegisterForm from './RegisterForm.js';

function loadData(props) {
  const { storeUser } = props
  // never mind
}


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

class Register extends React.Component {
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

  componentWillMount () {
    loadData(this.props)
  }

  
  doSubmit(props) {
    console.log("REFS: ", this.refs)
    console.log("FORM: ", this._form);
    const { postUser, storeUser } = props
    return (e => {
      console.log("E", e, "MY PROPS ", this.props)
      console.log("REFS: ", this.refs)
      console.log("FORM: ", this._form);
      this._form.submit()
      postUser(this.props.storeUser)
    }
	   )
  }
  
  render() {
    console.log("REGISTER WITH:", this.props.storeUser);

    const { storeUser } = this.props
    const { user } = storeUser

    console.log("REGISTER NOW USING user:", user)
    const formFields = 
	  (
	      <form method="post" action="/userUpdate" id="registrationForm" ref={(c) => this._form = c}
	      >
	      <TextField id="display_name"
	    name="display_name"
	    floatingLabelText="Name"
	    floatingLabelFixed={true}
	    hintText="John Doe"
	    onChange={ e => {user.display_name = e.target.value ; this.props.updateUser(user) }}
	    value={user.display_name || ''}
	      /><br />

	    
	      <TextField id="username" name="username"
	    floatingLabelText="username"
	    floatingLabelFixed={true}
	    hintText="username"
	    onChange={ e => {user.username = e.target.value ; this.props.updateUser(user) }}
	    value={user.username || '' }
	      /><br />
	      
	      <TextField
	    id="email" name="email"
	    floatingLabelText="email"
	    floatingLabelFixed={true}
	    onChange={ e => {user.email= e.target.value ; this.props.updateUser(user)  }}
	    hintText="you@sample.com"
	    value={user.email || '' }
	      /><br />
	      
	      <TextField
	    id="icloud_credentials" name="icloud_credentials"
	    floatingLabelText="iCloud Login"
	    floatingLabelFixed={true}
	    onChange={ e => {user.icloud_credentials = e.target.value;  this.props.updateUser(user)  }}
	    value={user.icloud_credentials || '' }
	    hintText=""
	      /><br />
	      <input type="hidden" name="facebook_id" value={user.facebook_id} />
	      <input type="hidden" name="wants_status_email" value="no" />
	      </form>
	  )
    
    const standardActions = (
	<div>
	<FlatButton
      label="Cancel"
      secondary={true}
      onTouchTap={this.handleRequestClose}
	/>
	<FlatButton
      label="Ok"
      secondary={true}
      onTouchTap={this.doSubmit(this.props)}
	/>
	</div>
    );

    return (
	<div>
	<MuiThemeProvider muiTheme={muiTheme} >
        <div style={styles.container}>
        <Dialog
      open={this.state.open}
      title="Register"
      children={formFields}
      actions={standardActions}
      onRequestClose={this.handleRequestClose}
	></Dialog>
        <RaisedButton
      label="Register"
      primary={true}
      onTouchTap={this.handleTouchTap}
        />
	
      </div>
	</MuiThemeProvider>
	</div>
    );
  }
}

Register.propTypes = {
  storeUser: PropTypes.object.isRequired

}

function mapStateToProps(state, ownProps) {

  return {
    storeUser: state.storeUser
  }
}

export default connect(mapStateToProps, {
  updateUser,
  postUser
})(Register)

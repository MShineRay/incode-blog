import React, { PropTypes } from 'react';

import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Register from './Register'
import Images from './Images'
import FacetsBar from './FacetsBar'
import TagsBar from './TagsBar'

import { connect } from 'react-redux'
import { loadLoginUser, updateUser, loadPhotos, loadCounts, deleteQueryTerm, addQueryTerm } from '../actions'
import User from '../components/User'


function loadData(props) {

  const { user } = props
  console.log('user from props is: ', user)
  
  // FIXME; we don't want to run this if there's nothing new
  if ((loggedInUser['user_uuid']) && !(loggedInUser['user_uuid'] === user['user_uuid'])) {
    props.updateUser(loggedInUser)
  }
  // if someone has added or removed a query term, run a new search & reset the flag
  if (props.queryChanged) {
    props.loadPhotos(props.query,loggedInUser['auth_token'] )
  }
}

class FacebookWidget extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  componentWillMount() {
    loadData(this.props)
  }
  
  componentWillReceiveProps(nextProps) {
    loadData(nextProps)
  }


  componentDidMount(){
    
    // componentDidMount is called by react when the component 
    // has been rendered on the page. We can set the interval here:
    
    this.timer = setInterval(this.tick.bind(this), 15000);
  }
  
  componentWillUnmount(){
    
    // This method is called immediately before the component is removed
    // from the page and destroyed. We can clear the interval here:
    
    clearInterval(this.timer);
  }
  
  tick(){
    
    // This function is called every 50 ms. It updates the 
    // elapsed counter. Calling setState causes the component to be re-rendered
    
    console.log("TICK", this)
    this.props.loadCounts(loggedInUser['auth_token'] )
    console.log("TOCK")
  }
  
  
  render() {
    // const { user } = this.props
    const user = loggedInUser;
    
    // props.updateUser(loggedInUser)
    console.log("loggedInUser:", loggedInUser);
    
    window.fbAsyncInit = function() {
      FB.init({
	appId      : '588463747978133',
	xfbml      : true,
	version    : 'v2.6'
      });
    };

    // embed facebook login code
    (function(d, s, id){
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
    
    if (!user || !('facebook_id' in user)) {
      return (
	  <div style={{margin: '40px'}}>
	  <RaisedButton
	label="Login with Facebook"
	primary={true}
	onTouchTap={ e => {window.location.href='/auth/facebook'}}
          />
	  </div>
)	

//	  <a href="/auth/facebook">Login, Facebook</a>
//      )
    // } else if (!user.username ){
    //   return (
    // 	  <Register />
    //   )
    } else {
      return (
	  <div>
	  <TagsBar query={this.props['query']} deleteQueryTerm={this.props.deleteQueryTerm} addQueryTerm={this.props.addQueryTerm}/>
	  <div style={{width:'200px',
		       float: 'left',
		       textAlign: 'left'
		      }}>
	  <FacetsBar/>
	  </div>
	  <Images style={{float: 'right'}}/>

	  </div>
      )
    }
  }
}



FacebookWidget.propTypes = {
  user: PropTypes.object,
  query: PropTypes.object,
  queryChanged: PropTypes.bool,
  loadLoginUser: PropTypes.func.isRequired,
  loadPhotos: PropTypes.func.isRequired,
  loadCounts: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
}

function mapStateToProps(state, ownProps) {
  // pulls "user" from state.entities and "query" & queryChanged from state.photos
  const {
    storeUser: { user },
    photos: { query, queryChanged }
  } = state

  return {
    user,
    query,
    queryChanged
  }
}

export default connect(mapStateToProps, {
  loadLoginUser,
  deleteQueryTerm,
  addQueryTerm,
  updateUser,
  loadPhotos,
  loadCounts,
})(FacebookWidget)

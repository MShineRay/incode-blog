import React, { PropTypes } from 'react';

import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Register from './Register'
import Images from './Images'
import FacetsBar from './FacetsBar'
import TagsBar from './TagsBar'

import { connect } from 'react-redux'
import { loadLoginUser, updateUser, loadPhotos, loadCounts, deleteQueryTerm, addQueryTerm, refreshQuery } from '../actions'

function loadData(props) {

  const { user } = props

  if ((loggedInUser['user_uuid']) && !(loggedInUser['user_uuid'] === user['user_uuid'])) {
    props.updateUser(loggedInUser)
  }
  // if someone has added or removed a query term, run a new search & reset the flag
  if (props.queryChanged) {
    props.loadPhotos(props.query,loggedInUser['auth_token'], 0)
  }
}

const CountsTicker = ( { counts, refresh } ) =>  {
  if (counts) {
    if (counts.classified < counts.total ) {
   //   setTimeout(refresh(), 1000)
      return (
	  <div>
	  <span>{counts.total - counts.classified} remaining to be classified </span>
	  <FlatButton
	label="Refresh"
	secondary={true}
	onTouchTap={ (e) => refresh() }
	/>

	  </div>
      );
    } else {
      return (
	  <div>{counts.total} total items</div>
      );
    }
  } else {
    return(
	<div></div>
    )
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

    this.timer = setInterval(this.tick.bind(this), 5000);

  }
  
  componentWillUnmount(){
    
    // This method is called immediately before the component is removed
    // from the page and destroyed. We can clear the interval here:

    clearInterval(this.timer);
  }

  
  tick(){
        
    if (!loggedInUser || 'nobody' === loggedInUser || !('facebook_id' in loggedInUser)) {
      return
    } else {
      //      if (this.props.counts && this.props.counts.classified < this.props.counts.total ) { this.props.refreshQuery() }
      this.props.loadCounts(loggedInUser['auth_token'] )
    }
  }
  
  
  render() {
    // const { user } = this.props
    const user = loggedInUser;
    
    window.fbAsyncInit = function() {
      FB.init({
	appId      : '588463747978133',
	xfbml      : true,
	version    : 'v2.6'
      });
    };

    // inject facebook login code directly in the DOM
    (function(d, s, id){
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
    
    if (!user || 'nobody' === user || !('facebook_id' in user)) {
      return (
	  <div style={{margin: '40px'}}>
	  <RaisedButton
	label="Login with Facebook"
	primary={true}
	onTouchTap={ e => {window.location.href='/auth/facebook'}}
          />
	  </div>
      )	

    } else {
      // { if (this.props.counts.classified < this.props.counts.total ) { this.props.refreshQuery() } }

      return (
	  <div>
	  <TagsBar query={this.props['query']} deleteQueryTerm={this.props.deleteQueryTerm} addQueryTerm={this.props.addQueryTerm}/>
	  <div style={{width:'350px',
		      float: 'left',
		       textAlign: 'left'
		      }}>
	  <CountsTicker counts={this.props.counts} refresh={() => { this.props.refreshQuery(this.props.query) } }  />
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
  // pulls "user" from state.storeUser and query, queryChanged & counts from state.photos

  const {
    storeUser: { user },
    photos: { query, queryChanged, counts }
  } = state

  return {
    user,
    query,
    queryChanged,
    counts
  }
}

export default connect(mapStateToProps, {
  loadLoginUser,
  deleteQueryTerm,
  addQueryTerm,
  updateUser,
  loadPhotos,
  refreshQuery,
  loadCounts,
})(FacebookWidget)

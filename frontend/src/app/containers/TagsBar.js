import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { loadPhotos } from '../actions'
//import { List } from  '../components/List'
import {List, ListItem} from 'material-ui/List';

import RaisedButton from 'material-ui/RaisedButton';

import NavigationClose from 'material-ui/svg-icons/navigation/close';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import ContentInbox from 'material-ui/svg-icons/content/inbox';
import ContentDrafts from 'material-ui/svg-icons/content/drafts';
import ContentSend from 'material-ui/svg-icons/content/send';
import TextField from 'material-ui/TextField';
import Subheader from 'material-ui/Subheader';

const Tag = ( { termType, termVal, handler } ) => {
    const label = termType + ":" + termVal

    return(
	<RaisedButton
	label={label}
	icon={<NavigationClose />}
      style={ { margin: '5px' }}
      labelStyle={ { textTransform: 'none' }}
	onClick={ (e) => { console.log("THIS BUTTON WAS CLICKED", e); console.log("my label is", label); handler(label) } }
	/>
    )
}

class TagsBar extends Component {
  

    constructor(props) {
      console.log("TTTTTTTagsbar constructor with props", props)
      super(props);
      
      this.state = {
	searchText: "",
      };

    }
    render() {
	console.log("TTTTT  rendering in TagsBar: with props ", this.props)
      const { query } = this.props

	
	var items = []

	for (var key in query) {
	    console.log("TagsBar found key in props query:", key)
	    console.log("Tagsbar it's value is:", query[key])
	    if (typeof query.key === 'string') {
		items.push([key, query[key]])
	    } else {
		items = items.concat(query[key].map( (val) => { return [key, val] } ))
	    }
	}

      console.log("TagsBar display items is", items)
      const textSearch = (
	  <div>
	  <TextField
	hintText="search"
	onKeyDown={ e => { if (e.keyCode == 13) {console.log("ENTER"); this.props.addQueryTerm( { _text_: "*" + this.state.searchText + "*" } )  }  } }
	onChange={ e => { console.log("Have query:", e.target.value); this.setState( { searchText: e.target.value });  /* storeUser.display_name = e.target.value ; this.props.updateUser(storeUser) */ }}
	  />
	  </div>
      );
      
	if (query) {

	  return (
	      <div>
	      { textSearch }
		<div>
		    { items.map( (item) => { return (
			    <Tag
			termType={item[0]}
			termVal={item[1]}
			handler={this.props.deleteQueryTerm}
			/>
		    )} ) } 
	    </div>
	      </div>
	    );
	} else {
	    return (
		    <div>
		{ textSearch }
		    </div>
	    );
	}
    }
}

TagsBar.propTypes = {
    loadPhotos: PropTypes.func.isRequired,
    removeQueryTerm: PropTypes.func.isRequired,
    query: PropTypes.object.isRequired
}

// react-redux calls this when there's been some change of state we may be interested in
function mapStateToProps(state, ownProps) {
    // here's where we 
    console.log("TTTTTagsBar updating TagsBar container props")
    console.log("TTTT ownProps", ownProps)
    const { query } = state.photos
    var nextProps = Object.assign({}, ownProps, { query: query } )
    console.log("TTTT nextProps", nextProps)
    return nextProps
}

function mapDispatchToProps() {

}

export default TagsBar


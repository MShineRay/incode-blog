import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import {List, ListItem} from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import TextField from 'material-ui/TextField';

const Tag = ( { termType, termVal, handler } ) => {
  const label = termVal // termType + ":" + termVal

  return(
      <RaisedButton
    label={label}
    icon={<NavigationClose />}
    style={ { margin: '5px' }}
    labelStyle={ { textTransform: 'none' }}
    onClick={ (e) => { console.log("THIS BUTTON WAS CLICKED", e); console.log("my label is", label); handler(`${termType}:${label}`) } }
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
  deleteQueryTerm: PropTypes.func.isRequired,
  query: PropTypes.object.isRequired
}

// // react-redux calls this when there's been some change of state we may be interested in
// function mapStateToProps(state, ownProps) {
//     // here's where we 
//     console.log("TTTTTagsBar updating TagsBar container props")
//     console.log("TTTT ownProps", ownProps)
//     const { query } = state.photos
//     var nextProps = Object.assign({}, ownProps, { query: query } )
//     console.log("TTTT nextProps", nextProps)
//     return nextProps
// }

function mapDispatchToProps() {

}

export default TagsBar


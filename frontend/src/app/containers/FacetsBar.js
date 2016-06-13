import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { addQueryTerm } from '../actions'
import {List, ListItem} from 'material-ui/List';

// construct a function that
// handles a selection event of a particular facet member
// sends the new query term for the facet value to the action dispatcher
// by means of the given loader

const taxonHandler = function( facetName, facetVal, loader ) {
  return ( (e) => {   var qterm = {}
		      qterm[facetName] = facetVal.name;
		      loader( qterm ) } )
}


function facetListItem(facet, facetVal, loader) {

  const kids = facetVal.children ? facetVal.children.map( (val) => facetListItem(facet, val, loader) ) : []
  // console.log("ListItem:", facet, facetVal)
  return (<ListItem
	  nestedItems={ kids  }
	  key={facetVal.name}
	  onTouchTap={ taxonHandler(facet, facetVal, loader) }
	  primaryText={ facetVal.name.split('/').pop() + " (" + facetVal.count + ")" }
	  />);
}

// displays current counts
const countsTicker = function(counts) {
  if (counts && counts.classified < counts.total ) {
    return (
	<div>
	<span>{counts.total - counts.classified} remaining to be classified</span>
	</div>
    );
  } else {
    return (
	<div/>
    );
  }
}


class FacetsBar extends Component {
  render() {
    console.log("FFF rendering with", this.props)
    const { facetFields, counts } = this.props
    
    if (facetFields) {
      var topics = []

      for (var i = 0; i < facetFields.topic.length; i+= 2) {
	if (facetFields.topic[i + 1] > 0) {
	  topics.push({ "name": facetFields.topic[i],  "count": facetFields.topic[i + 1] })
	}
      }

      var taxons = []

      for (var i = 0; i < facetFields.taxon.length; i+= 2) {
	if (facetFields.taxon[i + 1] > 0) {
	  taxons.push({ "name": facetFields.taxon[i],  "count": facetFields.taxon[i + 1], children: [] })
	}
      }

      taxons = taxons.sort( (a, b) => { if (a.name < b.name) { return -1 } else { return 1 } } )

      var taxonTree = []

      if ( taxons.length > 0) {
	//      var prevItem = [ { children: [], name: "" }, taxons[0] ]
	var prevItem = [ { children: [], name: "" }, taxons[0] ]    
	for (var i = 1; i < taxons.length; i++) {
	  var currentItem = taxons[i];
	  currentItem['children'] = [];
	  if (currentItem.name.startsWith(prevItem[prevItem.length - 1].name.concat('/'))) {
	    prevItem[prevItem.length - 1].children.push(currentItem);
	    prevItem.push(currentItem);
	  } else {
	    while (prevItem.length > 1 && !(currentItem.name.startsWith(prevItem[prevItem.length - 1].name.concat('/')))) {
	      prevItem.pop()
	    }
	    prevItem[prevItem.length - 1].children.push(currentItem);
	    prevItem.push(currentItem);
	  }
	}

	taxonTree = prevItem[0].children
      }
      
      var persons = []

      for (var i = 0; i < facetFields.person.length; i+= 2) {
	if (facetFields.person[i + 1] > 0) {
	  persons.push({ "name": facetFields.person[i],  "count": facetFields.person[i + 1] })
	}
      }
      
      var faces = []
      for (var i = 0; i < facetFields.face.length; i+= 2) {
	if (facetFields.face[i + 1] > 0) {
	  faces.push({ "name": facetFields.face[i],  "count": facetFields.face[i + 1] })
	}
      }
      


      return (
	  <div>
	  {countsTicker(counts)}
	  <List>
	  <ListItem primaryText="Topics"
	key={1}
	nestedItems={ topics.map( (val) =>  facetListItem("topic", val, this.props.addQueryTerm)  ) }
	  />
	  <ListItem primaryText="Taxonomy"
	key={2}
	nestedItems={ taxonTree.map( (val) => facetListItem("taxon", val, this.props.addQueryTerm) )}
	  />
	  <ListItem primaryText="People"
	key={3}
	nestedItems={ persons.map( (val) => facetListItem("person", val, this.props.addQueryTerm) )}
	  />
	  <ListItem primaryText="Faces"
	key={4}
	nestedItems={ faces.map( (val) => facetListItem("face", val, this.props.addQueryTerm) )}
	  />
	  </List>
	  </div>
      );
    } else {
      return (
	  <div />
      );
    }
  }
}

FacetsBar.propTypes = {
  addQueryTerm: PropTypes.func.isRequired
}

// react-redux calls this when there's been some change of state we may be interested in
function mapStateToProps(state, ownProps) {
  console.log("FFFF mapStateToProps")
  const { facetFields } = state.photos.solr || {} 
  const nextProps = Object.assign({}, ownProps, { facetFields })
  console.log("FFF nextProps:", nextProps)
  return nextProps
}

export default connect(mapStateToProps, {
  addQueryTerm
})(FacetsBar)

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { addQueryTerm } from '../actions'
import {List, ListItem} from 'material-ui/List';

const  topicTapHandler = function(index, props) {
  const { facet, facetVal, loader } = props;
  var qterm = {}
  qterm[facet] = facetVal.name;
  loader( qterm )
}


const taxonHandler = function( facetName, facetVal, loader ) {
  return ( (e) => {   var qterm = {}
		      qterm[facetName] = facetVal.name;
		      loader( qterm ) } )
}

function facetListItem(facet, facetVal, loader) {

  const kids = facetVal.children ? facetVal.children.map( (val) => facetListItem(facet, val, loader) ) : []

  return (<ListItem
	  nestedItems={ kids  }
	  key={facetVal.name}
	  onTouchTap={ taxonHandler(facet, facetVal, loader) }
	  primaryText={ facetVal.name.split('/').pop() + " (" + facetVal.count + ")" }
	  />);
}

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
    const { store, history, solr, counts } = this.props
    
    if (solr) {
      var topics = []

      for (var i = 0; i < solr.facetFields.topic.length; i+= 2) {
	if (solr.facetFields.topic[i + 1] > 0) {
	  topics.push({ "name": solr.facetFields.topic[i],  "count": solr.facetFields.topic[i + 1] })
	}
      }

      var taxons = []

      for (var i = 0; i < solr.facetFields.taxon.length; i+= 2) {
	if (solr.facetFields.taxon[i + 1] > 0) {
	  taxons.push({ "name": solr.facetFields.taxon[i],  "count": solr.facetFields.taxon[i + 1], children: [] })
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

      for (var i = 0; i < solr.facetFields.person.length; i+= 2) {
	if (solr.facetFields.person[i + 1] > 0) {
	  persons.push({ "name": solr.facetFields.person[i],  "count": solr.facetFields.person[i + 1] })
	}
      }
      
      var faces = []


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
  return Object.assign({}, ownProps, state.photos)
}

export default connect(mapStateToProps, {
  addQueryTerm
})(FacetsBar)

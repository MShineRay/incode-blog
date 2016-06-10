import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { loadPhotos, addQueryTerm } from '../actions'
import {List, ListItem} from 'material-ui/List';

const  topicTapHandler = function(index, props) {
  const { facet, facetVal, loader } = props;
  var qterm = {}
  qterm[facet] = facetVal.name;
  loader( qterm )
}

class TopicListItem extends Component {
  
  render() {
    const { facet, facetVal, loader} = this.props

    return (
	<ListItem
      style={{ fontSize: '12px' }}

      key={facetVal.name}
      onTouchTap={ topicTapHandler.bind(this, 1, this.props) }
      primaryText={ facetVal.name + " (" + facetVal.count + ")" }
	/>
    )
  }
}

class TaxonListItem extends Component {
  
  render() {
    const { facet, facetVal, loader} = this.props

    return (
	<ListItem
      style={{ fontSize: '12px' }}
      nestedItems={facetVal.children.map( (val) => <TaxonListItem facetVal={val} facet="taxon" loader={loader} /> ) }
      key={facetVal.name}
      onTouchTap={ topicTapHandler.bind(this, 1, this.props) }
      primaryText={ facetVal.name.split('/').pop() + " (" + facetVal.count + ")" }
	/>
    )
  }
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
    
    var topics = []
    if (solr) {
      for (var i = 0; i < solr.facetFields.topic.length; i+= 2) {
	if (solr.facetFields.topic[i + 1] > 0) {
	  topics.push({ "name": solr.facetFields.topic[i],  "count": solr.facetFields.topic[i + 1] })
	}
      }
    }
    var taxons = []
    if (solr) {
      for (var i = 0; i < solr.facetFields.taxon.length; i+= 2) {
	if (solr.facetFields.taxon[i + 1] > 0) {
	  taxons.push({ "name": solr.facetFields.taxon[i],  "count": solr.facetFields.taxon[i + 1], children: [] })
	}
      }
    }
    taxons = taxons.sort( (a, b) => { if (a.name < b.name) { return -1 } else { return 1 } } )

    var taxonTree = []

    if ( true && taxons.length > 0) {

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
    if (solr) {
      for (var i = 0; i < solr.facetFields.person.length; i+= 2) {
	if (solr.facetFields.person[i + 1] > 0) {
	  persons.push({ "name": solr.facetFields.person[i],  "count": solr.facetFields.person[i + 1] })
	}
      }
    }
    
    
    if (solr) {
      return (
	  <div>
	  {countsTicker(counts)}
	  <List>
	  <ListItem primaryText="Topics"
	nestedItems={ topics.map( (val) => <TopicListItem facetVal={val} facet="topic" loader={this.props.addQueryTerm} />) }
	  />
	  <ListItem primaryText="Taxonomy" 
	nestedItems={ taxonTree.map( (val) => <TaxonListItem facetVal={val} facet="taxon" loader={this.props.addQueryTerm} />) }
	  />
	  <ListItem primaryText="People" 
	nestedItems={ persons.map( (val) => <TopicListItem facetVal={val} facet="person" loader={this.props.addQueryTerm} />) }
	  />

	</List>
	  
	</div>
      );
    } else {
      return (
	  <div>
	  
	  </div>
      );
    }
  }
}

FacetsBar.propTypes = {
  loadPhotos: PropTypes.func.isRequired,
  addQueryTerm: PropTypes.func.isRequired // ,
  // photos: PropTypes.object.isRequired
}

// react-redux calls this when there's been some change of state we may be interested in
function mapStateToProps(state, ownProps) {
  return Object.assign({}, ownProps, state.photos)
}

export default connect(mapStateToProps, {
  loadPhotos,
  addQueryTerm
})(FacetsBar)

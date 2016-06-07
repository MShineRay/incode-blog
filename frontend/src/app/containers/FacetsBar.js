import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { loadPhotos, addQueryTerm } from '../actions'
//import { List } from  '../components/List'
import {List, ListItem} from 'material-ui/List';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import ContentInbox from 'material-ui/svg-icons/content/inbox';
import ContentDrafts from 'material-ui/svg-icons/content/drafts';
import ContentSend from 'material-ui/svg-icons/content/send';
import Subheader from 'material-ui/Subheader';


const  topicTapHandler = function(index, props) {
  
  const { facet, facetVal, loader } = props;
  console.log("I'm the TopicList HANDLER!! for ... ", facetVal.name);
  console.log("HANDLER!! props are ", props);
  var qterm = {}
  qterm[facet] = facetVal.name;
  loader( qterm )
}

class TopicListItem extends Component {
  
  render() {
    const { facet, facetVal, loader} = this.props
    console.log
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

  componentDidMount() {
    console.log("FacetsBar component did mount, context is:", this.context);
    console.log("FacetsBar.props is : ", this.props)
    //const { store } = this.context;
    //this.unsubscribe = store.subscribe(() => this.forceUpdate());
    // console.log("FacetsBar component did mount and we subscribed");	
  }

  componentWillReceiveProps(nextProps) {
    console.log("FacetsBar: willReceiveProps: ", nextProps);
  }

  handleLoadMoreClick() {
    //	this.props.loadStargazers(this.props.fullName, true)
  }


  
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
	  taxons.push({ "name": solr.facetFields.taxon[i],  "count": solr.facetFields.taxon[i + 1] })
	}
      }
    }
    taxons = taxons.sort( (a, b) => { if (a.name < b.name) { return -1 } else { return 1 } } )
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
	nestedItems={ taxons.map( (val) => <TopicListItem facetVal={val} facet="taxon" loader={this.props.addQueryTerm} />) }
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
	  <p>no matches</p>
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
  //not sure  what to do, here
  console.log("updating images container props")
  return Object.assign({}, ownProps, state.photos)
}

function mapDispatchToProps() {

}

export default connect(mapStateToProps, {
  loadPhotos,
  addQueryTerm
})(FacetsBar)

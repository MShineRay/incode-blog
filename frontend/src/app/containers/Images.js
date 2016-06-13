import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { loadLoginUser, updateUser, loadPhotos, loadImageDetails } from '../actions'
// import { List } from  '../components/List'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
// import {GridList, GridTile} from 'material-ui/GridList';
import {List, ListItem} from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import ImageItem from './ImageItem'
import FlatButton from 'material-ui/FlatButton';
import InfiniteScroll from './InfiniteScroll';
// var InfiniteScroll = require('react-infinite-scroll')(React);


function loadData(props) {
  props.loadPhotos({}, loggedInUser['auth_token'], 0)
}


const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    width: 700,
    /* height: 1450, */
    overflowY: 'auto',
    marginBottom: 24,
  },
};


function foo() {

  function render() {
    console.log('render');
    var InfiniteScroll = React.addons.InfiniteScroll;
    return (
      <div className="scroll-holder">
    
    <InfiniteScroll
      pageStart={0}
      loadMore={this.loadMore}
      hasMore={this.state.hasMore}
      loader={ <div className="loader">{" - "}</div> }
	/>

      </div>
    )
  }
}

function createDiv(haveMore) {
  if (haveMore) {
    return (
	<div>{ " more ..." }</div>
    )
  } else {
    return (
      <div/>
    )
  }
}

  
class Images extends Component {

  constructor() {
    super()
    this.state =  {
      hasMore: true,
      items: [createDiv(0)]
    };
  }
  getSomeImages(page) {
    var list = []
    
    for (var i = page * 5; i < (page * 5) + 3; i++) {
      var photo = ((this.props.solr || {}).docs || [])[i]
      if (photo) {
	list.push(this.renderImage(photo))
      }
    }
    return list
  }
  
  loadMore(page) {
    console.log('III load more with props', this.props)
    const { query, docs, numFound, loadPhotos } = this.props
    
    if (numFound > docs.length) {
      loadPhotos(query, loggedInUser['auth_token'], docs.length)
      // setTimeout(function() {
	
      // 	var newState = {
      //     items: this.state.items.concat([createDiv(page), ... this.getSomeImages(page)]),
      //     hasMore: (this.props.docs.length < this.props.numFound)
      // 	}


      // 	// get some more
      // 	console.log("mutating state for page:", page, " to ", newState)
      // 	this.setState(newState);
      // }.bind(this), 1000);
    }
  }
  

  handleLoadMoreClick() {
  }

  componentWillMount() {
    loadData(this.props)
  }

  componentDidMount() {
    console.log("RRR DidMount")
  }

  componentWillUnmount() {
    // this.unsubscribe();
  }

  componentWillReceiveProps(nextProps) {
    console.log("RRR Image: willReceiveProps: ", nextProps);
  }

  renderImage(photo) {
    return (
	<ImageItem photo={photo} />
    );
  }
  render() {
    console.log("RRRRRR  rendering in Images: with props ", this.props)
    const { solr } = this.props
    const { docs } = this.props
    
    if (solr) {
      return (
	  <div>
	  <List
	padding={1}
	style={styles.gridList}
	  >
	  {docs.map(this.renderImage)}
	</List>
	  	  <InfiniteScroll
	pageStart={0}
	loadMore={this.loadMore.bind(this)}
	hasMore={this.props.docs.length < this.props.numFound}
	children={createDiv(this.props.docs.length < this.props.numFound)}
	loader={ <div className="loader">{" - "}</div> }
	  />
	  
	
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

Images.propTypes = {
  loadPhotos: PropTypes.func.isRequired,
  loadImageDetails: PropTypes.func.isRequired,
}

// react-redux calls this when there's been some change of state we may be interested in
function mapStateToProps(state, ownProps) {
  console.log("RRRRR MapStateToProps props is", ownProps);
  
  return Object.assign({}, ownProps, { solr: state.photos.solr,
				       start: state.photos.start,
				       numFound: state.photos.numFound,
				       query: state.photos.query,
				       docs: state.photos.docs} )
}

export default connect(mapStateToProps, {
  loadPhotos,
  loadImageDetails
})(Images)

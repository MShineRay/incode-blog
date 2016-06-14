import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { loadLoginUser, updateUser, loadPhotos, loadImageDetails, loadSimilarImages } from '../actions'
// import { List } from  '../components/List'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'
// import {GridList, GridTile} from 'material-ui/GridList'
import {List, ListItem} from 'material-ui/List'
import IconButton from 'material-ui/IconButton'
import StarBorder from 'material-ui/svg-icons/toggle/star-border'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import JSONTree from 'react-json-tree'

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
}


class ImageItem extends Component {

  constructor(props) {
    super(props)
    this.handleLoadDetailsClick = this.handleLoadDetailsClick.bind(this)
    this.handleRequestClose = this.handleRequestClose.bind(this);
    
    this.state = {
      open: false,
    };

  }

  handleLoadDetailsClick() {
    console.log("HANDLING LoadDetailsClick", this.props)
    this.props.loadImageDetails(this.props.photo.id, loggedInUser['auth_token'])
    this.props.loadSimilarImages(this.props.photo.id, loggedInUser['auth_token'])
    this.setState({
      open: true,
    });
  }

  handleRequestClose() {
    this.setState({
      open: false,
    });
  }

  render () {
    console.log("ImageItem:: render with props", this.props)
    
    const { photo } = this.props

    const formattedDetails = (
	<div style={{height: '800px', overflow: "scroll" }}>
	<JSONTree data={this.props.imageDetails} />
	<h3> Similar </h3>
	<JSONTree data={this.props.imageSimilars} />
	</div>
    );
    
    const wasformattedDetails = (
	<div style={{height: '800px', overflow: "scroll" }}>
	<pre>
	{ JSON.stringify(this.props.imageDetails, null, 4) }
      </pre>
	</div>
    );
    
    const detailsDiv = (

	<div style={styles.container}>
	<Dialog
      open={this.state.open}
      title="Details"
      children={formattedDetails}
      onRequestClose={this.handleRequestClose}
	></Dialog>
        </div>


    );
    
    return (
	<ListItem
      key={photo.id}
      actionIcon={<IconButton><StarBorder color="white" /></IconButton>}
      actionPosition="left"
      titlePosition="top"
      titleBackground="linear-gradient(to bottom, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)"
	>
	<Card>
	<CardHeader />
	<CardMedia
      overlay={<CardTitle title={photo.imageName[0]} />}
	>
	<img src={photo.thumbnail} />
	</CardMedia>
	<CardActions style={{textAlign: 'right'}}>
	<FlatButton label="See Details" onTouchTap={this.handleLoadDetailsClick}/>
	</CardActions>
	<CardText children={detailsDiv} />
	</Card>
	</ListItem>
    );
  }
}

ImageItem.propTypes = {
  loadImageDetails: PropTypes.func.isRequired,
  photo: PropTypes.object,
  photoDetails: PropTypes.object
}

// react-redux calls this when there's been some change of state we may be interested in
function mapStateToProps(state, ownProps) {

  if (ownProps.imageDetails) {
    //	console.log("have details already")
    return ownProps
  } else {
    if (state.entities['photo_details'] && state.entities['photo_details'][ownProps.photo.id]) {
      const  details = state.entities['photo_details'][ownProps.photo.id]
      const  similars = state.entities['photo_similars'][ownProps.photo.id]
      var nextProps = Object.assign({}, ownProps, { imageDetails: details ,  imageSimilars: similars } )
      return nextProps
    }
  }
  return ownProps // Object.assign({}, ownProps, state.photos)
}

export default connect(mapStateToProps, {
  loadImageDetails,
  loadSimilarImages
})(ImageItem)

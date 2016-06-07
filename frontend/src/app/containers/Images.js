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


function loadData(props) {
  console.log("Images loadData: with props: " , props)
  console.log("loggedInUser:", loggedInUser)
  console.log("call args[1]" ,{}, " args[2]", loggedInUser['auth_token'])
  props.loadPhotos({}, loggedInUser['auth_token'])
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




class Images extends Component {

    
    handleLoadMoreClick() {
	//	this.props.loadStargazers(this.props.fullName, true)
    }

    componentWillMount() {
	loadData(this.props)
    }

    componentDidMount() {
	console.log("Images component did mount, context is:", this.context);
	console.log("Images.props is : ", this.props)
	//const { store } = this.context;
	//this.unsubscribe = store.subscribe(() => this.forceUpdate());
	// console.log("Images component did mount and we subscribed");	
    }

    componentWillUnmount() {
	// this.unsubscribe();
    }

    componentWillReceiveProps(nextProps) {
	console.log("III Image: willReceiveProps: ", nextProps);
    }

    renderImage(photo) {
	// console.log("renderImage photo is:", photo)


	return (
		<ImageItem photo={photo} />
	);
/**
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
		<FlatButton label="Details" />
		</CardActions>

		</Card>
		</ListItem>
	);
**/
    }
    render() {
	console.log("RRRRRR  rendering in Images: with props ", this.props)
	const { store, history, solr } = this.props

	if (solr) {
	    return (
		    <div>
		    <List
		padding={1}
		style={styles.gridList}
		    >
		{solr.docs.map(this.renderImage)}
		</List>
		</div>
	    );
	} else {
	    return (
		    <div>
		    <p>no images go here</p>
		    </div>
	    );
	}
    }

}

Images.propTypes = {
    loadPhotos: PropTypes.func.isRequired,
    loadImageDetails: PropTypes.func.isRequired,
    query: PropTypes.object,
    queryChanged: PropTypes.boolean // ,
    // photos: PropTypes.object.isRequired
}

// react-redux calls this when there's been some change of state we may be interested in
function mapStateToProps(state, ownProps) {
    //not sure  what to do, here
    console.log("updating images container props")
    return Object.assign({}, ownProps, state.photos)
}

export default connect(mapStateToProps, {
    loadPhotos,
    loadImageDetails
})(Images)

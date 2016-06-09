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
    }

    componentWillMount() {
	loadData(this.props)
    }

    componentDidMount() {
    }

    componentWillUnmount() {
	// this.unsubscribe();
    }

    componentWillReceiveProps(nextProps) {
      //	console.log("III Image: willReceiveProps: ", nextProps);
    }

    renderImage(photo) {
	return (
		<ImageItem photo={photo} />
	);
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
    return Object.assign({}, ownProps, state.photos)
}

export default connect(mapStateToProps, {
    loadPhotos,
    loadImageDetails
})(Images)

import * as ActionTypes from '../actions'
import merge from 'lodash/merge'
import paginate from './paginate'
import { routerReducer as routing } from 'react-router-redux'   // does magic, I suppose
import { combineReducers } from 'redux'

// Updates an entity cache in response to any action with response.entities.
//
// We count on this guy to populate the initial state via the default argument
function entities(state = { user: {}, users: {}, repos: {}, photos: {}}, action) {
  if (action.response && action.response.entities) {
    return merge({}, state, action.response.entities)
  }

  return state
}

function photos(state = { query: {} } , action) {
  const { type } = action

  if (type === ActionTypes.COUNTS_SUCCESS) {

    const { counts } = action.response.entities.counts

    var classified = 0
    const { status } = counts.facetFields

    for ( var i = 0; i < status.length; i+=2 ) {
      if (status[i].startsWith('categorized') ) {
	classified += status[i + 1]
      }
    }

    var nums = { total: counts.numFound, classified: classified }

    var nextState = Object.assign({}, state, {counts: nums})
    return nextState
  } else if (type === ActionTypes.PHOTOS_SUCCESS) {
    //    console.log(action.response.entities)
    const { photos } = action.response.entities
    //    console.log("Photos is :", photos)
    
    var nextState = Object.assign({}, state, photos, { queryChanged: false })
    return nextState
  } else if (type === "ADD_QUERY_TERM" ) {
    var nextState = Object.assign({}, state)
    var  { query } = nextState
    //    console.log("reducer got add query term action, State is:", state)
    // console.log ("query from nextState is", query)
    // console.log("!!! action response", action.response)
    const { term }  = action.response

    // console.log("TERM is:", term)

    for (const key in term) {
      console.log("TERM HAS key", key)
      if (query.hasOwnProperty(key)) {
	const val = term[key]
	var words = query[key]
	//	console.log("words is: " , words)
	if (typeof words === 'string') {
	  if (!words.equals(val)) {
	    query[key] = [ words, val]
	  }
	} else if (typeof words === 'object' && Array.isArray(words) && words.indexOf(val) == -1) {
	  query[key] = [...words, val] 
	}
	// query[key] = words.push(value)
      } else {
	query[key] = [ term[key] ]
      }
    }
    
    // console.log("Now query is", query)
    const queryChanged = true;
    nextState = Object.assign(nextState, { query, queryChanged })
    // console.log("reducer finishe add query term action, nextState is:", nextState)
    
    return nextState
    
  }  else if (type === "DELETE_QUERY_TERM" ) {
    // console.log("reducer got DELETE query term action")
    var nextState = Object.assign({}, state)
    var  { query } = nextState
    const termType = action.response[0]
    const termVal = action.response[1]
    if (query.hasOwnProperty(termType)) {
      var words = query[termType]
      // console.log("words is: " , words)
      if (typeof words === 'string') {
	if (words.equals(termVal)) {
	  query[termType] = []
	}
      } else if (typeof words === 'object' && Array.isArray(words) && words.indexOf(termVal) > -1) {
	var ix = words.indexOf(termVal)
	var newArr = words.slice(0, ix).concat(words.slice(ix+1))
	// console.log("DELETE_QUERY_TERM: newArr is:", newArr);
	query[termType] =  newArr  // [...words, val] 
      }
      // query[key] = words.push(value)
    }
    const queryChanged = true;
    nextState = Object.assign(nextState, { query, queryChanged })
    // console.log("reducer finished DELETE_QUERY_TERM action, nextState is:", nextState)
    return nextState
  }
  return state
}

function queryTerms(state = { "query": { } }, action) {

  const { type, response } = action

  if (type === "ADD_QUERY_TERM" ) {
    var nextState = Object.assign({}, state)
    
    console.log("reducer got add query term action, State is:", state)
    console.log("reducer got add query term action, nextState is:", nextState)
    if (nextState.hasOwnProperty('photos')) {
      console.log("have photos in state");
    } else {
      console.log("DO NOT have photos in nextState");
    }
    return nextState
  }
  
  return state
  
}

//
// puts the logged in user into the state
function storeUser ( state = { user: {} }, action) {
  const { type } = action

  if (action.response && action.response.user) {
    return merge({}, state, action.response)
  }
  
  return state
}


// Updates error message to notify about the failed fetches.
function errorMessage(state = null, action) {
  const { type, error } = action

  if (type === ActionTypes.RESET_ERROR_MESSAGE) {
    return null
  } else if (error) {
    return action.error
  }

  return state
}

// Updates the pagination data for different actions.
const pagination = combineReducers({
  starredByUser: paginate({
    mapActionToKey: action => action.login,
    types: [
      ActionTypes.STARRED_REQUEST,
      ActionTypes.STARRED_SUCCESS,
      ActionTypes.STARRED_FAILURE
    ]
  }),
  stargazersByRepo: paginate({
    mapActionToKey: action => action.fullName,
    types: [
      ActionTypes.STARGAZERS_REQUEST,
      ActionTypes.STARGAZERS_SUCCESS,
      ActionTypes.STARGAZERS_FAILURE
    ]
  }),
  foundPhotos: paginate({
    mapActionToKey: action => action.query,
    types: [
      ActionTypes.PHOTOS_REQUEST,
      ActionTypes.PHOTOS_SUCCESS,
      ActionTypes.PHOTOS_FAILURE
    ]
  })

})

// iterate through all the reducers
const rootReducer = combineReducers({
  entities,
  storeUser,
  photos,

  pagination,
  errorMessage,
  routing
})

export default rootReducer

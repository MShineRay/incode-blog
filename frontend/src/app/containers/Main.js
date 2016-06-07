import React, { Component, PropTypes } from 'react'
import { Provider } from 'react-redux';
import MainBody from './MainBody'
import DevTools from './DevTools'

export default class Main extends Component {
    render() {
	console.log("rendering in Main")
	const { store, history } = this.props

	/**
		<Provider store={store}>
		<div>
		<MainBody />
		<DevTools />
		</div>
		</Provider>
	*/
	return (
		<Provider store={store}>
		<div>
		<MainBody />
		</div>
		</Provider>
	);
    }
}

Main.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
}


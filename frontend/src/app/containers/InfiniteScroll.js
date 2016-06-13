import React, { Component, PropTypes } from 'react'

function topPosition(domElt) {
  if (!domElt) {
    return 0;
  }
  return domElt.offsetTop + topPosition(domElt.offsetParent);
}


class  InfiniteScroll extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    console.log("IS got didUpdate")
        this.pageLoaded = this.props.pageStart;
    this.attachScrollListener();
  }
  componentDidUpdate() {
    console.log("IS got didUpdate")
    this.attachScrollListener();
  }
  render() {
    console.log("IS will render with props:", this.props)
    var props = this.props;
    return (
	<div children={props.children}
      loader={ props.hasMore && (props.loader || InfiniteScroll._defaultLoader)}
      ref={ (c) =>   {
	console.log("Maybe ADDING REF of ", c)
	if (c) {this._DOMNode = c }
      }
	  }
	/>
    )
  }
  
  scrollListener() {
    // var el = React.findDOMNode(this)
    //    console.log("InfiniteScroll myDOMNode:", this._DOMNode)
    var el = this._DOMNode;
    if (el) {
      console.log("scrollListener has an element")
      var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
      const tpel = topPosition(el)
      const yorigin = el.offsetHeight - scrollTop - window.innerHeight
      const toploc = tpel + yorigin
      const nthresh = Number(this.props.threshold)
      //      if (topPosition(el) + el.offsetHeight - scrollTop - window.innerHeight < Number(this.props.threshold)) {
      console.log("toploc", toploc, (toploc < nthresh) ? "<" : ">" , nthresh)
      if (toploc < nthresh) {
	this.detachScrollListener();
	// call loadMore after detachScrollListener to allow
	// for non-async loadMore functions
	this.props.loadMore(this.pageLoaded += 1);
      }
    } else {
      console.log("no _DOMNode")
    }
  }

  attachScrollListener() {
    console.log("IS May attach")
    if (!this.props.hasMore) {
      return;
    }
    window.addEventListener('scroll', this.scrollListener);
    window.addEventListener('resize', this.scrollListener);
    this.scrollListener();
  }
  
  detachScrollListener() {
    console.log("IS Will detach")
    window.removeEventListener('scroll', this.scrollListener);
    window.removeEventListener('resize', this.scrollListener);
  }
  componentWillUnmount() {
    console.log("IS did unmount")
    this.detachScrollListener();
  }
}


InfiniteScroll.setDefaultLoader = function (loader) {
  InfiniteScroll._defaultLoader = loader;
}

InfiniteScroll.defaultProps = {
  pageStart: 0,
  hasMore: false,
  loadMore: function () {},
  threshold: 250
}

export default InfiniteScroll;

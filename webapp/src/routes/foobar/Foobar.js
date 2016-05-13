/**
 * FOOBAR.js
 */


import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Foobar.scss';

const title = 'Image categorizer foobar';

function Foobar(props, context) {
  console.log("HEY FOOBAR");
  context.setTitle(title);
  return (
    <div className={s.root}>
      <div className={s.container}>
        <h1>{title}</h1>
        <p>...</p>
      </div>
    </div>
  );
}

console.log("Foobar has been required");

Foobar.contextTypes = { setTitle: PropTypes.func.isRequired };

export default withStyles(s)(Foobar);

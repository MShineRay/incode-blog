/**
 * FOOBAR index.js
 */

import React from 'react';
import Foobar from './Foobar';

console.log("Foobar is", Foobar);

export default {

  path: '/foobar',

  action() {
    return <Foobar />;
  },

};

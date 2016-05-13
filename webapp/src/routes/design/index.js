/**
 * DESIGN index.js
 */

import React from 'react';
import Design from './Design';

console.log("Design is: ", Design);

export default {

  path: '/design',

  action() {
    return <Design />;
  },

};

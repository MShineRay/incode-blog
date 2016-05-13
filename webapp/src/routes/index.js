/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import App from '../components/App';

// Child routes
import home from './home';
import contact from './contact';
import login from './login';
import foobar from './foobar';
import register from './register';
import content from './content';
import design from './design';
import error from './error';

export default {

  path: '/',

  children: [
    home,
    contact,
    login,
    foobar,
    register,
    content,
    design,
    error,
  ],

  async action({ next, render, context }) {
    console.log("async action in routes/index");
    const component = await next();
    if (component === undefined) {
      console.log("undefined component in routes");
      return component;
    }
    console.log("guess we got a component, so we'll return the render", component);
    return render(
      <App context={context}>{component}</App>
    );
  },

};

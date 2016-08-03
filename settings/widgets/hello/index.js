import React from 'react'

/* global stylesheet */

stylesheet(`${__dirname}/style.css`)

const Hello = (props) => (
  <div className='widget Hello'>
    <h1>Hi</h1>
    <p>this is a demo widget. You can find it in <small>{__dirname}</small>. It's a normal ES6 React component with full access to nodejs.</p>
  </div>
)

export default Hello

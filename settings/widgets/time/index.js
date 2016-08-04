import React from 'react'
import moment from 'moment'
/* global stylesheet */

export default class Time extends React.Component {
  componentDidMount () {
    this._interval = setInterval(this.forceUpdate, 30000)
    stylesheet(`${__dirname}/style.css`)
  }

  componentWillUnmount () {
    clearInterval(this._interval)
    unstylesheet(`${__dirname}/style.css`)
  }

  render () {
    const now = moment()
    return (
      <div className='widget Time'>
        <div className='time'>{now.format('h:mm a')}</div>
        <div className='date'>{now.format('ddd, MMM Do')}</div>
      </div>
    )
  }
}

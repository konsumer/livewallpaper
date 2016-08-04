import React from 'react'
import { getWeather, codeToChar, moonIcon, moonText } from './yahoo-weather'

/* global fetch stylesheet, unstylesheet */

// get rough location from freegeoip
function getLocation () {
  return fetch('http://freegeoip.net/json/')
    .then(r => r.json())
}

export default class Weather extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      location: false,
      weather: false
    }
    this.getWeather = this.getWeather.bind(this)
  }

  componentDidMount () {
    stylesheet(`${__dirname}/style.css`)
    this.interval = setInterval(this.getWeather, 30000)
    this.getWeather()
  }

  componentWillUnmount () {
    unstylesheet(`${__dirname}/style.css`)
    clearInterval(this.interval)
  }

  getWeather () {
    getLocation()
      .then(r => {
        this.setState({location: r})
        return r
      })
      .then(location => {
        // console.log('location', location)
        getWeather(`${location.city}, ${location.region_name}, ${location.country_code}`)
          .then(r => {
            if (r && r.query && r.query.results && r.query.results.channel) {
              this.setState({weather: r.query.results.channel})
              // console.log('weather', r.query.results.channel)
            } else {
              console.error('malformed weather', r)
            }
          })
      })
  }

  render () {
    const {weather, location} = this.state
    return (
      <div className='widget Weather'>
        {!!location && <div className='placeName'>{location.city}, {location.region_name}</div>}
        {!!weather || <div>Getting forecast.</div>}
        {!!weather && (
          <div>
            <div className='current item'>
              <i className='wi'>{codeToChar(weather.item.condition.code)}</i>
              {weather.item.condition.temp}&deg;{weather.units.temperature}
            </div>
            <div className='forecast'>
              {weather.item.forecast.map((f, i) => {
                const theDate = new Date((new Date()).getTime() + (i * 8.64e+7))
                return (
                  <div className='item' key={i}>
                    <i className='wi'>{codeToChar(f.code)}</i>
                    <div className='day'>{f.day}</div>
                    <div className='low'>{f.low}&deg;{weather.units.temperature}</div>
                    <div className='high'>{f.high}&deg;{weather.units.temperature}</div>
                    <div className='moon-info'>
                      <i className={`wi moon ${moonIcon(theDate)}`} />
                    </div>
                  </div>
                )
              })}
            </div>
            <div className='extraInfo'>
              <i className='wi wi-sunrise' /> {weather.astronomy.sunrise}&nbsp;
              <i className='wi wi-sunset' /> {weather.astronomy.sunset}&nbsp;|&nbsp;
              <i className={`wi moon ${moonIcon(new Date())}`} /> {moonText(new Date())} moon&nbsp;|&nbsp;
              <i className='wi wi-windy' />&nbsp;
              <i className={`wi wi-wind.towards-${weather.wind.direction}-deg`} />&nbsp;
              {weather.wind.chill}&deg;{weather.units.temperature}&nbsp;
              chill, {weather.wind.speed}{weather.units.speed}
            </div>
          </div>
        )}
      </div>
    )
  }
}


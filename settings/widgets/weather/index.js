import React from 'react'

/* global fetch stylesheet, unstylesheet */

// get weather from yahoo
function yahooWeather (place) {
  const query = `select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="${place}")`
  return fetch(`https://query.yahooapis.com/v1/public/yql?format=json&q=${encodeURIComponent(query)}`)
    .then(r => r.json())
}

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
        console.log('location', location)
        yahooWeather(`${location.city}, ${location.region_name}, ${location.country_code}`)
          .then(r => {
            if (r && r.query && r.query.results && r.query.results.channel) {
              this.setState({weather: r.query.results.channel})
              console.log('weather', r.query.results.channel)
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
            <div className='current item' style={{backgroundImage: `url(http://l.yimg.com/a/i/us/we/52/${weather.item.condition.code}.gif)`}}>
              {weather.item.condition.temp}&deg;{weather.units.temperature}
            </div>
            <div className='forecast'>
              {weather.item.forecast.map((f, i) => (
                <div className='item' key={i} style={{backgroundImage: `url(http://l.yimg.com/a/i/us/we/52/${f.code}.gif)`}}>
                  <div className='day'>{f.day}</div>
                  <div className='low'>{f.low}&deg;{weather.units.temperature}</div>
                  <div className='high'>{f.high}&deg;{weather.units.temperature}</div>
                </div>
              ))}
            </div>
            <div className='extraInfo'>
              <div><b>sun:</b> {weather.astronomy.sunrise} - {weather.astronomy.sunset}</div>
              <div><b>wind:</b> direction: {weather.wind.direction}&deg; chill: {weather.wind.chill}&deg;{weather.units.temperature} speed: {weather.wind.speed}{weather.units.speed}</div>
            </div>
          </div>
        )}
      </div>
    )
  }
}


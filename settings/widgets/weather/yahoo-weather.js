/* global fetch */

const codeMap = {
  '0': '',
  '1': '',
  '2': '',
  '3': '',
  '4': '',
  '5': '',
  '6': '',
  '7': '',
  '8': '',
  '9': '',
  '10': '',
  '11': '',
  '12': '',
  '13': '',
  '14': '',
  '15': '',
  '16': '',
  '17': '',
  '18': '',
  '19': '',
  '20': '',
  '21': '',
  '22': '',
  '23': '',
  '24': '',
  '25': '',
  '26': '',
  '27': '',
  '28': '',
  '29': '',
  '30': '',
  '31': '',
  '32': '',
  '33': '',
  '34': '',
  '35': '',
  '36': '',
  '37': '',
  '38': '',
  '39': '',
  '40': '',
  '41': '',
  '42': '',
  '43': '',
  '44': '',
  '45': '',
  '46': '',
  '47': '',
  '3200': ''
}

const codeTextMap = {
  0: 'tornado',
  1: 'tropical storm',
  2: 'hurricane',
  3: 'severe thunderstorms',
  4: 'thunderstorms',
  5: 'mixed rain and snow',
  6: 'mixed rain and sleet',
  7: 'mixed snow and sleet',
  8: 'freezing drizzle',
  9: 'drizzle',
  10: 'freezing rain',
  11: 'showers',
  12: 'showers',
  13: 'snow flurries',
  14: 'light snow showers',
  15: 'blowing snow',
  16: 'snow',
  17: 'hail',
  18: 'sleet',
  19: 'dust',
  20: 'foggy',
  21: 'haze',
  22: 'smoky',
  23: 'blustery',
  24: 'windy',
  25: 'cold',
  26: 'cloudy',
  27: 'mostly cloudy (night)',
  28: 'mostly cloudy (day)',
  29: 'partly cloudy (night)',
  30: 'partly cloudy (day)',
  31: 'clear (night)',
  32: 'sunny',
  33: 'fair (night)',
  34: 'fair (day)',
  35: 'mixed rain and hail',
  36: 'hot',
  37: 'isolated thunderstorms',
  38: 'scattered thunderstorms',
  39: 'scattered thunderstorms',
  40: 'scattered showers',
  41: 'heavy snow',
  42: 'scattered snow showers',
  43: 'heavy snow',
  44: 'partly cloudy',
  45: 'thundershowers',
  46: 'snow showers',
  47: 'isolated thundershowers',
  3200: 'not available'
}

const moonMap = [
  'wi-moon-new',
  'wi-moon-waxing-crescent-1',
  'wi-moon-waxing-crescent-2',
  'wi-moon-waxing-crescent-3',
  'wi-moon-waxing-crescent-4',
  'wi-moon-waxing-crescent-5',
  'wi-moon-waxing-crescent-6',
  'wi-moon-first-quarter',
  'wi-moon-waxing-gibbous-1',
  'wi-moon-waxing-gibbous-2',
  'wi-moon-waxing-gibbous-3',
  'wi-moon-waxing-gibbous-4',
  'wi-moon-waxing-gibbous-5',
  'wi-moon-waxing-gibbous-6',
  'wi-moon-full',
  'wi-moon-waning-gibbous-1',
  'wi-moon-waning-gibbous-2',
  'wi-moon-waning-gibbous-3',
  'wi-moon-waning-gibbous-4',
  'wi-moon-waning-gibbous-5',
  'wi-moon-waning-gibbous-6',
  'wi-moon-third-quarter',
  'wi-moon-waning-crescent-1',
  'wi-moon-waning-crescent-2',
  'wi-moon-waning-crescent-3',
  'wi-moon-waning-crescent-4',
  'wi-moon-waning-crescent-5',
  'wi-moon-waning-crescent-6'
]

const moonTextMap = [
  'new',
  'waxing crescent',
  'waxing crescent',
  'waxing crescent',
  'waxing crescent',
  'waxing crescent',
  'waxing crescent',
  'first quarter',
  'waxing gibbous',
  'waxing gibbous',
  'waxing gibbous',
  'waxing gibbous',
  'waxing gibbous',
  'waxing gibbous',
  'full',
  'waning gibbous',
  'waning gibbous',
  'waning gibbous',
  'waning gibbous',
  'waning gibbous',
  'waning gibbous',
  'third quarter',
  'waning crescent',
  'waning crescent',
  'waning crescent',
  'waning crescent',
  'waning crescent',
  'waning crescent'
]

export function moonPhasePercent (date) {
  const synodic = 29.53058867
  const msPerDay = 86400000
  const baseDate = new Date()
  baseDate.setUTCFullYear(2005)
  baseDate.setUTCMonth(4)
  baseDate.setUTCDate(8)
  baseDate.setUTCHours(8)
  baseDate.setUTCMinutes(48)
  const diff = date - baseDate
  let phase = diff / (synodic * msPerDay)
  phase *= 100
  phase %= 100
  if (phase < 0) {
    phase += 100
  }
  return (phase)
}

// output correct moon icon for a date
export function moonIcon (date) {
  return moonMap[Math.floor((moonPhasePercent(date) / 100) * 28)]
}

export function moonText (date) {
  return moonTextMap[Math.floor((moonPhasePercent(date) / 100) * 28)]
}

// get weather from yahoo
export function getWeather (place) {
  const query = `select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="${place}")`
  return fetch(`https://query.yahooapis.com/v1/public/yql?format=json&q=${encodeURIComponent(query)}`)
    .then(r => r.json())
}

// output correct weather icon for a yahoo weather condition code
export function codeToChar (code) {
  return codeMap[code]
}

export function codeToText (code) {
  return codeTextMap[code]
}

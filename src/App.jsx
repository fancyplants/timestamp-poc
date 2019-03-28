import React from 'react'
import axios from 'axios'

import './App.css'

function userTimeToMilitaryTime(userTime = '') {
  const [time, meridiem] = userTime.split(' ')
  

  const lcMeridiem = meridiem.toLowerCase()
  let [hours, minutes] = time.split(':')
  hours = +hours
  minutes = +minutes
  console.log(hours, minutes)

  if (lcMeridiem === 'pm') {
    hours += 12
  }

  return hours + ':' + minutes
}


async function fetchSessionObj() {
  const resp = await axios.get('/session')
  const { data } = resp
  return data
}


class App extends React.Component {
  constructor() {
    super()
    this.state = {
      start: '',
      end: '',
      date: '',

      session: {}
    }
  }

  async componentDidMount() {
    const data = await fetchSessionObj()
    this.setState({ session: data })
  }

  handleChange = field => e => {
    this.setState({ [field]: e.target.value })
  }

  submitData = async () => {
    const { start, end, date } = this.state
    const milStart = userTimeToMilitaryTime(start)
    const milEnd = userTimeToMilitaryTime(end)

    // converting to timestamps absolves us of having to handle timezone
    const startStamp = new Date(`${milStart} ${date}`).getTime().toString()
    const endStamp = new Date(`${milEnd} ${date}`).getTime().toString()

    await axios.post('/session', { startStamp, endStamp })
    const { data } = await axios.get('/session')
    this.setState({ session: data })
  }
  

  render() {
    const { handleChange, submitData } = this
    const { start, end, date, session } = this.state

    // cast the strings to numbers
    const startStamp = +session.startStamp
    const endStamp = +session.endStamp

    // since timestamps are totally timezone-independent, this converts
    // straight to the browser's current time
    const startDate = new Date(startStamp)
    const endDate = new Date(endStamp)

    return (
      <>
        <p>Start Time</p>
        <input onChange={handleChange('start')} value ={start}/>
        <p>End Time</p>
        <input onChange={handleChange('end')} value={end}/>
        <p>Date</p>
        <input onChange={handleChange('date')} type="date" value={date} />
        <button onClick={submitData}>Submit</button>

        <h2>Fetched from server:</h2>
        <p>Start Time: {startDate.toLocaleTimeString()}</p>
        <p>End Time: {endDate.toLocaleTimeString()}</p>
      </>
    )
  }
}


export default App

import React from 'react'
import './App.css'
import moment from 'moment'

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      runLength: 60,
      walkLength: 30,
      status: 'walk',
      timers: {
        walk: {
          moment: null,
          length: null,
        },
        run: {
          moment: null,
          length: null,
        },
        total: {
          moment: null,
        }
      }
    }

    this.onStart = this.onStart.bind(this)
    this.onChange = this.onChange.bind(this)
    this.handleTimer = this.handleTimer.bind(this)
  }

  onStart () {
    const now = moment()
    this.setState({
      status: 'walk',
      timers: {
        walk: {
          length: this.state.walkLength,
          moment: now,
        },
        run: {
          length: this.state.runLength,
        },
        total: {
          moment: now,
        }
      }
    })
    this.timer = setInterval(this.handleTimer, 1)
  }

  handleTimer () {
    const { status } = this.state
    const time = this.calcRemainingTime(status)

    if (time < 0) {
      const newStatus = status === 'walk' ? 'run' : 'walk'
      const timers = { ...this.state.timers }
      const now = moment()
      timers[newStatus].moment = now
      this.setState({
        status: newStatus,
        timers
      })
    } else {
      this.setState({ time })
    }
  }

  onChange (event) {
    this.setState({ [event.target.name]: event.target.value })
  }

  renderTimeOptions () {
    const timeOptions = [15,30,45,60,90,120,180,210,240,270,300]

    return timeOptions.map((timeOption) => {
      const formatted = moment.utc(moment.duration(timeOption, 'seconds')
        .as('milliseconds')).format('m:ss').toString()
      return (
        <option value={timeOption}>{formatted}</option>
      )
    })
  }

  calcRemainingTime (type) {
    const timeElapsedMilliseconds = moment().diff(this.state.timers[type].moment)
    const timerDurationMilliseconds = this.state.timers[type].length * 1000
    const remainingMilliseconds = timerDurationMilliseconds - timeElapsedMilliseconds
    const remainingSeconds = remainingMilliseconds / 1000
    return remainingSeconds.toFixed(1)
  }

  render () {
    return (
      <div className="App">
        <h2>Set Timer Intervals</h2>
        <pre>
          {JSON.stringify(this.state)}
        </pre>
        <h4>Run</h4>
        <select onChange={this.onChange} name="runLength" value={this.state.runLength}>
          {this.renderTimeOptions()}
        </select>
        <h4>Walk</h4>
        <select onChange={this.onChange} name="walkLength" value={this.state.walkLength}>
          {this.renderTimeOptions()}
        </select>
        <br></br>
        <button onClick={this.onStart}>Start</button>

        <h2>Time Remaining</h2>
        <h4>{this.state.time}</h4>
        <h4>{this.state.status}</h4>
      </div>
    )
  }
}

export default App

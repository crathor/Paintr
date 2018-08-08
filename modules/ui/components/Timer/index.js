import React, { Component, Fragment } from 'react'
import './styles.css'

class Timer extends Component {
  // seen on https://stackoverflow.com/questions/40885923/countdown-timer-in-react
  constructor() {
    super()
    this.state = {
      timer: 0,
      time: {},
      seconds: 60,
      pause: true
    }
  }

  secondsToTime = secs => {
    const hours = Math.floor(secs / (60 * 60))

    const divisor_for_minutes = secs % (60 * 60)
    const minutes = Math.floor(divisor_for_minutes / 60)

    const divisor_for_seconds = divisor_for_minutes % 60
    const seconds = Math.ceil(divisor_for_seconds)

    const timer = {
      h: hours,
      m: minutes,
      s: seconds
    }
    return timer
  }

  componentDidMount() {
    let timeLeftVar = this.secondsToTime(this.state.seconds)
    this.setState({ time: timeLeftVar })
  }

  startTimer = () => {
    this.interval = setInterval(this.countDown, 1000)
    this.setState({ pause: false })
    if (this.state.seconds >= 60 || this.state.seconds === 0)
      Meteor.call('reset.gameboard')
  }

  stopTimer = () => {
    clearInterval(this.interval)
    this.setState({ pause: true })
  }

  reset = () => {
    clearInterval(this.interval)
    this.setState({
      timer: 0,
      paused: true,
      time: this.secondsToTime(this.state.seconds),
      seconds: 120,
      pause: true
    })
  }
  countDown = () => {
    // Remove one second, set state so a re-render happens.
    let seconds = this.state.seconds - 1
    this.setState({
      time: this.secondsToTime(seconds),
      seconds: seconds
    })

    // Check if we're at zero.
    if (seconds === 0) {
      this.reset()
      this.props.calcWinner()
    }
  }

  render() {
    const { time } = this.state
    return (
      <Fragment>
        <p className="timer">
          {time.m} : {time.s < 10 ? `0${time.s}` : time.s}
        </p>
        <div className="buttonContainer">
          <button
            className="start"
            disabled={this.props.disabled}
            onClick={this.state.pause ? this.startTimer : this.stopTimer}
          >
            {this.state.pause ? 'Start' : 'Pause'}
          </button>
          <button className="reset" onClick={this.reset}>
            Reset
          </button>
        </div>
      </Fragment>
    )
  }
}
export default Timer

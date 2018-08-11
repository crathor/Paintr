import React, { Component, Fragment } from 'react'
import './styles.css'
import Modal from '../Modal'
import { GAME_TIME, BRICK_COLUMNS, BRICK_ROWS } from '../config'
class Timer extends Component {
  // seen on https://stackoverflow.com/questions/40885923/countdown-timer-in-react
  constructor() {
    super()
    this.state = {
      timer: 0,
      time: {},
      seconds: GAME_TIME,
      pause: true,
      show: false,
      winner: {
        name: '',
        color: ''
      }
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
    if (this.state.seconds >= 60 || this.state.seconds === 0) {
      Meteor.call('reset.gameboard')
      Meteor.call('reset.player.speed')
    }
  }

  stopTimer = () => {
    clearInterval(this.interval)
    this.setState({ pause: true })
  }

  reset = () => {
    clearInterval(this.interval)
    this.setState({
      timer: 0,
      pause: true,
      time: this.secondsToTime(this.state.seconds),
      seconds: GAME_TIME,
      show: false
    })
    Meteor.call('reset.gameboard')
  }
  countDown = () => {
    // Remove one second, set state so a re-render happens.
    let seconds = this.state.seconds - 1
    this.setState({
      time: this.secondsToTime(seconds),
      seconds: seconds
    })
    if (seconds % 5 === 0 || seconds % 8 === 0) {
      Meteor.call(
        'update.brick',
        Math.floor(Math.random() * (BRICK_COLUMNS * BRICK_ROWS))
      )
    }
    // Check if we're at zero.
    if (seconds === 0) {
      this.reset()
      this.props.calcWinner()
      this.setState({
        show: true
      })
    }
  }
  closeModal = () => {
    this.reset()
    this.setState({
      show: false
    })
  }

  render() {
    const { time } = this.state
    const { winner } = this.props
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
        <Modal
          show={this.state.show}
          close={this.closeModal}
          style={{ backgroundColor: winner.color }}
        >
          <div className="modalBody">
            <p className="modalText" style={{ background: winner.color }}>
              -Winner-
              <span className="winnerName">{winner.name}</span>
            </p>
            <button className="modalReset" onClick={this.reset}>
              Play Again
            </button>
          </div>
        </Modal>
      </Fragment>
    )
  }
}
export default Timer

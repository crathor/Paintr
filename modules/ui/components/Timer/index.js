import React, { Component } from "react";

class Timer extends Component {
  // seen on https://stackoverflow.com/questions/40885923/countdown-timer-in-react
  constructor() {
    super();
    this.state = { time: {}, seconds: 20 };
    this.timer = 0;
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);
  }

  secondsToTime(secs) {
    let hours = Math.floor(secs / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    let obj = {
      h: hours,
      m: minutes,
      s: seconds
    };
    return obj;
  }

  componentDidMount() {
    let timeLeftVar = this.secondsToTime(this.state.seconds);
    this.setState({ time: timeLeftVar });

    window.onkeydown = e => {
      switch (e.key) {
        case "q":
          console.log("pressed the q");
          break;
        case RESET_KEY:
          Meteor.call("reset.timer");
          Meteor.call("get.time", (err, res) => {
            console.log(res);
          });
          break;
        default:
          break;
      }
    };
  }

  startTimer() {
    if (this.timer == 0) {
      this.timer = setInterval(this.countDown, 1000);
    }
  }
  // resetTimer() {
  //   this.state = { time: {}, seconds: 120 };
  // }
  // componentDidUpdate(prevProps) {
  //   if (prevProps.resetTimer !== this.props.resetTimer) {
  //     this.resetTimer();
  //     this.props.timerReset();
  //   }
  // }

  countDown() {
    // Remove one second, set state so a re-render happens.
    let seconds = this.state.seconds - 1;
    this.setState({
      time: this.secondsToTime(seconds),
      seconds: seconds
    });

    // Check if we're at zero.
    if (seconds == 0) {
      clearInterval(this.timer);
      this.props.calcWinner();
    }
  }

  render() {
    return (
      <div>
        <button
          style={{ display: "none" }}
          onClick={this.props.start ? this.startTimer() : null}
        >
          Start
        </button>
        m: {this.state.time.m} s: {this.state.time.s}
      </div>
    );
  }
}
export default Timer;

import React from 'react';

const DEFAULT = {
  sessionLength: 25,
  breakLength: 5,
  activity: 'Session',
  current: 1500,
  timerOn: false
}

// const SESSION = {
//     activity: 'Session',

// }

let counter;

const mmssFormat = (seconds) => {
  return (seconds < 600 ? '0' : '') + Math.floor(seconds / 60) + ':' + (seconds % 60 < 10 ? '0' : '') + seconds % 60;
}

const TimeController = (props) => {
  const id = props.label.toLowerCase();
  return (
    <div className='time-control'>
      <div id={id + '-label'}>{props.label}</div>
      <button id={id + '-increment'} onClick={props.onClick}><i className="fa fa-angle-up" aria-hidden="true"></i></button>
      <div id={id + '-length'}>{props.length}</div>
      <button id={id + '-decrement'} onClick={props.onClick}><i className="fa fa-angle-down" aria-hidden="true"></i></button>
    </div>
  )
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionLength: 25,
      breakLength: 5,
      activity: 'Session',
      current: 1500,
      timerOn: false
    }
    this.handleClick = this.handleClick.bind(this);
    this.toggleTimer = this.toggleTimer.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
  }

  handleClick(e) {
    // console.log(e.target.id || e.target.parentElement.id);
    let newBreak, newSession;
    switch (e.target.id || e.target.parentElement.id) {
      case 'break-increment':
        newBreak = this.state.breakLength >= 60 ? 60 : this.state.breakLength + 1;
        this.setState(state => ({
          breakLength: newBreak,
          current: state.activity === 'Break' ? newBreak * 60 : state.current,
        }));
        break;
      case 'break-decrement':
        newBreak = this.state.breakLength <= 1 ? 1 : this.state.breakLength - 1;
        this.setState(state => ({
          breakLength: newBreak,
          current: state.activity === 'Break' ? newBreak * 60 : state.current,
        }));
        break;
      case 'session-increment':
        newSession = this.state.sessionLength >= 60 ? 60 : this.state.sessionLength + 1;
        this.setState(state => ({
          sessionLength: newSession,
          current: state.activity === 'Session' ? newSession * 60 : state.current,
        }));
        break;
      case 'session-decrement':
        newSession = this.state.sessionLength <= 1 ? 1 : this.state.sessionLength - 1;
        this.setState(state => ({
          sessionLength: newSession,
          current: state.activity === 'Session' ? newSession * 60 : state.current,
        }));
        break;
      default:
        console.log("Default");
    }
  }

  toggleTimer() {
    if (this.state.timerOn) {
      document.getElementById('start_stop').innerHTML = '<i class="fa fa-play" aria-hidden="true"></i>';
      clearInterval(counter);
      this.setState({
        timerOn: false
      });
    }
    else {
      document.getElementById('start_stop').innerHTML = '<i class="fa fa-pause" aria-hidden="true"></i>';
      this.setState({
        timerOn: true
      });

      counter = setInterval(() => {
        if (this.state.current <= 0) {
          this.setState(state => ({
            activity: state.activity === 'Session' ? 'Break' : 'Session',
            current: (state.activity === 'Session' ? state.breakLength : state.sessionLength) * 60
          }));
          this.beeper.play();
        }
        else {
          //change color at less than 60
          // blinker at 15

          this.setState(state => ({
            current: state.current - 1
          }));
        }
      }, 1000);
    }
  }

  resetTimer() {
    this.beeper.pause();
    this.beeper.currentTime = 0;
    document.getElementById('start_stop').innerHTML = '<i class="fa fa-play" aria-hidden="true"></i>';
    clearInterval(counter);
    this.setState(DEFAULT);
  }

  render() {
    return (
      <div id="wrapper">
        <div id="title">25 + 5 Clock</div>
        <TimeController label={'Break'} length={this.state.breakLength} onClick={this.handleClick} />
        <TimeController label={'Session'} length={this.state.sessionLength} onClick={this.handleClick} />
        <div id="timer-wrapper">
          <div id="timer-label">{this.state.activity}</div>
          <div id="time-left">{mmssFormat(this.state.current)}</div>
        </div>
        <button id="start_stop" onClick={this.toggleTimer}><i className="fa fa-play" aria-hidden="true"></i></button>
        <button id="reset" onClick={this.resetTimer}><i className="fa fa-refresh" aria-hidden="true"></i></button>
        <audio id="beep" preload="auto" ref={(audio) => { this.beeper = audio }} src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav" />
      </div>
    )
  }
}

export default App;
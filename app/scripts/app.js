"use strict";
const shell = (typeof require === 'function') ? require('electron').shell : null;

/* Timer Function */

class Timer {
  constructor(minutes, seconds = 60) {
    this.minutes = minutes;
    this.seconds = seconds;
    this.initialMinutes = minutes;
    this.initialSeconds = seconds;
    this.timer;
    this.pomodoroTime;
  }

  startTimer(display) {
    notifyUser();
    this._initializePomotime();
    this.timer = this.pomodoroTime;
    clearInterval(this.pomodoroIntervalId);

    this.pomodoroIntervalId = setInterval(() => {
      if (--this.timer < 0) {
        this.timer = this.pomodoroTime;
      }

      this.minutes = parseInt(this.timer / 60, 10);
      this.seconds = parseInt(this.timer % 60, 10);

      this.minutes = this.minutes < 10 ? "0" + this.minutes : this.minutes;
      this.seconds = this.seconds < 10 ? "0" + this.seconds : this.seconds;

      display.textContent = this.minutes + ":" + this.seconds;

      if (this.minutes == 0 && this.seconds == 0) {
        notifyUser();
        this.stopTimer();
      }
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.pomodoroIntervalId);
  }

  resetTimer(selector) {
    notifyUser();
    this.minutes = this.initialMinutes;
    this.seconds = this.initialSeconds;
    clearInterval(this.pomodoroIntervalId);
    document.querySelector(selector).textContent =
      `${this._getDoubleDigit(this.initialMinutes)}:00`;
  }

  _getDoubleDigit(number) {
    const filledNumber = "0" + number.toString();
    return filledNumber.length >= 3
      ? filledNumber.slice(1, filledNumber.length)
      : filledNumber;
  }

  _initializePomotime() {
    if (
      this.minutes == this.initialMinutes &&
      this.seconds == this.initialSeconds
    ) {
      this.pomodoroTime = this.minutes * this.seconds;
    } else {
      this.pomodoroTime = this.minutes * 60 + this.seconds;
    }
  }
}

/* Modes */

let normalTimer = new Timer(25);
let shortBreak = new Timer(5);
let longBreak = new Timer(10);

var display = document.querySelector("#time");
var display_short = document.querySelector("#break_short");
var display_long = document.querySelector("#break_long");

const timers = {
  pomodoro: {
    timer: normalTimer,
    display: display,
    selector: "#time",
    label: "Pomodoro",
  },
  short: {
    timer: shortBreak,
    display: display_short,
    selector: "#break_short",
    label: "Short Break",
  },
  long: {
    timer: longBreak,
    display: display_long,
    selector: "#break_long",
    label: "Long Break",
  }
}

let mode = "pomodoro";
const current = () => timers[mode];

/* Timer Functions */ 

$(document).on("click", 'a[href^="http"]', function (event) {
  event.preventDefault();
  shell.openExternal(this.href);
});

$("#start").click(() => {
  current().timer.startTimer(current().display);
  $("#stop").show();
  $("#start").hide();
});

$("#stop").click(() => {
  current().timer.stopTimer();
  $("#start").show();
  $("#stop").hide();
});

$("#reset").click(() => {
  current().timer.resetTimer(current().selector);

  $("#start").show();
  $("#stop").hide();
});

const order = ["pomodoro", "short", "long"];

/* Mode Switching */

$("#mode").click(() => {
  // Stop any timer that might be running
  current().timer.stopTimer();

  // Advance to the next mode
  const currentIndex = order.indexOf(mode);
  mode = order[(currentIndex + 1) % order.length];

  // Swap the visible pane
  $(".tab-pane").removeClass("active in");
  $("#" + mode).addClass("active in");

  // Reset the selected mode
  current().timer.resetTimer(current().selector);
  $("#start").show();
  $("#stop").hide();
});
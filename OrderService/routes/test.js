const date = require('date-and-time')

function timeDiffCalc(date1, date2) {
    var diff = Math.abs(date1.getTime() - date2.getTime()) / 3600000;
    console.log(diff)
    if (diff < 1) { return true }
    return false
  }
  let now = new Date();
  let dateNow = date.addHours(now,1);
  console.log(dateNow)
  console.log(new Date('2022-01-06T22:57:04.795Z'))
  console.log(timeDiffCalc(new Date('2022-01-06T22:57:04.795Z'), dateNow));
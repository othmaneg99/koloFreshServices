function timeDiffCalc(date1, date2) {
    var diff = Math.abs(date1.getTime() - date2.getTime()) / 3600000;
    if (diff < 1) { return true }
    return false
  }
  console.log(new Date())
  console.log(new Date('2022-01-05T22:06:00.000Z'))
  console.log(timeDiffCalc(new Date('2022-01-05T23:56:00.000Z'), new Date()));
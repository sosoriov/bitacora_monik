var spawn = require('child_process').spawnSync,
    width = 80


try {
  width = spawn('resize').output[1].toString().match(/COLUMNS=(\d+)/)[1]
} catch(e) {}

width = +width

function printHeader ( text, color, bg ){
  var whiteNoise = new Array(width + 1).join(' '),
      fill = width - text.length,
      left, right

  left = new Array(Math.floor(fill/2) + 1).join(' ')
  right = new Array(Math.ceil(fill/2) + 1).join(' ')

  console.log(whiteNoise[color][bg].bold)
  console.log((left + text + right)[color][bg].bold)
  console.log(whiteNoise[color][bg].bold)
}

module.exports = {
  printHeader: printHeader
}

var five = require("johnny-five");
var Spark = require("spark-io");

var board = new five.Board({
  io: new Spark({
    token: process.env.SPARK_TOKEN,
    deviceId: process.env.SPARK_DEVICE_ID
  })
});

board.on("ready", function() {
  var led = new five.Led("D7");

  // This bit of js injects the led variable into the
  // repl you get after this script finishes execution.
  board.repl.inject({
    led: led
  });

});

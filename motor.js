var five = require("johnny-five");
var Spark = require("spark-io");
var board = new five.Board({
  io: new Spark({
    token: process.env.SPARK_TOKEN,
    deviceId: process.env.SPARK_DEVICE_ID
  })
});

board.on("ready", function() {
  motorL = new five.Motor({
    pin: 'A1'
  });

  motorR = new five.Motor({
    pin: 'A0'
  });

  board.repl.inject({
    l: motorL,
    r: motorR
  });

});

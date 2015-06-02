
var keypress = require("keypress");
keypress(process.stdin);

var five = require("johnny-five");
var Spark = require("spark-io");
var board = new five.Board({
  io: new Spark({
    token: process.env.SPARK_TOKEN,
    deviceId: process.env.SPARK_DEVICE_ID
  })
});

var motorL = null;
var motorR = null;
var servo = null;

board.on("ready", function() {
  motorL = new five.Motor({
    pin: 'A1'
  });

  motorR = new five.Motor({
    pin: 'A0'
  });

  servo = new five.Servo("A7");

  board.repl.inject({
    l: motorL,
    r: motorR,

    s: servo,
  });
});

// Thrust increment
var THRUST_TICK = 255/3;
var THRUST_MAX = 255;
var THRUST_MIN = 0;
var velocity = 0;

var mul_left = 1;
var mul_right = 1;

var turnMultiplier = 0.5;

var aimReset = function() {
  mul_left = 1.0;
  mul_right = 1.0;
}

var aimRight = function() {
  mul_left += turnMultiplier;
  mul_right -= turnMultiplier;

  if (mul_left > 1.0) { mul_left = 1.0; }
  if (mul_right < 0.0) { mul_right = 0.0; }
}

var aimLeft = function() {
  mul_left -= turnMultiplier;
  mul_right += turnMultiplier;

  if (mul_left < 0.0) { mul_left = 0.0; }
  if (mul_right > 1.0) { mul_right = 1.0; }
}

var thrust = function() {
  motorL.start(velocity * mul_left);
  motorR.start(velocity * mul_right);
}

process.stdin.on("keypress", function(ch, key) {
  if (key.name == "w" || key.name == "up") {
    velocity += THRUST_TICK;
    if (velocity >= THRUST_MAX) {
      velocity = THRUST_MAX;
    }
    thrust();
  }

  if (key.name == "a" || key.name == "left") {
    aimLeft();
    thrust();
  }

  // decrease
  if (key.name == "s" || key.name == "down") {
    velocity -= THRUST_TICK;
    if (velocity <= THRUST_MIN) {
      velocity = THRUST_MIN;
      motorL.stop();
      motorR.stop();
    }
    thrust();
  }

  if (key.name == "d" || key.name == "right") {
    aimRight();
    thrust();
  }

  if (key.name == "space") {
    motorL.stop();
    motorR.stop();
    velocity = THRUST_MIN;
    aimReset();
  }
});

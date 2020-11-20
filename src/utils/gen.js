const Randomizer = require("./randomizer.js");

class Gen {
  static generate = (min, max, execute) => {
    const times = Randomizer.random(min, max);
    for (var i = 0; i < times; i++) {
      execute();
    }
  };
}

module.exports = Gen;

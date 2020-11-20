/*
    Source: http://kennethjorgensen.com/blog/2014/canvas-trees
    Github: https://github.com/kennethjor
    Author: Kenneth Jorgensen
    Modified by: Alvaro Orellana
*/

Snake = function (ctx, width, height, color, shadowColor) {
  this.setCanvas(ctx, width, height);
  this.x = width / 2;
  this.y = height;
  this.radius = 10;
  this.speed = width / 500;
  this.angle = Math.PI / 2;
  this.angleDiversion = this.fillStyle = color;
  this.shadowColor = shadowColor;
  this.shadowBlur = 2;
  this.generation = 0;
  this.lifespan = 0;
  this.totalDistance = 0;
  this.distance = 0;
};

Snake.prototype = {
  setCanvas: function (ctx, width, height) {
    this.context = ctx;
    this.canvasWidth = width;
    this.canvasHeight = height;
  },

  next: function (canavas) {
    this.draw(canvas);
    this.iterate();
    this.randomize();
    this.split();
    this.lifespan++;
    this.die();
  },

  draw: function (canvas) {
    this.context = canvas.getContext("2d");
    context.save();
    context.fillStyle = this.fillStyle;
    context.shadowColor = this.shadowColor;
    context.shadowBlur = this.shadowBlur;
    context.beginPath();
    context.moveTo(this.x, this.y);
    context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true);
    context.closePath();
    context.fill();
    context.restore();
  },

  iterate: function () {
    var lastX = this.x;
    var lastY = this.y;
    this.x += this.speed * Math.cos(this.angle);
    this.y += this.speed * -Math.sin(this.angle);
    this.radius *= 0.99 - this.generation / 250; // minus 0.004 per generation
    var deltaDistance = Math.sqrt(
      Math.abs(lastX - this.x) + Math.abs(lastY - this.y)
    );
    this.distance += deltaDistance;
    this.totalDistance += deltaDistance;
    if (this.speed > this.radius * 2) this.speed = this.radius * 2;
  },

  randomize: function () {
    this.angle += Math.random() / 5 - 1 / 5 / 2;
  },

  reset: function (context) {
    var margin = 30 + this.radius;
    var width = canvas.width();
    var height = canvas.height();

    if (
      this.x < -margin ||
      this.x > width + margin ||
      this.y < -margin ||
      this.y > height + margin
    ) {
      // 			this.x = width/2;
      this.y = height;
      // New color
      var grey = Math.floor(Math.random() * 255).toString(16);
      this.fillStyle = "#" + grey + grey + grey;
      this.shadowColor = this.fillStyle;
    }
  },

  split: function () {
    // Calculate split chance
    var splitChance = 0;
    // Trunk
    if (this.generation == 0)
      splitChance = (this.distance - this.canvasHeight / 5) / 100;
    // Branch
    else if (this.generation < 3)
      splitChance = (this.distance - this.canvasHeight / 10) / 100;

    // Split if we are allowed
    if (Math.random() < splitChance) {
      var n = 2 + Math.round(Math.random() * 2);
      for (var i = 0; i < n; i++) {
        var snake = new Snake(this.canvas);
        snake.x = this.x;
        snake.y = this.y;
        snake.angle = this.angle;
        snake.speed = this.speed;
        snake.radius = this.radius * 0.9;
        snake.generation = this.generation + 1;
        snake.fillStyle = this.fillStyle;
        snake.shadowColor = this.shadowColor;
        snake.shadowBlur = this.shadowBlur;
        snake.totalDistance = this.totalDistance;
        this.collection.add(snake);
      }
      this.collection.remove(this);
    }
  },

  die: function () {
    if (this.radius < 0.2) {
      this.collection.remove(this);
      // 			console.log(this.distance);
    }
  },
};

SnakeCollection = function () {
  this.canvas = canvas;

  this.snakes = [];
};

SnakeCollection.prototype = {
  next: function (canvas) {
    n = this.snakes.length;
    for (var s in this.snakes) {
      var snake = this.snakes[s];
      if (this.snakes[s]) this.snakes[s].next(canvas);
    }
  },

  add: function (snake) {
    this.snakes.push(snake);
    snake.collection = this;
  },

  remove: function (snake) {
    for (var s in this.snakes)
      if (this.snakes[s] === snake) this.snakes.splice(s, 1);
  },
};

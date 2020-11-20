class Tree {
  constructor(trunks, width, height, color, shadowColor) {
    this.trunks = trunks;
    this.width = width;
    this.height = height;
    this.color = color;
    this.shadowColor = shadowColor;
    this.snakes = [];
  }

  draw(canvas, finished) {
    this.finished = finished;
    var frame = 0;

    var n = this.trunks;
    var initialRadius = this.width / 50;

    let snakes = new SnakeCollection();

    for (var i = 0; i < n; i++) {
      const context = canvas.getContext("2d");

      var snake = new Snake(
        context,
        this.width,
        this.height,
        this.color,
        this.shadowColor
      );
      snake.x = this.width / 2 - initialRadius + (i * initialRadius * 2) / n;
      snake.radius = initialRadius;
      snakes.add(snake);
      this.snakes.push(snake);
    }

    const that = this;

    const intervalHandle = setInterval(function () {
      if (frame < 300) {
        snakes.next(this.canvas);
        frame++;
        console.log(frame);
      } else {
        console.log("finished");
        that.finished();
        clearInterval(intervalHandle);
      }
    }, 1);
  }
}

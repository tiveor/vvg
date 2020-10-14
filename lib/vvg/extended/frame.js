class Frame {
  constructor(
    width,
    height,
    borderUp,
    borderRight,
    borderDown,
    borderLeft,
    color,
    colorBorder,
    author
  ) {
    this.width = width;
    this.height = height;
    this.borderUp = borderUp;
    this.borderRight = borderRight;
    this.borderDown = borderDown;
    this.borderLeft = borderLeft;
    this.color = color;
    this.colorBorder = colorBorder;
    this.author = author;
  }

  draw(ctx) {
    ctx.fillStyle = this.colorBorder;
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.rect(
      this.borderLeft,
      this.borderRight,
      this.width - this.borderLeft - this.borderRight,
      this.height - this.borderUp - this.borderDown
    );
    ctx.fill();
    this.drawAuthor(ctx);
    ctx.clip();
  }

  drawAuthor(ctx) {
    if (!this.author) {
      return;
    }

    ctx.direction = "rtl";

    const label = new Label(
      this.width - this.borderRight,
      this.height - this.borderDown / 2,
      this.author,
      "14px Helvetica",
      "#555555"
    );
    label.draw(ctx);
  }
}

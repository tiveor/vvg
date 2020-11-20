class Label {
  constructor(x, y, text, font, color) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.font = font;
    this.color = color;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.font = this.font;
    ctx.fillText(this.text, this.x, this.y);
  }

  //TODO: drawn a text inside a rectangle resizing it to the width and height
  //https://stackoverflow.com/questions/1134586/how-can-you-find-the-height-of-text-on-an-html-canvas
}

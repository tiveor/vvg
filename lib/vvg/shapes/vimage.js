class VImage {
  constructor(x, y, width, height, src) {
    this.x = x;
    this.y = y;
    this.src = src;
    this.width = width;
    this.height = height;
  }

  draw(ctx) {
    var img = new Image();
    img.src = this.src;
    const that = this;
    img.onload = function () {
      
      ctx.drawImage(img, that.x, that.y, that.width, that.height);
    };
  }
}

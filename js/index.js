var container = document.getElementById("container");
var canvas = document.getElementById("painting");
canvas.width = 1024;
canvas.height = 768;
//canvas.width = container.clientWidth;
//canvas.height = container.clientHeight;

const context = canvas.getContext("2d");
let painter = new vvg(context, canvas, canvas.width, canvas.height);
const example = Randomizer.randomInt(1, 5);
switch (example) {
  case 1:
    painter.example1();
    break;
  case 2:
    painter.example2();
    break;
  case 3:
    painter.example3();
    break;
  case 4:
    painter.example4();
    break;
  default:
    painter.example3();
}

var container = document.getElementById("container");
var canvas = document.getElementById("painting");
canvas.width = 1024;
canvas.height = 768;
//canvas.width = container.clientWidth;
//canvas.height = container.clientHeight;

let painter = new vvg(canvas);
const example = Randomizer.randomInt(1, 5);
switch (example) {
  case 1:
    painter.bibiyiIsGud();
    break;
  case 2:
    painter.bolivianParty();
    break;
  case 3:
    painter.jacaranda();
    break;
  case 4:
    painter.aviary();
    break;
  default:
    painter.aviary();
}

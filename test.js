const vvg = require("./index.js");

const { createCanvas } = require("canvas");
const canvas = createCanvas(1024, 768);
const x = new vvg(canvas);

/*
//EXAMPLE1
x.example1();
x.saveToFile("temp/example1.png");
*/

/*
//EXAMPLE2
x.example2();
setTimeout(() => {
  x.saveToFile("temp/example2.png");
}, 5000);
*/

/*
//EXAMPLE3
x.example3(() => {
  setTimeout(() => {
    x.saveToFile("temp/example3.png");
  }, 5000);
});
*/

//EXAMPLE4
x.example4();
setTimeout(() => {
  x.saveToFile("temp/example4.png");
}, 5000);

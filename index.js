/**
 * @author Vladimir Taytor <cetncat@gmail.com>
 */

const fs = require('fs');
const sharp = require('sharp');

const size1 = 27;
const side1 = '16:9';
const resolution1 = '1920x1080';

const size2 = 13.3;
const side2 = '16:10';
const resolution2 = '2560x1600';

const index = 450; // idk what is it

function geInfo(size, side, resolution) {
  const sides = side.split(':');
  const res = resolution.split('x');
  const a = +sides[0];
  const b = +sides[1];
  var x = Math.sqrt(size*size/(a*a + b*b));
  const A = +(a*x).toFixed(2);
  return [A, +(b*x).toFixed(2), +(res[0]/A), +res[0], +res[1]]
}

const screen1 = geInfo(size1, side1, resolution1);
const screen2 = geInfo(size2, side2, resolution2);

const image = sharp(fs.readFileSync('./input.jpg'));

const leftOffset = Math.round(((Math.abs(screen1[0] - screen2[0])) / 2) * screen2[2]);

console.log(`Image should be min ${screen2[3] + leftOffset}x${screen2[4]+screen1[4]}`);

image
  .metadata()
  .then(function(metadata) {
    const halfOfImage = Math.round(metadata.width / 2) - Math.round(screen1[3] / 2); // is good for already resized images
    return image
      .extract({ left: Math.round(index / 2), top: 0, width: Math.round(metadata.width - index / 2) , height: Math.round(metadata.height / 2) - 50})
      .resize(screen1[3], screen1[4])
      .crop(sharp.strategy.center)
      .toFile('output.jpg');
  });

const image2 = sharp(fs.readFileSync('./input.jpg'));
image2
  .metadata()
  .then(function(metadata) {
    return image2
      .extract({ left: index, top: Math.round(metadata.height / 2), width: metadata.width - index, height: Math.round(metadata.height / 2) - index })
      .resize(screen2[3], screen2[4])
      .crop(sharp.strategy.center)
      .toFile('output2.jpg');
  });
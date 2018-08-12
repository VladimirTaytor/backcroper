/**
 * @author Vladimir Taytor <cetncat@gmail.com>
 */

const fs = require('fs');
const sharp = require('sharp');

const config = {}; // Ha-ha

const fileName = config.name || 'input';
const fileExtension = '.jpg';

const size1 = 27;
const side1 = '16:9';
const resolution1 = '1920x1080';

const size2 = 13.3;
const side2 = '16:10';
const resolution2 = '2560x1600';

const index = 450;               // idk what is it
const anotherIndex = 1.5;        // and this too,
                                 // perhaps depend on how far is yor second display,
                                 // and src image aspect ratio

const sizeOfTopScreenFrame = 40; // this black thing where is your web-cam on MacBook

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

const leftOffset = Math.round(((Math.abs(screen1[0] - screen2[0])) / 2) * screen2[2]);

console.log(`Image should be min ${screen2[3] + leftOffset}x${screen2[4]+screen1[4]}`);

fs.readFile(`./${fileName}${fileExtension}`, (err, stream) => {
  const src = sharp(stream);
  const image1 = src.clone();
  const image2 = src.clone();

  image1.metadata()
    .then(function(metadata) {
      return image1
        .extract({ left: Math.round(index / anotherIndex), top: 0, width: Math.round(metadata.width - index / anotherIndex) , height: Math.round(metadata.height / 2) - sizeOfTopScreenFrame})
        .resize(screen1[3], screen1[4])
        .crop(sharp.strategy.center)
        .toFile(`output1-${Date.now()}.jpg`);
    });

  image2.metadata()
    .then(function(metadata) {
      return image2
        .extract({ left: index, top: Math.round(metadata.height / 2), width: metadata.width - index, height: Math.round(metadata.height / 2) - index })
        .resize(screen2[3], screen2[4])
        .crop(sharp.strategy.center)
        .toFile(`output2-${Date.now()}.jpg`);
    });
});
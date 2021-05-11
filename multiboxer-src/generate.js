var asciify = require('asciify-image');
const testFolder = './frames/';
const fs = require('fs');
var array = [];
var options = {
	fit:    'box',
	width:  33,
	height: 15,
	color: false
  }

fs.readdirSync(testFolder).forEach(file => {
    asciify('frames/' + file, options, function (err, asciified) {
  if (err) throw err;
        array.push(btoa(asciified));
  });
});
var stream = fs.createWriteStream("thickaffile.txt");
stream.once('open', function(fd) {
  stream.write(JSON.stringify(array));
  stream.end();
});

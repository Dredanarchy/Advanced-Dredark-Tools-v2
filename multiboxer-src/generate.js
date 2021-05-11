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
function btoa(e){
    let buff = new Buffer(e);
    let base64data = buff.toString('base64');
    return base64data;  
}
fs.readdirSync(testFolder).forEach(file => {
    asciify('frames/' + file, options, function (err, asciified) {
  if (err) throw err;
        array.push(btoa(asciified));
        fs.writeFileSync("thickaffile.txt", JSON.stringify(array));
  });
});


var fs = require('fs');

function load() {
    var filename = __dirname + '/../assets/iaps.json';
    var content = fs.readFileSync(filename, { encoding: 'utf8' });

    return JSON.parse(content);
}

exports.load = load;

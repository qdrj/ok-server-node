var crypto = require('crypto');
var APP_SECRET_KEY = '######################';

function check(query) {
    var signature = calculateSignature(query);
    var isSignatureCorrect = (signature === query['sig']);

    return isSignatureCorrect;
}

function calculateSignature(query) {
    var keys = concatKeys(query);
    var hash = crypto.createHash('md5').update(keys).digest('hex');
    var signature = hash.toLocaleLowerCase();

    return signature;
}

function concatKeys(query) {
    var keys = Object.keys(query).sort();
    var result = keys.reduce(function(concat, key) {
        return (key === 'sig')
            ? concat
            : concat + key;
    });

    result += APP_SECRET_KEY;

    return result;
}

exports.check = check;


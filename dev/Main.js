var https = require('https');
var url = require('url');
var fs = require('fs');
var xmlFactory = require('./XMLFactory');
var errorCodes = require('./ErrorCodes');
var signature = require('./Signature');
var iapsLoader = require('./IapsLoader');
var wsServer = require('./WSServer');

var iapsConfig = iapsLoader.load();
var options = getServerOptions();
var server = https.createServer(options);
server.addListener('request', onServerRequest);
server.listen(8888);

var socketServer = new wsServer.WSServer(server);

function getServerOptions() {
	return {
		cert: fs.readFileSync('/etc/ssl/certs/robokit/ssl-bundle.crt'),
		key: fs.readFileSync('/etc/ssl/private/robokit.key')
	};
}

function onServerRequest(request, response) {
	var requestUrl = request.url;
	if (requestUrl.indexOf('payment/') > -1) {
		var parsedUrl = url.parse(requestUrl, true);
		var query = parsedUrl.query;
		createResponse(query, response);
	}
}

function createResponse(query, response) {
	if (query.product_code && query.amount && query.sig) {
		if (signature.check(query)) {
			if (isPriceCorrect(query.product_code, query.amount)) {
				console.log('Purchase successful!', query.product_code, query.amount);

				socketServer.sendPurchaseSuccess(query.uid, query.product_code);
				returnSuccessResponse(response);
			} else {
				console.error('Purchase failed [Invalid product_code or amount]\n', query.product_code, query.amount);

				var error = errorCodes.CALLBACK_INVALID_PAYMENT;
				socketServer.sendPurchaseFail(query.uid, query.product_code, error);
				returnErrorResponse(error, response);
			}
		} else {
			console.error('Purchase failed [Invalid signature]\n', query, query.sig);

			var error = errorCodes.PARAM_SIGNATURE;
			socketServer.sendPurchaseFail(query.uid, query.product_code, error);
			returnErrorResponse(error, response);
		}
	} else {
		console.error('Purchase failed [Invalid query]\n', query);

		var error = errorCodes.CALLBACK_INVALID_PAYMENT;
		socketServer.sendPurchaseFail(query.uid, query.product_code, error);
		returnErrorResponse(error, response);
	}
}

function isPriceCorrect(productCode, price) {
	var priceNum = parseInt(price);

	return iapsConfig.some(function (iapConfig) {
		return (iapConfig.code === productCode && iapConfig.price === priceNum);
	});
}

function returnErrorResponse(error, response) {
	var xml = xmlFactory.createErrorXML(error);
	response.writeHead(200, {
		'Content-Type': 'application/xml',
		'Invocation-error': error.code
	});
	response.write(xml.end({pretty: true}));
	response.end();
}

function returnSuccessResponse(response) {
	var xml = xmlFactory.createSuccessXML();
	response.writeHead(200, {'Content-Type': 'application/xml'});
	response.write(xml.end({pretty: true}));
	response.end();
}

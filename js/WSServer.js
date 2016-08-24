var socketio = require('socket.io');

WSServer = function() {
	this.server = socketio(server);
	this.server.on('connection', this.onConnection);
};

WSServer.prototype = {
	constructor: WSServer,

	onConnection: function(socket) {
		console.log('socket connected', socket.id);

		socket.emit('message', 'Hello #' + socket.id + "!");
	},

	sendPurchaseSuccess: function(uid, product) {
		this.server.emit('purchase-success', uid, product);
	},

	sendPurchaseFail: function (uid, product, errorCode) {
		this.server.emit('purchase-fail', uid, product, errorCode);
	}
};

exports.WSServer = WSServer;

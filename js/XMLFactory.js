var xmlBuilder = require("xmlbuilder");

function createErrorXML(errorCode) {
    var xml = xmlBuilder.create('ns2:error_response', { version: '1.0', encoding: 'UTF-8' });
    xml.att('xmlns:ns2', "http://api.forticom.com/1.0/");
    xml.ele('error_code', null, errorCode.code);
    xml.ele('error_msg', null, errorCode.name + " : " + errorCode.description);

    //console.log(xml.end({ pretty: true }));

    return xml;
}

function createSuccessXML() {
    var xml = xmlBuilder.create('callbacks_payment_response', { version: '1.0', encoding: 'UTF-8' });
    xml.att('xmlns', "http://api.forticom.com/1.0/");
    xml.text("true");

    //console.log(xml.end({ pretty: true }));

    return xml;
}

exports.createErrorXML = createErrorXML;
exports.createSuccessXML = createSuccessXML;

ErrorCode = function(code, name, description) {
    this.code = code;
    this.name = name;
    this.description = description;
};

ErrorCode.prototype.constructor = ErrorCode;

//exports.ErrorCode = ErrorCode;
exports.UNKNOWN = new ErrorCode(1, "UNKNOWN", "Неизвестная ошибка.");
exports.SERVICE = new ErrorCode(2, "SERVICE", "Сервис временно недоступен.");
exports.CALLBACK_INVALID_PAYMENT = new ErrorCode(1001, "CALLBACK_INVALID_PAYMENT", "Платеж неверный и не может быть обработан.");
exports.SYSTEM = new ErrorCode(9999, "SYSTEM", "Критический системный сбой, который невозможно устранить.");
exports.PARAM_SIGNATURE = new ErrorCode(104, "PARAM_SIGNATURE", "Неверная подпись.");

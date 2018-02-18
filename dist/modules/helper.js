'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let base64_encode = function (file) {
    // read binary data
    let bitmap = _fs2.default.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
};

module.exports = base64_encode;
//# sourceMappingURL=helper.js.map
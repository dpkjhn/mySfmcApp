'use strict';

import fs from 'fs';

module.exports.base64_encode = function (file) {
    let bitmap = fs.readFileSync(file);
    return new Buffer(bitmap).toString('base64');
};
//# sourceMappingURL=sfmc-helper.js.map
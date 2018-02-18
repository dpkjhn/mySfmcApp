'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _helmet = require('helmet');

var _helmet2 = _interopRequireDefault(_helmet);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _sfmcapp = require('./modules/sfmcapp');

var _sfmcapp2 = _interopRequireDefault(_sfmcapp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const sfmcEnv = {
    authEndpoint: 'http://auth.exacttargetapis.com',
    clientId: 'a9xvz6zo3wqa9itrirnn2a15',
    clientSecret: 'CpQNDK2QZK1xjPAOlBwSnl8S',
    soapUsername: null,
    soapPassword: null,
    tokenId: null
};

const middlewares = [_bodyParser2.default.urlencoded({ extended: true }), (0, _helmet2.default)()];

const app = (0, _express2.default)();
const sfmcapp = new _sfmcapp2.default(sfmcEnv.clientId, sfmcEnv.clientSecret);

app.set('views', _path2.default.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(middlewares);

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/', (req, res) => {
    res.render('index', {
        data: req.body, // { message, email }
        errors: {
            message: {
                msg: 'A message is required'
            },
            email: {
                msg: 'That email doesn‘t look right'
            }
        }
    });

    console.log(req.body);
});

app.listen(3000, () => {
    console.log('listening');
});

let createDirTeee = (dirPath, currDir = '') => {
    let stats = _fs2.default.lstatSync(dirPath),
        filename = _path2.default.basename(dirPath),
        fileInfo = {
        path: _path2.default.dirname(dirPath), //currDir.concat('/', filename),
        name: filename
    };

    if (stats.isDirectory()) {
        fileInfo.type = 'folder';
        fileInfo.children = _fs2.default.readdirSync(dirPath).map(function (subDir) {
            return createDirTeee(_path2.default.join(dirPath, subDir), filename);
        });
    } else {
        fileInfo.type = _path2.default.extname(filename).substr(1);
    }

    return fileInfo;
};

let processDir = async (dirTree, rootCategory = '', parentId = 0) => {
    dirTree.forEach(file => {
        let categoryName = rootCategory.concat('/', file.name);

        if (file.type === 'folder') {
            sfmcapp.createCBFolder(categoryName, parentId).then(parentId => {
                if (file.children) {
                    console.log('-- processing children');
                    return processDir(file.children, categoryName, parentId);
                    // return processDir(file.children, folderName, 0);
                }
            }).catch(err => {
                console.log('Uhoh! ' + err.error.message);
            });
        } else if (file.type === 'jpg') {
            console.log('inserting image: ' + categoryName);
            sfmcapp.insertCBAsset(_path2.default.join(file.path, file.name), _path2.default.basename(file.name), parentId);
        } else if (file.type === 'html') {
            console.log('inserting content block: ' + categoryName);
        }
    });
};

async function run() {
    const dirPath = '/Users/djohn/Google Drive/dpk-work/learns/javascript/mySfmcApp/testdir';
    await sfmcapp.authenticate('4L8ZIuXftV3dDiCUUwNJND21');

    let a = await sfmcapp.getCBAsset('?$filter=parentId eq 0');

    console.log(JSON.stringify(a, null, 2));

    let cbCategory = 'Content Builder/PwC';
    let dirTree = createDirTeee(dirPath);
}

// run();
//# sourceMappingURL=index.js.map
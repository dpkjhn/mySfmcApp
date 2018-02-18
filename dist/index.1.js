'use strict';

var _recursiveReaddir = require('recursive-readdir');

var _recursiveReaddir2 = _interopRequireDefault(_recursiveReaddir);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

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

const sfmcapp = new _sfmcapp2.default(sfmcEnv.clientId, sfmcEnv.clientSecret);

var deItems = {
    items: [{
        Id: '123',
        FirstName: 'Bobby',
        EmailAddress: 'ctravers2016@gmail.com'
    }, {
        Id: '456',
        FirstName: 'Sam',
        EmailAddress: 'ctravers2016@gmail.com'
    }]
};

let records = [{
    keys: {
        Id: 'aaa'
    },
    values: {
        FirstName: 'Bobby',
        EmailAddress: 'ctravers2016@gmail.com'
    }
}, {
    keys: {
        Id: 'bbb'
    },
    values: {
        FirstName: 'Sam',
        EmailAddress: 'ctravers2016@gmail.com'
    }
}];

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
    // let subFolders = folder => {
    //     return folder.children.filter(item => {
    //         return item.type === 'folder';
    //     });
    // };

    // let filterBy = (items, type) => {
    //     return items.children.filter(item => {
    //         return item.type === type;
    //     });
    // };

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

    // dirTree.children.forEach(file => {
    //     if (file.type === 'folder') {
    //         return processDir(file, `${rootCategory}/${file.name}`, parentId);
    //     } else if (file.type === 'jpg') {
    //         // return;
    //         sfmcapp.insertCBAsset(
    //             path.join(file.path, file.name),
    //             path.basename(file.name),
    //             rootCategory
    //         );
    //     }
    // });
};

async function run() {
    const dirPath = '/Users/djohn/Google Drive/dpk-work/learns/javascript/mySfmcApp/testdir';
    await sfmcapp.authenticate('4L8ZIuXftV3dDiCUUwNJND21');

    let a = await sfmcapp.getCBAsset('?$filter=parentId eq 0');

    console.log(JSON.stringify(a, null, 2));

    let cbCategory = 'Content Builder/PwC';
    let dirTree = createDirTeee(dirPath);

    // console.log(JSON.stringify(dirTree, null, 2));
    // return;

    // let parentId = 397998; // await sfmcapp.createCBFolder(cbCategory);

    // if (!parentId)  return;
    // try {
    //     processDir(dirTree.children, cbCategory, parentId);
    // } catch (err) {
    //     console.log(err);
    // }
}

run();

// const path = `${__dirname}/../img/kitten.jpg`;
// // console.log(path);

// const html =
//     '<div data-marker="wrapper" style="border-top: 1px solid #E4E4E4;border-right: 1px solid #E4E4E4;border-bottom: 1px solid #E4E4E4;border-left: 1px solid #E4E4E4;margin-top: 0px;margin-right: 0px;margin-bottom: 0px;margin-left: 0px;;padding-top: 0px; ;padding-right: 0px;padding-bottom: 0px;padding-left: 0px;" class="stylingblock-content-wrapper"><!-- Start Smart Block --><style type="text/css">\n.amp {font-size:1px;color:#fff;}</style><span class="amp">%%[</span><style type="text/css">\n.code_none{display:none;}</style><div align="center" style="padding:20px; border: 3px dashed white;background-color:#ffffff">\n\t<table border="0" cellpadding="0" cellspacing="0" width="300">\n\t\t\n\t\t\t<tr>\n\t\t\t\t<td height="99" width="99">\n\t\t\t\t\t<img height="99" src="http://image.s4.exct.net/lib/fe9a15747561077e70/m/1/60d5f571-3088-4a4c-81eb-fb611cc41a9b.gif" width="139" /></td><td width="20">\n\t\t\t\t\t&nbsp;</td><td style="font-family:Arial, Helvetica, sans-serif; color:#000000; font-size:16px;">\n\t\t\t\t\t<span style="font-size:24px;">Your venue</span></td></tr></table></div> <span class="amp">]%%</span> <!-- End Smart Block --><div class="code_none">\n\t<!-- Start Code -->Your venue<br>\n\t<img alt="Google Map of EC2N" src="http://maps.googleapis.com/maps/api/staticmap?center=%%Venue Postal Code%%&amp;zoom=16&amp;scale=false&amp;size=600x300&amp;maptype=roadmap&amp;format=jpg&amp;visual_refresh=true&amp;markers=size:mid%7Ccolor:0xff0000%7Clabel:1%7C%%Venue Postal Code%%" width="600"></div></div>';

// let response = await sfmcapp.insertCBContentBlock(
//     'location block',
//     630043,
//     html
// );

// console.log(response);
// sfmcapp.createCBFolder('1. Images', '630043');
// sfmcapp.createCBFolder('2. Content Blocks', '630043');
// sfmcapp.createCBFolder('3. Email Templates', '630043');
// sfmcapp.createCBFolder('4. Emails', '630043');

// let details = await sfmcapp.getCBAsset(630043);
// console.log(details);
//# sourceMappingURL=index.1.js.map
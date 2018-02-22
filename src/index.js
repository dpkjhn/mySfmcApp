'use strict';

import fs from 'fs';
import path from 'path';
import express from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import 'babel-polyfill';
import sfmcEnv from './credentials';
import SfmcApp from './modules/sfmcapp';

// const sfmcEnv = sfmcCredentials.sfmcEnv;

const middlewares = [
    bodyParser.urlencoded({
        extended: true
    }),
    helmet()
];

const app = express();
const sfmcapp = new SfmcApp(sfmcEnv.clientId, sfmcEnv.clientSecret);

app.set('views', path.join(__dirname, 'views'));
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
    console.log(`I'm alive!!!`);

    console.log('listening');
});

let createDirTeee = (dirPath, currDir = '') => {
    let stats = fs.lstatSync(dirPath),
        filename = path.basename(dirPath),
        fileInfo = {
            path: path.dirname(dirPath), //currDir.concat('/', filename),
            name: filename
        };

    if (stats.isDirectory()) {
        fileInfo.type = 'folder';
        fileInfo.children = fs.readdirSync(dirPath).map(function(subDir) {
            return createDirTeee(path.join(dirPath, subDir), filename);
        });
    } else {
        fileInfo.type = path.extname(filename).substr(1);
    }

    return fileInfo;
};

let processDir = async(dirTree, rootCategory = '', parentId = 0) => {
    dirTree.forEach(file => {
        let categoryName = rootCategory.concat('/', file.name);

        if (file.type === 'folder') {
            sfmcapp
                .createCBFolder(categoryName, parentId)
                .then(parentId => {
                    if (file.children) {
                        console.log('-- processing children');
                        return processDir(file.children, categoryName, parentId);
                        // return processDir(file.children, folderName, 0);
                    }
                })
                .catch(err => {
                    console.log('Uhoh! ' + err.error.message);
                });
        } else if (file.type === 'jpg') {
            console.log('inserting image: ' + categoryName);
            sfmcapp.insertCBAsset(
                path.join(file.path, file.name),
                path.basename(file.name),
                parentId
            );
        } else if (file.type === 'html') {
            console.log('inserting content block: ' + categoryName);
        }
    });
};

async function run() {
    const dirPath =
        '/Users/djohn/Google Drive/dpk-work/learns/javascript/mySfmcApp/testdir';
    await sfmcapp.authenticate('4L8ZIuXftV3dDiCUUwNJND21');

    let a = await sfmcapp.getCBAsset('?$filter=parentId eq 0');

    console.log(JSON.stringify(a, null, 2));

    let cbCategory = 'Content Builder/PwC';
    let dirTree = createDirTeee(dirPath);
}

// run();
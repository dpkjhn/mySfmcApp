/*eslint quotes: ["error", "single", { "allowTemplateLiterals": true }]*/

'use strict';

// var bodyParser = require('body-parser');
// var request = require('request');
// var rp = require('request-promise');
// const cb = require('./sfmc-content-builder');

// // var Promise = require('promise');

import bodyParser from 'body-parser';
import rp from 'request-promise';
import h from './sfmc-helper.js';
import cb from './sfmc-content-builder';

// import requestType from './sfmc-requests';

// module.exports.SfmcApp;
/**
 * Wrapper for Marketing Cloud API
 *
 * @export
 * @class SfmcApp
 */
export default class SfmcApp {
    constructor(id, secret) {
        this.clientId = id;
        this.clientSecret = secret;
        this.tokenId = null;
        this.tokenExpiry = 0;
        this.authEndpoint = 'https://auth.exacttargetapis.com';
        this.hostRestEndpoint = 'https://www.exacttargetapis.com';
        this.version = '0.0.1';
        this.catTree = null;

        this.requestType = {
            // General requests
            Auth: {
                endPoint: this.authEndpoint + '/v1/requestToken',
                method: 'POST',
                body: {
                    clientId: this.clientId,
                    clientSecret: this.clientSecret
                }
            },
            Context: {
                endPoint: this.hostRestEndpoint + '/platform/v1/tokenContext',
                method: 'GET'
            },
            // Journey Builder requests
            JourneyBuilder: {
                endPoint: this.hostRestEndpoint,
                method: 'POST'
            },

            // DE requests
            GetSchema: {
                endPoint: this.hostRestEndpoint + '/contacts/v1/schema',
                method: 'GET'
            },
            InsertDataByKey: {
                endPoint: this.hostRestEndpoint + '/hub/v1/dataevents/key:{id}/rowset',
                method: 'POST'
            },
            InsertDERecords: {
                endPoint: this.hostRestEndpoint + '/data/v1/async/dataextensions/{id}:key/rows',
                method: 'POST'
            },

            //Mobile Connect Requests
            SendSms: {
                endPoint: this.hostRestEndpoint + '/sms/v1/messageContact/{id}/send',
                method: 'POST'
            },
            QueueSms: {
                endPoint: this.hostRestEndpoint + '/sms/v1/queueMO',
                method: 'POST'
            },

            // Content Builder requests
            CreateCBFolder: {
                endPoint: this.hostRestEndpoint + '/asset/v1/content/categories',
                method: 'POST'
            },
            InsertCBAsset: {
                endPoint: this.hostRestEndpoint + '/asset/v1/content/assets',
                method: 'POST'
            },
            InsertImage: {
                endPoint: this.hostRestEndpoint + '/asset/v1/content/assets',
                method: 'POST'
            },
            GetCBAsset: {
                endPoint: this.hostRestEndpoint + '/asset/v1/content/categories/{id}',
                method: 'GET'
            },
            UpdateCBAsset: {
                endPoint: this.hostRestEndpoint + '/asset/v1/content/categories',
                method: 'POST'
            }
        };
    }

    get isAutheticated() {
        //TODO
        // this.checkContext();
        // this.tokenId = '';

        return this.tokenId;
    }

    authenticate(tokenId = '') {
        console.log(`Auth request for ${this.clientId}`);
        this.tokenId = tokenId;

        if (this.isAutheticated) {
            return new Promise((resolve, reject) => {
                resolve(this.tokenId);
            });
        }

        return this.submitRequest('Auth')
            .then(r => {
                this.tokenId = r.accessToken;
                this.tokenExpiry = r.expiresIn;
                console.log(`Received token: ${this.tokenId}`);
                // console.log('Authorization Success');

                return this.tokenId;
            })
            .catch(e => {
                this.tokenId = null;
                console.log('ERROR: ' + e);
                return this.tokenId;
            });
    }

    submitRequest(requestType, options) {
        // console.log(options.id);

        let uri = this.requestType[requestType].endPoint;
        let body = this.requestType[requestType].body;

        if (options) {
            uri = this.requestType[requestType].endPoint.replace(`{id}`, options.id); // some requests need a key, id etc.
            body = options.body;
        }

        let payLoad = {
            method: this.requestType[requestType].method,
            uri: uri,
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${this.tokenId}`
            },
            body: body,
            json: true
        };

        // console.log(JSON.stringify(payLoad));

        // console.log(`Request (${requestType}): ${payLoad.method} ${payLoad.uri}`);
        console.log(`${payLoad.method} ${payLoad.uri}`);

        return rp(payLoad);
        // return response;
    }

    checkContext() {
        this.submitRequest('Context')
            .then(r => {
                console.log(`MID: ${r.enterprise.id}`);
                return true;
            })
            .catch(e => {
                console.log(`${e}`);
                return false;
            });
    }

    getSchema() {
        return this.submitRequest('GetSchema')
            .then(r => {
                console.log(r);

                return r;
            })
            .catch(e => {
                console.log(`${e}`);
                return false;
            });
    }

    insertRecordsByKey(deKey, items) {
        const options = {
            id: `${deKey}`,
            body: items
        };
        console.log(`Insert request for ${items.length} record(s) into ${deKey}`);

        // console.log('Items: ' + JSON.stringify(options.body));

        return this.submitRequest('InsertDataByKey', options)
            .then(r => {
                console.log(`${r.length} record(s) inserted.`);

                // console.log(r);
            })
            .catch(e => {
                console.log(`${e}`);
                return false;
            });
    }

    insertRecords(deKey, items) {
        const options = {
            id: `${deKey}`,
            body: items
        };
        console.log(`Insert request for ${items.length} record(s) into ${deKey}`);

        console.log(JSON.stringify(options.body));

        return this.submitRequest('InsertDERecords', options)
            .then(r => {
                console.log(`${r.length} record(s) inserted.`);

                // console.log(r);
            })
            .catch(e => {
                console.log(`${e}`);
                return false;
            });
    }

    // Mobile Connect

    sendSms(message, mobileNumbers, keyword) {
        const options = {
            id: 'Njg6Nzg6MA',
            body: {
                mobileNumbers: mobileNumbers,
                Subscribe: true,
                Resubscribe: true,
                keyword: keyword, // needed because we are subscribing/resubscribing
                Override: true,
                messageText: message
            }
        };

        return this.submitRequest('SendSms', options)
            .then(r => {
                console.log(`SMS(s) sent.`);
                return r.tokenId;

                // console.log(r);
            })
            .catch(e => {
                console.log(`${e}`);
                return false;
            });
    }

    // Content Builder
    createCBFolder(folderPath, parentId = 0) {
        if (!this.catTree) this.catTree = cb.getAllCategories();

        let parentFolder = folderPath.slice(0, folderPath.lastIndexOf('/')),
            folderName = folderPath.slice(folderPath.lastIndexOf('/') + 1);

        // cb.findTopCategoryId(catTree);
        console.log('create folder: ' + folderPath);

        parentId = parentId || cb.findCategory(this.catTree, parentFolder); // default to top level

        const options = {
            body: {
                Name: folderName,
                ParentId: parentId
            }
        };
        // cb.buildCategoryTree();

        return this.submitRequest('CreateCBFolder', options)
            .then(r => {
                console.log(`Folder created: ${r.id}`);
                return r.id;
            })
            .catch(e => {
                console.log(`${e}`);
                throw e;
                // return false;
            });
    }

    getAllCBCategories() {
        let catTree = '';

        const options = {
            body: {
                assetType: {
                    id: 20,
                    name: 'png',
                    displayName: 'Image'
                },
                Name: name,
                Description: name,
                Category: {
                    id: parentId
                },
                file: img
            }
        };
        return catTree;
    }

    getCBAsset(id) {
        const options = {
            id: id,
            body: {}
        };

        return this.submitRequest('GetCBAsset', options)
            .then(r => {
                return r;
            })
            .catch(e => {
                console.log(`${e}`);
                return false;
            });
    }

    insertCBAsset(file, name, parentId) {
        // if (!this.catTree) this.catTree = cb.getAllCategories();

        // let id = cb.findCategory(this.catTree, folder).id;

        let img = h.base64_encode(file);

        const options = {
            body: {
                assetType: {
                    id: 20,
                    name: 'png',
                    displayName: 'Image'
                },
                Name: name,
                Description: name,
                Category: {
                    id: parentId
                },
                file: img
            }
        };

        // console.log(JSON.stringify(options, null, 2));
        // console.log('insert: ' + folder + ' ' + id);

        // return;

        return this.submitRequest('InsertCBAsset', options)
            .then(r => {
                return r;
            })
            .catch(e => {
                console.log(`${e}`);
                throw e;

                // return false;
            });
    }

    insertCBContentBlock(name, folder, blockHtml) {
        const options = {
            body: {
                assetType: {
                    id: 195,
                    name: 'freeformblock',
                    displayName: 'Free Form Block'
                },
                Name: name,
                Description: name,
                Category: {
                    id: folder
                },
                content: blockHtml
            }
        };

        // console.log(options);

        return this.submitRequest('InsertCBAsset', options)
            .then(r => {
                return r;
            })
            .catch(e => {
                console.log(`${e}`);
                throw e;

                // return false;
            });
    }
}
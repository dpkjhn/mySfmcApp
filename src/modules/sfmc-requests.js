'use strict';

const authEndpoint = 'https://auth.exacttargetapis.com';
const hostRestEndpoint = 'https://www.exacttargetapis.com';

const endPoints = {
    Address: `${hostRestEndpoint}/address/v1`,
    Approvals: `${hostRestEndpoint}/hub/v1`,
    Asset: `${hostRestEndpoint}/asset/v1`,
    Auth: `${authEndpoint}/v1`,
    Campaigns: `${hostRestEndpoint}/hub/v1`,
    Contacts: `${hostRestEndpoint}/contacts/v1`,
    Data: `${hostRestEndpoint}/data/v1`,
    Dataevents: `${hostRestEndpoint}/hub/v1`,
    Interaction: `${hostRestEndpoint}/interaction/v1`,
    Messaging: `${hostRestEndpoint}/messaging/v1`,
    Platform: `${hostRestEndpoint}/platform/v1`,
    Push: `${hostRestEndpoint}/push/v1`,
    Sms: `${hostRestEndpoint}/sms/v1`,
    Objects: `${hostRestEndpoint}/hub/v1`,
    Workflowteams: `${hostRestEndpoint}/hub/v1`
};

module.exports.requestType = {
    Auth: {
        // General requests
        requestToken: {
            endPoint: endPoints.Auth,
            method: 'POST',
            body: {
                clientId: this.clientId,
                clientSecret: this.clientSecret
            }
        }
    },
    Data: {
        getRequestStatus: {
            endPoint: `${endPoints.Data}/async{id}/status`,
            method: 'GET'
        },
        getRequestResults: {
            endPoint: `${endPoints.Data}/async{id}/results`,
            method: 'GET'
        },
        postRequestStatus: {
            endPoint: `${endPoints.Data}/async{id}/status`,
            method: 'GET'
        }
    },
    platform: {
        Context: {
            endPoint: this.hostRestEndpoint + '/platform/v1/tokenContext',
            method: 'GET'
        }
    },
    jb: {
        // Journey Builder requests
        JourneyBuilder: {
            endPoint: this.hostRestEndpoint,
            method: 'POST'
        }
    },

    // DE requests
    dataevents: {
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
            method: 'PUT'
        }
    },

    //Mobile Connect Requests
    mobile: {
        SendSms: {
            endPoint: this.hostRestEndpoint + '/sms/v1/messageContact/{id}/send',
            method: 'POST'
        },
        QueueSms: {
            endPoint: this.hostRestEndpoint + '/sms/v1/queueMO',
            method: 'POST'
        }
    },

    // Content Builder requests
    contentbuilder: {
        CreateFolder: {
            endPoint: this.hostRestEndpoint + '/asset/v1/content/categories',
            method: 'POST'
        },
        InsertAsset: {
            endPoint: this.hostRestEndpoint + '/asset/v1/content/categories',
            method: 'POST'
        },
        GetAsset: {
            endPoint: this.hostRestEndpoint + '/asset/v1/content/assets/{id}/file',
            method: 'GET'
        },
        UpdateAsset: {
            endPoint: this.hostRestEndpoint + '/asset/v1/content/categories',
            method: 'POST'
        }
    }
};
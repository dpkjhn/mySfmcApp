getEndPoints() {
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
            method: 'PUT'
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
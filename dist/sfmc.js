'use strict';

exports = module.exports = createSfmcApp;

function createSfmcApp() {
  var mcInst;

  // Marketing Cloud environment
  var sfmcEnv = {
    authEndpoint: 'http://auth.exacttargetapis.com',
    clientId: 'a9xvz6zo3wqa9itrirnn2a15',
    clientSecret: 'CpQNDK2QZK1xjPAOlBwSnl8S',
    soapUsername: null,
    soapPassword: null,
    tokenId: null
  };

  function createInstance() {
    if (checkContext()) {
      console.log('Autenticated');
    } else {
      console.log('Not authenticated');
    }

    return mcInst;
  }

  function checkContext() {
    return true;
  }
};
//# sourceMappingURL=sfmc.js.map
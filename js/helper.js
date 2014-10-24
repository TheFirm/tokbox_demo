TBAPP.helpers = {};

TBAPP.helpers.genToken = function () {
    //day in sec
    var duration = 86400;

// Token Params
    var timeNow = Math.floor(Date.now() / 1000);
    var expire = timeNow + duration;
    var role = "publisher";
    var data = "bob";

    TB.setLogLevel(TB.DEBUG);

// Calculation
    data = escape(data);
    var rand = Math.floor(Math.random() * 999999);
    var dataString = "session_id=" + TBAPP.sessionId + "&create_time=" + timeNow + "&expire_time=" + expire + "&role=" + role + "&connection_data=" + data + "&nonce=" + rand;

    // Encryption
    var hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA1, TBAPP.apiKeysessionId);
    hmac.update(dataString);
    var hash = hmac.finalize();

    var preCoded = "partner_id=" + TBAPP.apiKey + "&sig=" + hash + ":" + dataString;
    var token = "T1==" + $.base64.encode(preCoded);
    return token;
};


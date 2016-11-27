
var DOMAIN = "http://127.0.0.1:8000/";

function getFormData($form){
    var unindexed_array = $form.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function(n, i){
        indexed_array[n['name']] = n['value'];
    });

    return indexed_array;
}

var isAuthenticated = function(callback) {
    console.log("checking session");
    chrome.storage.sync.get("session", function(result) {
        console.log(result);
        if (result) {
            if (result.session && result.session.isAuthenticated) {
                callback.success();
                return;
            }
        }
        callback.error();
    });
};

var isTrelloConnected = function(callback) {
    chrome.storage.sync.get("trelloToken", function(result) {
        console.log("Result");
        console.log(result);
        if (result.hasOwnProperty("trelloToken") && (typeof result.trelloToken  === "string")) {
            Trello.setToken(result.trelloToken);
            Trello.setKey("a1fd9786edda102a6a667f2a9b8552eb");
            callback.success(result);
            return;
        }
        callback.error(result);
    });
};

var getCardDetails = function(callback) {
    chrome.storage.sync.get('card', function(data) {
        if (data.card) {
            // There was a card waiting
            callback.success(data.card);
        } else {
            callback.error(data);
        }
    });
};

var getToken = function(callback) {
    chrome.storage.sync.get("session", function(result) {
        console.log("Result");
        console.log(result);
        if (result.hasOwnProperty("session")) {
            callback.success(result.session.token);
            return;
        }
        callback.error(result);
    });
};

var redirect = function(url) {
    window.location.href = url;
};

var logOut = function() {
    chrome.storage.sync.remove('session');
    redirect("../index/index.html");
};


var restoreIcon = function() {
    chrome.browserAction.setIcon({path: "../favicon-96x96.png"});
};

var request = function(api, data, beforeSend, success, error, requestType, authenticate) {

    // what to do when the ajax request returns
    requestType = (!requestType) ? 'POST' : requestType;
    var noFunction = function(){};
    beforeSend = (!beforeSend) ? noFunction : beforeSend;
    success = (!success) ? noFunction : success;
    error = (!error) ? noFunction : error;

    var ajaxRequest = function(api, data, beforeSend, success, error, requestType, token) {
        if (api[api.length - 1] !== "/") {
            api = api.concat("/");
        }
        var request = {
            type: requestType,
            contentType: "application/json; charset=utf-8",
            url: DOMAIN + api,
            data: JSON.stringify(data),
            beforeSend: beforeSend,
            success: success,
            error: error
        };
        if (token) {
            request.headers = {
                Authentication: "JWT " + token
            }
        }
        console.log("Request: ");
        console.log(request);
        $.ajax(request);
    };

    if (authenticate) {
        // what to do after getting the token
        var callback = {
            success: function(token) {
                ajaxRequest(api, data, beforeSend, success, error, requestType, token);
            },
            error: function(result) {
                console.log("");
                redirect("../index/index.html");
            }
        };

        getToken(callback);
    } else {
        ajaxRequest(api, data, beforeSend, success, error, requestType, authenticate);
    }
};

// Model

function Session(token) {
    this.token = token;
    this.isAuthenticated = true;
}

// On load

$(function() {
    $(".logout-button").click(logOut);
});
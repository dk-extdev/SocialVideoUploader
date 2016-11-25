var authenticationSuccess = function(data) {
    console.log("Successful authentication");
    console.log(data);
};

var authenticationFailure = function(data) {
    console.log("Failed authentication");
    console.log(data);
};

$("#trello-connect").click(function() {
    $("#trello-explanation").slideToggle();
});

$("#trello-authenticate").click(function() {
    Trello.setKey("a1fd9786edda102a6a667f2a9b8552eb");
    //Trello.authorize({
    //    type: "popup",
    //    name: "Taskcrusher for Trello",
    //    scope: {
    //        read: true,
    //        write: true
    //    },
    //    expiration: "never",
    //    success: authenticationSuccess,
    //    error: authenticationFailure,
    //    response_type: "token"
    //});

    window.open("https://trello.com/1/authorize?key=a1fd9786edda102a6a667f2a9b8552eb&name=Taskcrusher&expiration=never&response_type=token")
});

var checkCardWaiting = function() {
    chrome.storage.sync.get('card', function(data) {
        if (data.card) {
            // There was a card waiting
            redirect("../post/post.html");
        }
    });

};

$("#trello-auth-form").submit(function(event) {
    event.preventDefault();
    var data = getFormData($(event.currentTarget));
    var success = function(data) {
        $.notify("Trello key saved.", "success");
        $("#trello-explanation").slideToggle();
        var token = getFormData($(event.currentTarget)).trelloToken;
        Trello.setToken(token);
        chrome.storage.sync.set({
            trelloToken: token
        });
        checkCardWaiting();
    };
    var error = function(data) {
        // failed request; give feedback to user
        $.notify("We couldn't contact the server. Please try again...", "error");
    };

    request("save-token", data, null, success, error, 'POST', true);
});
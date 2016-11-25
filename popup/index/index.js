

var loginForm = $("#login-form");
var logout = $(".logout-button");


$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

$(function() {

    $('#login-form-link').click(function(e) {
        $("#login-form").delay(100).fadeIn(100);
        $("#register-form").fadeOut(100);
        $('#register-form-link').removeClass('active');
        $(this).addClass('active');
        e.preventDefault();
    });
    $('#register-form-link').click(function(e) {
        $("#register-form").delay(100).fadeIn(100);
        $("#login-form").fadeOut(100);
        $('#login-form-link').removeClass('active');
        $(this).addClass('active');
        e.preventDefault();
    });

});

//var authorizeTrello = function(event) {
//    var promise = Trello.authorize({
//        type: "popup",
//        name: "Taskcrusher for Chrome",
//        interactive: false,
//        return_url: DOMAIN + "/users/",
//        scope: {
//            read: true,
//            write: true },
//        expiration: "never",
//        callback_method: "postMessage",
//        success: authenticationSuccess,
//        error: authenticationFailure
//    });
//    console.log("Promise:");
//    console.log(promise);
//};



//var dummyLogin = function(event) {
//    $.ajax({
//        type: 'GET',
//        url: 'http://trello.com/',
//        data: { postVar1: 'theValue1', postVar2: 'theValue2' },
//        beforeSend:function(){
//            // this is where we append a loading image
//            $.notify("Logging in...", "info");
//        },
//        success:function(data){
//            // successful request; do something with the data
//            $.cookie('session',
//                {
//                    user: "user",
//                    password: "password",
//                    isAuthenticated: true
//                }
//            );
//            $.notify("Login successful", "success");
//            loginForm.hide();
//            window.location.href = "../list/list.html";
//
//        },
//        error:function(data){
//            // failed request; give feedback to user
//            $.notify("Login failed. Please try again...", "error");
//        }
//    });
//};

var login = function(event) {
    var data = $(event.currentTarget).serializeObject();
    var beforeSend = function() {
        // this is where we append a loading image
        $.notify("Logging in...", "info");
    };
    var success = function(data) {
        // successful request; do something with the data
        var session = new Session(data.token);
        chrome.storage.sync.set({
            "session": session
        });

        $.notify("Login successful", "success");
        loginForm.hide();
        redirect("../list/list.html");

    };
    var error = function(data) {
        // failed request; give feedback to user
        $.notify("Login failed. Please try again...", "error");
    };

    request("api-token-auth", data, beforeSend, success, error);
    event.preventDefault();
};


var register = function(event) {
    var data = $(event.currentTarget).serializeObject();
    data.email = data.username;

    $.ajax({
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        url: DOMAIN + 'registration/',
        data: JSON.stringify(data),
        beforeSend:function(){
            // this is where we append a loading image
            $.notify("Registering in...", "info");
        },
        success:function(data){
            // successful request; do something with the data
            $.notify("Registration successful. Please check your email to activate your account.", "success");

        },
        error:function(data){
            // failed request; give feedback to user
            $.notify("Registration failed. Please try again...", "error");
        }
    });
    event.preventDefault();
};


var checkCardWaiting = function() {
    var card = chrome.storage.sync.get('card', function(result) {
        if (result.card) {
            // There was a card waiting
            restoreIcon();
            redirect("../post/post.html");
        }
    });
};

$(function() {
    callback = {
        success: function(data) {
            // save token

            // get user's data

            loginForm.hide();
            logout.show();
            checkCardWaiting();
        },
        error: function(data) {
            console.log("login error");
            loginForm.show();
            logout.hide();
        }
    };
    console.log("is authenticated call");
    isAuthenticated(callback);

});

$("#login-form").submit(login);
$("#register-form").submit(register);

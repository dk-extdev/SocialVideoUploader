var fullFormWithCardData = function(card) {
    console.log(card);
};

// check if user has trello authentication activated
// if not, redirect to authentication
var callback = {
    success: function(data) {
        // if it has, check if we have that information on a cookie or get task's information through the API
        console.log("Getting task details...");
        var callback = {
            success: function(card) {
                console.log(card);
                Trello.cards.get(card.id, function(card) {
                    fullFormWithCardData(card);
                });
            },
            error: function(error) {
                console.log(error);
            }
        };
        getCardDetails(callback);
    },
    error: function(data) {
        console.log("Redirecting to authentication");
        redirect("../authentication/authentication.html")
    }
};
isTrelloConnected(callback);

// load the information on the post form

// onSubmit: save form information. Check if user has upwork authentication, if not, redirect to authentication.
// if it has, post to upwork. through the API
// redirect to list
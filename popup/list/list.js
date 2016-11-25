var checkCardWaiting = function() {
    chrome.storage.sync.get('card', function(data) {
        if (data) {
            // There was a card waiting
            restoreIcon();
            redirect("../post/post.html");
        }
    });

};

document.addEventListener('DOMContentLoaded', function() {
    checkCardWaiting();
});

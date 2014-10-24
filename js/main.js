
function initChat (){
// Initialize session, set up event sessionId, and connect
    TBAPP.session = OT.initSession(TBAPP.key.key, TBAPP.key.sessionId);

    TBAPP.session.on("streamCreated", function(event) {
        toastr.info("Stream created");
        console.log("streamCreated");
        var subscriberProperties = {insertMode: "append"};

        var subscriber = TBAPP.session.subscribe(event.stream, 'connected', subscriberProperties, function (error) {
            TBAPP.helpers.logIfError(error);
            if (!error) {
                toastr.info("Someone want to chat with you ...");
            }
        });
        TBAPP.subscribers.push(subscriber);
    });

    TBAPP.session.on("streamDestroyed", function (event) {
        toastr.info("Someone left chat ...");
        console.log("Stream stopped streaming. Reason: " + event.reason)
    });

    TBAPP.session.connect(TBAPP.key.token, function(error) {
        TBAPP.helpers.logIfError(error);
        TBAPP.publisher = OT.initPublisher('publisher', {}, null);
        TBAPP.session.publish(TBAPP.publisher, {}, null);
    });

    TBAPP.session.on("signal", function(event) {
        if(event.data && event.data.fromUsername){
            var $discussion = $('#chatWrapper .discussion');
            var appendElem = '';
            if(event.data.fromUsername == TBAPP.user.username){
                appendElem = '<li class="self">\n    <div class="messages"><span class="user">' + 'me' + '</span>\n        <p>' + event.data.text + '</p>\n    </div>\n</li>';
            } else {
                appendElem = '<li class="other">\n    <div class="messages"><span class="user">' + event.data.fromUsername + '</span>\n        <p>' + event.data.text + '</p>\n    </div>\n</li>';
            }
            $discussion.append($(appendElem));
        }
        console.log("Signal sent from connection " , event);
        // Process the event.data property, if there is any data.
    });

    TBAPP.sendMessage = function (text) {
        TBAPP.session.signal(
            {
                data: {
                    fromUsername: TBAPP.user.username,
                    text: text
                },
                type:"textMessage"
            },
            function(error) {
                if (error) {
                    console.log("signal error" + error);
                } else {
                    console.log("signal sent.");
                }
            }
        );
    }
}

function requestUserInfo(){
    TBAPP.user.username = prompt('Your name: ', new Date().getTime()+"");
}

requestUserInfo();
initChat();

$('#sendText').click(function (evt) {
    var msg = $('#chatInput').val();
    TBAPP.sendMessage(msg);
});


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

            var template = '';
            var username = '';

            if(event.data.fromUsername == TBAPP.user.username){
                template = $('#template_message_self').html();
                username = 'me';
            } else {
                template = $('#template_message_other').html();
                username = event.data.fromUsername;
            }

            Mustache.parse(template);
            var rendered = Mustache.render(template, {
                text: event.data.text,
                username: username
            });
            $discussion.append(rendered);
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


$('#myModal').modal();


$('#send_btn').click(function (evt) {
    var $name_input = $('#name_input');
    if($name_input.val().length > 0){
        TBAPP.user.username = $name_input.val();
    }
});

$('#name_input').keypress(function (evt) {
    var $target = $(evt.target);

    if ((evt.keyCode == 13 || evt.keyCode == 10) && $target.val().length > 0) {
        TBAPP.user.username = $target.val();
        $('#myModal').modal("hide");
    }
});

$('#sendText').click(function (evt) {
    var $chatInput = $('#chatInput');
    if($chatInput.val().length > 0){
        var msg = $chatInput.val();
        TBAPP.sendMessage(msg);
        $chatInput.val("");
    }
});

$('#chatInput').keypress(function (evt) {
    var $target = $(evt.target);
    if ((evt.keyCode == 13 || evt.keyCode == 10) && $target.val().length > 0) {
        var msg = $target.val();
        TBAPP.sendMessage(msg);
        $target.val("");
        return false;
    }
});

initChat();
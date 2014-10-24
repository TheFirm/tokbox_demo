
function initChat (){
    console.log('TBAPP.apiKey', TBAPP.apiKey);
    console.log('TBAPP.sessionId', TBAPP.apiKeysessionId);
// Initialize session, set up event sessionId, and connect
    var session = OT.initSession(TBAPP.apiKey, TBAPP.apiKeysessionId);

    session.on("streamCreated", function(event) {
        toastr.info("Stream created");
        console.log("streamCreated");
        var subscriberProperties = {insertMode: "append"};

        var subscriber = session.subscribe(event.stream, 'connected', subscriberProperties, function (error) {
            if (error) {
                toastr.info("Sorry, something went wrong ... ( " + error + " )");
                console.log(error);
            } else {
                toastr.info("Someone want to chat with you ...");
                console.log("Subscriber added.");
            }
        });
    });

    session.on("streamDestroyed", function (event) {
        toastr.info("Someone left chat ...");
        console.log("Stream stopped streaming. Reason: " + event.reason)
    });

    var publisher;
    var token = TBAPP.token;

    session.connect(token, function(error) {
        publisher = OT.initPublisher('publisher');
        session.publish(publisher);

        //publisher.on("streamDestroyed", function (event) {
        //
        //    console.log("Stream stopped streaming. Reason: " + event.reason)
        //});
    });

    session.on("signal", function(event) {
        console.log("Signal sent from connection " , event);
        // Process the event.data property, if there is any data.
    });

    window.testM = function () {
        session.signal(
            {
                data:"hello",
                type:"textMessage"
            },
            function(error) {
                if (error) {
                    console.log("signal error ("
                    + error.code
                    + "): " + error.reason);
                } else {
                    console.log("signal sent.");
                }
            }
        );
    }
}

initChat();


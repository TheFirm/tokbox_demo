toastr.options.timeOut = 10000;


// Initialize API key, session, and token...
// Think of a session as a room, and a token as the key to get in to the room
// Sessions and tokens are generated on your server and passed down to the client
var apiKey = "45041112";
var sessionId = "1_MX40NTA0MTExMn5-MTQxMzk5NjU2MjQxOX50YStaV2llajRjRmhlNmdtdU9zbDN0R2Z-fg";
var token = "T1==cGFydG5lcl9pZD00NTA0MTExMiZzaWc9Mzg0OWNmNTIzYzA3ZTFiMWM5YzlmOWI5NDVlZWQyOTRiYTk1ZmE4OTpyb2xlPXB1Ymxpc2hlciZzZXNzaW9uX2lkPTFfTVg0ME5UQTBNVEV4TW41LU1UUXhNems1TmpVMk1qUXhPWDUwWVN0YVYybGxhalJqUm1obE5tZHRkVTl6YkROMFIyWi1mZyZjcmVhdGVfdGltZT0xNDEzOTk2NTg2Jm5vbmNlPTAuNTA4NTY4MTU3MjkxNjg0MQ==";

// Initialize session, set up event listeners, and connect
var session = OT.initSession(apiKey, sessionId);

session.on("streamCreated", function(event) {
    toastr.info("Stream created");
    console.log("streamCreated");
    var subscriberProperties = {insertMode: "append"};

    var subscriber = session.subscribe(event.stream, 'container', subscriberProperties, function (error) {
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

session.connect(token, function(error) {
    publisher = OT.initPublisher();
    session.publish(publisher);

    //publisher.on("streamDestroyed", function (event) {
    //
    //    console.log("Stream stopped streaming. Reason: " + event.reason)
    //});
});

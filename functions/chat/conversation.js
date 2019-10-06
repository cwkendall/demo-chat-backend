exports.handler = function(context, event, callback) {
  const client = context.getTwilioClient();
  const response = new Twilio.Response();

  response.appendHeader("Access-Control-Allow-Origin", "*");
  response.appendHeader("Access-Control-Allow-Methods", "GET");
  response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
  response.appendHeader("Content-Type", "application/json");

  if (event.Channel) {
    // get single conversation by sid
    client.conversations
      .conversations(event.Channel)
      .fetch()
      .then(conversation => {
        response.setBody(conversation);
        callback(null, response);
      })
      .catch(e => {
        response.setBody({ error: "Unable to fetch conversation", reason: e });
        response.setStatusCode(e.status ? e.status : 500);
        callback(null, response);
      });
  } else {
    // get all conversations
    client.conversations.conversations
      .list()
      .then(conversations => {
        response.setBody(conversations);
        callback(null, response);
      })
      .catch(e => {
        response.setBody({ error: "Unable to fetch conversations", reason: e }
        );
        response.setStatusCode(e.status ? e.status : 500);
        callback(null, response);
      });
  }
};

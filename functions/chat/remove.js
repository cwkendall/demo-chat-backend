exports.handler = function(context, event, callback) {
  const client = context.getTwilioClient();
  const response = new Twilio.Response();

  response.appendHeader("Access-Control-Allow-Origin", "*");
  response.appendHeader("Access-Control-Allow-Methods", "GET, POST");
  response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
  response.appendHeader("Content-Type", "application/json");

  if (event.Participant && event.Channel) {
    // remove a participant from an existing conversation
    client.conversations
      .conversations(event.Channel)
      .participants(event.Participant)
      .remove()
      .then(result => {
        response.setBody(result);
        callback(null, response);
      })
      .catch(e => {
        response.setBody({ error: "Unable to remove participant", reason: e });
        response.setStatusCode(e.status ? e.status : 500);
        callback(null, response);
      });
  } else if (event.Channel) {
    // remove an existing conversation
    client.conversations
      .conversations(event.Channel)
      .remove()
      .then(result => {
        response.setBody(result);
        callback(null, response);
      })
      .catch(e => {
        response.setBody({ error: "Unable to remove conversation", reason: e });
        response.setStatusCode(e.status ? e.status : 500);
        callback(null, response);
      });
  } else {
    response.setBody({ error: "Conversation SID is required" });
    response.setStatusCode(400);
    callback(null, response);
  }
};

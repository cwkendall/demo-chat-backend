
exports.handler = function(context, event, callback) {
  const client = context.getTwilioClient();
  const response = new Twilio.Response();

  response.appendHeader("Access-Control-Allow-Origin", "*");
  response.appendHeader("Access-Control-Allow-Methods", "GET");
  response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
  response.appendHeader("Content-Type", "application/json");

  if (event.Participant) {
    // get single participant by sid
    client.conversations
      .conversations(event.Channel)
      .participants(event.Participant)
      .fetch()
      .then(participant => {
        response.setBody(participant);
        callback(null, response);
      }).catch(e =>
        callback(e)
      );
  } else {
    // get all participants by conversation
    client.conversations
      .conversations(event.Channel)
      .participants.list()
      .then(participants => {
        response.setBody(participants);
        callback(null, response);
      })
      .catch(e => callback(e));
  }
};

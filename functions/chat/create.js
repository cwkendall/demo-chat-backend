exports.handler = async function(context, event, callback) {
  const client = context.getTwilioClient();
  const response = new Twilio.Response();

  response.appendHeader("Access-Control-Allow-Origin", "*");
  response.appendHeader("Access-Control-Allow-Methods", "GET, POST");
  response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
  response.appendHeader("Content-Type", "application/json");

  function getProxyAddresses(addr) {
    console.log("Address", addr);
    if (!addr) {
      return null;
    } else if (addr.startsWith("whatsapp")) {
      return context.WHATSAPP_SENDERS.split(",");
    } else if (addr.startsWith("+")) {
      return context.SMS_SENDERS.split(",");
    }
  }

  if (event.Channel && (event.Identity || event.Address)) {
    // add a participant to an existing conversation
    if (event.Identity) {
      console.log("Identity", event.Identity);
      client.conversations
        .conversations(event.Channel)
        .participants.create({
          identity: event.Identity
        })
        .then(conversation => {
          response.setBody(conversation);
          callback(null, response);
        })
        .catch(e => {
          response.setBody({
            error: `Unable to add participant (${event.Identity})`,
            reason: e
          });
          response.setStatusCode(e.status ? e.status : 500);
          callback(null, response);
        });
    } else if (event.Address) {
      const addresses = getProxyAddresses(event.Address);
      let error = null;
      for (let proxyAddress of addresses) {
        try {
          const body = await client.conversations
            .conversations(event.Channel)
            .participants.create({
              "messagingBinding.address": event.Address,
              "messagingBinding.proxyAddress": proxyAddress
            });
          response.setBody(body);
          callback(null, response);
          return;
        } catch (err) {
          error = err;
          console.error(err);
        }
      }
      response.setBody({
        error: `Unable to add participant (${event.Address}), no available proxy numbers`,
        reason: error
      });
      response.setStatusCode(error ? error.status : 500);
      callback(null, response);
    }
  } else if (event.Channel && event.Message) {
    // post a message
    client.conversations
      .conversations(event.Channel)
      .fetch()
      .then(conversation => {
        client.conversations
          .conversations(event.Channel)
          .messages.create({
            ...(event.MessageAuthor && {
              author: event.MessageAuthor
            }),
            body: event.Message
          })
          .then(msg => {
            response.setBody(msg);
            callback(null, response);
          })
          .catch(e => {
            response.setBody({
              error: "Unable to post message conversation",
              reason: e
            });
            response.setStatusCode(e.status ? e.status : 500);
            callback(null, response);
          });
      })
      .catch(e => {
        response.setBody({
          error: "Unable to fetch conversation",
          reason: e
        });
        response.setStatusCode(e.status ? e.status : 500);
        callback(null, response);
      });
  } else if (event.Channel) {
    // update a conversation
    client.conversations
      .conversations(event.Channel)
      .fetch()
      .then(conversation => {
        client.conversations
          .conversations(event.Channel)
          .update({
            ...(event.ChannelName && { friendlyName: event.ChannelName }),
            ...(event.ChannelAttributes && {
              attributes: event.ChannelAttributes
            })
          })
          .then(updated => {
            response.setBody(updated);
            callback(null, response);
          })
          .catch(e => {
            response.setBody({
              error: "Unable to update conversation",
              reason: e
            });
            response.setStatusCode(e.status ? e.status : 500);
            callback(null, response);
          });
      })
      .catch(e => {
        response.setBody({ error: "Unable to fetch conversation", reason: e });
        response.setStatusCode(e.status ? e.status : 500);
        callback(null, response);
      });
  } else {
    // create a new conversation
    client.conversations.conversations
      .create({
        ...(event.MessagingService && {
          messagingServiceSid: event.MessagingService
        }),
        ...(event.ChannelName && { friendlyName: event.ChannelName }),
        ...(event.ChannelAttributes && { attributes: event.ChannelAttributes })
      })
      .then(conversations => {
        response.setBody(conversations);
        callback(null, response);
      })
      .catch(e => {
        response.setBody({
          error: "Unknown error creating new conversation",
          reason: e
        });
        response.setStatusCode(e.status ? e.status : 500);
        callback(null, response);
      });
  }
};

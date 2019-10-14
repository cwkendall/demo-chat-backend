# The Demo Chat Application - Using Twilio Conversations

This is a lightweight application based on [Twilio Chat](https://www.twilio.com/docs/chat) and [Twilio Conversations](https://www.twilio.com/docs/conversations).

## Getting started

This demo requires a Twilio account and a working Chat Service SID. By default these are provisioned automatically by the Conversations API (Default Conversations Service).

You'll need to collect some credentials from the [Twilio Console](https://www.twilio.com/console):

* Your Account SID (`ACXXX`) and Auth Token, both accessible from the [Dashboard](https://twilio.com/console/dashboard)
* Your Account's Chat Service Sid `ISXXX` SID which is attached to your Chat Service

All senders to be used with the app, MUST be added as Senders to the Conversations Messaging Service!

If you wish to include self-service or a bot prior to the conversation, modify Inbound Settings on the Conversations Messaging Service, `When a new message arrives on a number assigned to this Service: SEND AN INCOMING_MESSAGE WEBHOOK`. Associate the webhook with either AutoPilot Assistant or Studio Flow and setup a Function to move one or more participants into a New Conversation. Once added into a conversation all messages are routed by Conversations API into the Chat service.

## Deploying the backend chat application (on Twilio)

* Clone [demo-chat-backend](https://github.com/cwkendall/demo-chat-backend)
* copy `.env.example` to `.env` and set the following environment variables from your Twilio account:

```bash
# Twilio account master credentials
ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxx
AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxx
# API key for your Twilio Account
API_KEY=SKxxxxxxxxxxxxxxxxxxxxx
# API secret for your API Key
API_SECRET=xxxxxxxxxxxxxxxxxxxxx
# SID of your Twilio Chat Service (https://www.twilio.com/docs/api/chat/rest/services)
CHAT_SERVICE_SID=ISxxxxxxxxxxxxxxxxx
# Comma seperated list of Twilio SMS capable phone numbers to use as proxies
SMS_SENDERS=<number>,<number>,<number>
# Comma seperated list of Twilio WhatsApp senders to use as proxies
WHATSAPP_SENDERS=whatsapp:<number>,whatsapp:<number>
```

* Using the [twilio-cli](https://www.twilio.com/docs/twilio-cli/quickstart) and [twilio serverless plugin](https://github.com/twilio-labs/plugin-serverless) (Recommended) deploy to [Twilio Runtime](https://www.twilio.com/docs/runtime)
* Run the CLI command to deploy to Twilio runtime `twilio serverless:deploy`

## Running the frontend application

* Clone [demo-chat-app](https://github.com/cwkendall/demo-chat-app) and run locally or deploy to [Zeit Now](https://zeit.co/now)

In either case:

* copy `.env.example` to `.env` and set the following environment variables from your Twilio account:

```bash
# set serverless-domain to your Twilio Runtime domain as reported by the API
REACT_APP_CHAT_BACKEND=https://<serverless-domain>.twil.io/
```

where `<serverless-domain>` is the runtime domain created during the deployment of the backend

To run locally (or install on your own cloud service):
`npm install`
`npm run start`

To deploy to Zeit, edit `now.json` with you chat backend URL and run:
`npm install -g now-cli` (first time installation)
`now`

## Interacting with the Application

The application will be accessible on `http://localhost:3000` or on `https://demo-chat-app.<your-zeit-domain>.now.sh`

It will start at a login screen. Any login ID can be used and no password is required. The login ID will be used as the Chat ID.

When starting a conversation your own Chat ID will be added automatically to the conversation, do not remove it otherwise it will not show in the list.

'use strict'

require('dotenv').config({silent: true});

var middleware = require('botkit-middleware-watson')({
  iam_apikey: process.env.IAM_APIKEY,
  url: process.env.URL,
  workspace_id: process.env.WORKSPACE_ID,
  version: '2018-07-10',
});

var TwilioSMSBot = require('botkit-sms');
var controller = TwilioSMSBot({
  account_sid: process.env.ACCOUNT_SID,
  auth_token: process.env.AUTH_TOKEN,
  twilio_number: process.env.TWILIO_NUMBER
});

let bot = controller.spawn({})

controller.setupWebserver('8000', function (err, webserver) {
  if (err) console.log(err)
  controller.createWebhookEndpoints(controller.webserver, bot, function () {
    console.log('Bot is online!');
  })
});

controller.hears(['.*'], 'message_received', function (bot, message) {
  middleware.interpret(bot, message, function(err) {
      bot.reply(message, message.watsonData.output.text[0]);
    })
});
const { IncomingWebhook } = require('@slack/webhook');
const url = process.env.SLACK_WEBHOOK_URL;

const webhook = new IncomingWebhook(url);

// subscribeSlack is the main function called by Cloud Functions.
module.exports.billingAlert = (pubSubEvent, context) => {  
  const build = eventToBuild(pubSubEvent.data);

  // Skip if the cost isn't more than the budget
  console.log("START BUILD...");
  console.log(build);
  console.log("END BUILD");
//   if (status.indexOf(build.status) === -1) {
//     return;
//   }

  // Send message to Slack.
  const message = createSlackMessage(build);
  (async () => {
    try {
        let result = await webhook.send(message);
        if (result.text != 'ok') {
            console.error(result);
        }
    } catch (e) {
        console.error(e);
    }
  })();
};

// eventToBuild transforms pubsub event message to a build object.
const eventToBuild = (data) => {
  return JSON.parse(Buffer.from(data, 'base64').toString());
}

// createSlackMessage creates a message from a build object.
const createSlackMessage = (build) => {
  console.log(JSON.stringify(build));
  const message = {
    text: `Billing Alert: \`$${build.costAmount} spent.\``,
    mrkdwn: true,
  };

  return message;
}
const { IncomingWebhook } = require('@slack/webhook');
const url = process.env.SLACK_WEBHOOK_URL;

const webhook = new IncomingWebhook(url);

// subscribeSlack is the main function called by Cloud Functions.
module.exports.billingAlert = (pubSubEvent, context) => {
  console.log(pubSubEvent);
  console.log(context);
  
  const build = eventToBuild(pubSubEvent.data);

  // Skip if the current status is not in the status list.
  // Add additional statuses to list if you'd like:
  // QUEUED, WORKING, SUCCESS, FAILURE,
  // INTERNAL_ERROR, TIMEOUT, CANCELLED
  const status = ['SUCCESS', 'FAILURE', 'INTERNAL_ERROR', 'TIMEOUT'];
  if (status.indexOf(build.status) === -1) {
    return;
  }

  // Send message to Slack.
  const message = createSlackMessage(build);
  (async () => {
    try {
        let result = await webhook.send(message);
        console.log(result);
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
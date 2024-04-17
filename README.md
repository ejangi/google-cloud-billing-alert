# Google Cloud Function Slack Billing Alert

This Google Cloud Function is based on the [example](https://cloud.google.com/billing/docs/how-to/budgets#manage-notifications) and sends a notification to a Slack channel using incoming webhooks.

## Deploy

To deploy, run:

```
gcloud functions deploy billingAlert --gen2 --trigger-topic monthly-budget --runtime nodejs20 --set-env-vars "SLACK_WEBHOOK_URL=https://hooks.slack.com/…"
```
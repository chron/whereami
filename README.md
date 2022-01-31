# where-am-i?

An art project / useless novelty: using the Slack API, we can get all the messages posted to the `#where-am-i` channel in the last 6 weeks.  For each week we'll find one message per person — the most recent one if there are multiples — that has exactly 5 emoji in it.

Then we show it all in a grid! Why? _Why not?_

If you want to build it yourself locally, just clone the repo and run `yarn dev`.

You'll need the following environment variables set in a `.env` file:

* `SLACK_TOKEN` — your Slack API token.
* `SLACK_CHANNEL_ID` — The ID of the channel to read from.

Your Slack user will need the following scopes:

* `users:list` — To get real names for display
* `emoji:list` — To get custom emoji images we can use (all regular emoji are converted to unicode via `emoji-js`)
* `channels:history` — To get the messages

# where-am-i?

"Production" site is at: https://sp-whereami.netlify.app

An art project / useless novelty: using the Slack API, we can get all the messages posted to the `#where-am-i` channel in the last 6 weeks.  For each week we'll find one message per person — the most recent one if there are multiples — that has exactly 5 emoji in it.

Then we show it all in a grid! Why? _Why not?_

(There's also now a [#wordle version](https://sp-whereami.netlify.app/wordle/) of this.)

If you want to build it yourself locally, just clone the repo and run `yarn dev`.

You'll need the following environment variables set in a `.env` file:

* `SLACK_TOKEN` — your Slack API token.

Your Slack user will need the following scopes:

* `users:list` — To get real names for display
* `emoji:list` — To get custom emoji images we can use (all regular emoji are converted to unicode via `emoji-js`)
* `channels:history` — To get the messages

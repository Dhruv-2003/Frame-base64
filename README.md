## Idea

User will enter a contest which is gonna be this base64 game , based on their usage , they will earn a few points for all the activities , we can also mint them an NFT for these actions , this could also be verifiable on chain
Then they can take part in these contest.
Using base64 , people could predict the results of the game , and in the end we release the tournament results on farcaster.
We could also make it custom , meaning competitors could participate on the basis of a Task, and they could enter via these frames , again , people could predict who would won , and in the end we release the winner making everyone happy. This will also derive DAU for the users.
Read Contract data using the Graph + Airstack to read the user data
This being a game , we could also use OpenFort directly , which provides normal users with a wallet and do gasses tx directly , could be useful or not

## Basic Flow

- Platform will organise small tournaments / contest , it could be based on anything , like a dad Joke Contest
- the competition form will be posted as a frame , competitors enter with their own entry.
- Once the submissions are closed , participants can start to predict these results
- This predication can only take place from the frontend ,but a frame could be posted for with all the participants , which direct the participants to a portal to participate
- We could optionally add a betting option here , allowing user to earn
- Once the tournament is closed for betting, the tournament advances , meaning the results will be drawn b/w the competitors
- Results as leaderboard can be posted as casts from the bot automatically.
- Participants would be rewarded for the scores they have

## Optional

- For qDAU , the algo recommended could be ok
- In our case we could award points on the basis of their profile , and then it could be used a min entry barrier.
- We could add the same points method here too

### Sponsors

**Base** - the chain where the contracts will be deployed
**Frames.js** - library with helper functions to build frames
**Graph** - Indexes the data of the contracts and is then directly read for the frames
**Airstack** - maybe some data related to the user about farcaster to assign this
**OpenFort** - Specifically for gaming contract interactions , could be tried out
**Stack** - to track the points , it is always better to make it on chain

## Flow 1

-> Create a Contest

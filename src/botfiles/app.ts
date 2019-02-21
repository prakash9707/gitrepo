import { AzureUsageBot } from "./bot";

const restify = require('restify');

const { BotFrameworkAdapter, UserState, MemoryStorage, ConversationState } = require('botbuilder');

export const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, () => {
    console.log(`${server.name} listening on ${server.url}` );
});

  const adapter = new BotFrameworkAdapter({
    appId : process.env.MICROSOFT_APP_ID,        // will be used when deploys on azure cloud....
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

adapter.onTurnError = async (context, error) => {
    // This check writes out errors to console log .vs. app insights.
    console.error(`\n [onTurnError]: ${ error }`);
    // Send a message to the user
    await context.sendActivity(`Oops. Something went wrong!`);
    // Clear out state
    await conversationState.delete(context);
};


let userState;
let conversationState = new ConversationState(new MemoryStorage());
// For local development, in-memory storage is used.
// CAUTION: The Memory Storage used here is for local bot debugging only. When the bot
// is restarted, anything stored in memory will be gone.
const memoryStorage = new MemoryStorage();
userState = new UserState(memoryStorage);
const echo = new AzureUsageBot();

server.post("/api/messages",(req,res) => {
    adapter.processActivity(req, res, async (context) => {
       await echo.onTurn(context);
   }); 
});




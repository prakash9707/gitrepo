"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const bot_1 = require("./bot");
const restify = require('restify');
const { BotFrameworkAdapter, UserState, MemoryStorage, ConversationState } = require('botbuilder');
exports.server = restify.createServer();
exports.server.listen(process.env.port || process.env.PORT || 3978, () => {
    console.log(`${exports.server.name} listening on ${exports.server.url}`);
});
const adapter = new BotFrameworkAdapter({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
adapter.onTurnError = (context, error) => __awaiter(this, void 0, void 0, function* () {
    console.error(`\n [onTurnError]: ${error}`);
    yield context.sendActivity(`Oops. Something went wrong!`);
    yield conversationState.delete(context);
});
let userState;
let conversationState = new ConversationState(new MemoryStorage());
const memoryStorage = new MemoryStorage();
userState = new UserState(memoryStorage);
const echo = new bot_1.AzureUsageBot();
exports.server.post("/api/messages", (req, res) => {
    adapter.processActivity(req, res, (context) => __awaiter(this, void 0, void 0, function* () {
        yield echo.onTurn(context);
    }));
});

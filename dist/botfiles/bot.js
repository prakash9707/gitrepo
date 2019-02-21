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
const botbuilder_1 = require("botbuilder");
const request = require("request");
const querystring = require("querystring");
const filter_1 = require("../API/filter");
const callapi_1 = require("../API/callapi");
const card_1 = require("./card");
const GREETING = 'Greeting';
const RESOURCE_GROUP_COST = 'ResourceGroup';
const RESOURCE_TYPE_COST = 'ResourceType';
class AzureUsageBot {
    getLuisIntent(utterance) {
        var endpoint = "https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/";
        var luisAppId = "4b20740f-bb42-4aeb-8df4-f924fe15bb13";
        var endpointKey = "5135e69257854736bc99a84a430d8576";
        var queryParams = {
            "verbose": true,
            "q": utterance,
            "subscription-key": endpointKey
        };
        var luisRequest = endpoint + luisAppId +
            '?' + querystring.stringify(queryParams);
        return new Promise(function (resolve, reject) {
            try {
                request(luisRequest, function (err, response, body) {
                    if (response.statusCode != 200)
                        reject();
                    if (err) {
                        reject(err);
                    }
                    else {
                        var data = JSON.parse(body);
                        resolve(data);
                    }
                });
            }
            catch (err) {
                console.log(err + "happend while hitting luis");
            }
        });
    }
    createHeroCard(azureData) {
        return botbuilder_1.CardFactory.heroCard(azureData);
    }
    sortingValues(params) {
        let sortedOrder = Object.keys(params).sort(function (a, b) { return params[b] - params[a]; });
        return sortedOrder;
    }
    onTurn(context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (context.activity.type === botbuilder_1.ActivityTypes.Message) {
                console.log(context.activity.text);
                let filteredData;
                let result;
                let messageToUser = '';
                let getLuisData = yield this.getLuisIntent(context.activity.text);
                console.log('hitting luis');
                let intent = 'none';
                if (getLuisData['topScoringIntent']['score'] > 0.7)
                    intent = getLuisData['topScoringIntent']['intent'];
                console.log(intent);
                switch (intent) {
                    case GREETING:
                        yield context.sendActivity('Hello');
                        break;
                    case 'Cost':
                        console.log(intent);
                        filteredData = filter_1.convertData(getLuisData);
                        console.log(filteredData);
                        result = yield callapi_1.callAPI(filteredData);
                        console.log(result);
                        for (let idx = 0; idx < filteredData.filter.length; idx++) {
                            if ((result.keys).indexOf(filteredData.filter[idx].value) == -1)
                                messageToUser += `You did not use '${filteredData.filter[idx].value}' for '${filteredData.DateRange}'` + "\n";
                        }
                        if (result.keys.length != 0) {
                            let body = card_1.cardData(result, RESOURCE_GROUP_COST);
                            yield context.sendActivity({
                                text: 'Your Usage Details',
                                attachments: [botbuilder_1.CardFactory.adaptiveCard({
                                        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                                        "version": "1.0",
                                        "type": "AdaptiveCard",
                                        "speak": "Showing usage details",
                                        "body": body,
                                    })]
                            });
                        }
                        if (messageToUser != '')
                            yield context.sendActivity({ attachments: [this.createHeroCard(messageToUser)] });
                        if (result.keys.length == 0)
                            yield context.sendActivity({ attachments: [this.createHeroCard('No Resource used')] });
                        break;
                    case RESOURCE_TYPE_COST:
                        break;
                    case 'Trend':
                        filteredData = filter_1.convertData(getLuisData);
                        console.log(filteredData);
                    default:
                        yield context.sendActivity('Sorry, I am not able to understand');
                        break;
                }
            }
            else if (context.activity.type === botbuilder_1.ActivityTypes.ConversationUpdate &&
                context.activity.recipient.id !== context.activity.membersAdded[0].id) {
                yield context.sendActivity('Welcome to the Azure Usage Bot! Ask me a question and I will try to answer it.');
            }
        });
    }
}
exports.AzureUsageBot = AzureUsageBot;

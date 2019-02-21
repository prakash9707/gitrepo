import { TurnContext, ActivityTypes, CardFactory } from "botbuilder";
import * as request from "request";
import * as querystring from "querystring";
import { convertData } from "../API/filter";
import { callAPI } from "../API/callapi";
import { cardData } from "./card";

const GREETING = 'Greeting';
const RESOURCE_GROUP_COST = 'ResourceGroup';
const RESOURCE_TYPE_COST = 'ResourceType';
const Cost = 'Cost';
const Trend = 'Trend';

export class AzureUsageBot {
   
    getLuisIntent(utterance) {
        var endpoint =
            "https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/";
        var luisAppId = "4b20740f-bb42-4aeb-8df4-f924fe15bb13";
        var endpointKey = "5135e69257854736bc99a84a430d8576";
        var queryParams = {
            "verbose": true,
            "q": utterance,
            "subscription-key": endpointKey
        }
        var luisRequest =
            endpoint + luisAppId +
            '?' + querystring.stringify(queryParams);
        return new Promise(function (resolve, reject) {
            try {
                request(luisRequest, function (err,
                    response, body) {
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





    createHeroCard(azureData: any) {
        return CardFactory.heroCard(
            azureData,
        );
    }
    sortingValues(params) {
        let sortedOrder = Object.keys(params).sort(function (a, b) { return params[b] - params[a] });
        return sortedOrder;
    }

    async onTurn(context: TurnContext) {
        if (context.activity.type === ActivityTypes.Message) {
            
            let filteredData: any;
            let result: any
            let messageToUser: string = '';
            let getLuisData : any = await this.getLuisIntent(context.activity.text);
            let intent: string = 'none';
            if (getLuisData['topScoringIntent']['score'] > 0.7)
                intent = getLuisData['topScoringIntent']['intent'];
            
            switch (intent) {
                case GREETING:
                    await context.sendActivity('Hello');
                    break;
                case Cost:
                    filteredData = convertData(getLuisData);
                    result = await callAPI(filteredData);
                    for (let idx: number = 0; idx < filteredData.filter.length; idx++) {
                        if ((result.keys).indexOf(filteredData.filter[idx].value) == -1)
                            messageToUser += `You did not use '${filteredData.filter[idx].value}' for '${filteredData.DateRange}'` + "\n";
                    }

                    if (result.keys.length != 0) {
                        let body: JSON = cardData(result, RESOURCE_GROUP_COST);
                        await context.sendActivity({
                            text: 'Your Usage Details',
                            attachments: [CardFactory.adaptiveCard({
                                "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                                "version": "1.0",
                                "type": "AdaptiveCard",
                                "speak": "Showing usage details",
                                "body": body,
                            })]
                        });
                    }
                    if (messageToUser != '')
                        await context.sendActivity({ attachments: [this.createHeroCard(messageToUser)] });
                    if (result.keys.length == 0)
                    await context.sendActivity({ attachments: [this.createHeroCard('No Resource used')] });

                    break;
                
                case Trend:
                    filteredData = convertData(getLuisData);
                    var a = 1000000;
                    console.log(a);
                    a ++;
                    a = 90;
                    console.log(a);
                    
                    
                    break;
                default:
                    await context.sendActivity('Sorry, I am not able to understand');
                    break;
                
            }
        }



        else if (context.activity.type === ActivityTypes.ConversationUpdate &&
            context.activity.recipient.id !== context.activity.membersAdded[0].id) {
            await context.sendActivity('Welcome to the Azure Usage Bot! Ask me a question and I will try to answer it.');

        }

    }

}


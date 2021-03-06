import * as assume from "assume";
import { expect } from 'chai';
import { ParsingAzureData } from "../src/API/parseDataFromAzureApi";

let input = {
    "value": [
        {
            "id": "/subscriptions/98846a4a-670c-426e-beac-362d79862397/providers/Microsoft.Billing/billingPeriods/201903-1/providers/Microsoft.Consumption/usageDetails/6377586f-2dc4-6f8d-35c0-1911c943be4a",
            "name": "6377586f-2dc4-6f8d-35c0-1911c943be4a",
            "type": "Microsoft.Consumption/usageDetails",
            "tags": null,
            "properties": {
                "billingPeriodId": "/subscriptions/98846a4a-670c-426e-beac-362d79862397/providers/Microsoft.Billing/billingPeriods/201903-1",
                "usageStart": "2019-01-23T00:00:00.0000000Z",
                "usageEnd": "2019-01-24T00:00:00.0000000Z",
                "instanceId": "/subscriptions/98846a4a-670c-426e-beac-362d79862397/resourceGroups/customSpeech/providers/Microsoft.CognitiveServices/accounts/Speech-Translator",
                "instanceName": "Speech-Translator",
                "meterId": "3bd267f0-01d5-4348-ba67-70e2473f0c27",
                "usageQuantity": 0.008611111111111111,
                "pretaxCost": 0.5691621527777777704337500023,
                "currency": "INR",
                "isEstimated": false,
                "subscriptionGuid": "98846a4a-670c-426e-beac-362d79862397",
                "meterDetails": null
            }
        },
        {
            "id": "/subscriptions/98846a4a-670c-426e-beac-362d79862397/providers/Microsoft.Billing/billingPeriods/201903-1/providers/Microsoft.Consumption/usageDetails/4a434447-08dc-a6d9-9838-074aed8c82c4",
            "name": "4a434447-08dc-a6d9-9838-074aed8c82c4",
            "type": "Microsoft.Consumption/usageDetails",
            "tags": null,
            "properties": {
                "billingPeriodId": "/subscriptions/98846a4a-670c-426e-beac-362d79862397/providers/Microsoft.Billing/billingPeriods/201903-1",
                "usageStart": "2019-01-23T00:00:00.0000000Z",
                "usageEnd": "2019-01-24T00:00:00.0000000Z",
                "instanceId": "/subscriptions/98846a4a-670c-426e-beac-362d79862397/resourceGroups/customSpeech/providers/Microsoft.CognitiveServices/accounts/Speech-Translator",
                "instanceName": "Speech-Translator",
                "meterId": "c2f8be65-ca45-47f2-9451-807406d20d69",
                "usageQuantity": 0.0375000000000000018,
                "pretaxCost": 6.196523437500000297433125,
                "currency": "INR",
                "isEstimated": false,
                "subscriptionGuid": "98846a4a-670c-426e-beac-362d79862397",
                "meterDetails": null
            }
        }
    ]
};

let output = { 'Speech-Translator': 6.765685590277778,
"currency": "INR",
keys: [ 'Speech-Translator' ],
"totalCost": 6.765685590277778};

const azure : ParsingAzureData = new ParsingAzureData();

describe('Testing the findCost function that returns cost of azure resourcegroup', () => {

    it('should return Invalid input when string input is passed', (done) => {
        let result : any = azure.findCost('hai');
        expect(result).to.equal('Invalid input');
        done();
    });

    it('should return Invalid input when number input is passed', (done) => {
        let result : any = azure.findCost(100);
        expect(result).to.equal('Invalid input');
        done();
    });

    it('should return Invalid input when boolean input is passed', (done) => {
        let result : any = azure.findCost(true);
        expect(result).to.equal('Invalid input');
        done();
    });

    it('should return correct output when valid input is passed', (done) => {
        let result : any = azure.findCost(input);
        expect(result).to.deep.equal(output);
        done();

    });
});

describe('Testing the findmeterCost function that returns cost of azure resourcetype', () => {
    
    it('should return Invalid input when string input is passed', (done) => {
        let result : any = azure.findmeterCost('hai');
        expect(result).to.equal('Invalid input');
        done();
    });

    it('should return Invalid input when number input is passed', (done) => {
        let result : any = azure.findmeterCost(100);
        expect(result).to.equal('Invalid input');
        done();
    });

    it('should return Invalid input when boolean input is passed', (done) => {
        let result : any = azure.findmeterCost(true);
        expect(result).to.equal('Invalid input');
        done();
    });

}); 
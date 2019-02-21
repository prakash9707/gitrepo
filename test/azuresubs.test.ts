import * as assume from "assume";
import { expect } from 'chai';
import { AZUREUsageDetails } from "../src/API/azuresubs";
import { AzureUsageBot } from "../src/botfiles/bot";

let inputOutputforApi = {
"input":{
    filter: [ { category: 'ResourceGroup', value: 'remy-demo' } ],
    Resources: 'ResourceGroup',
  DateRange: 'CurrentPeriod',
  intent: 'Cost' },

  "output":"https://management.azure.com/subscriptions/98846a4a-670c-426e-beac-362d79862397/providers/Microsoft.Consumption/usageDetails?$filter=(properties/instanceName eq 'remy-demo') AND tags eq 'dev:tools'&api-version=2018-10-01"

};

const azure : AZUREUsageDetails = new AZUREUsageDetails();
describe('Testing the azureAPI generation', () => {

    it('should work for only proper input is passed', (done) => {
        let result = azure.generateAzureAPI('hai');
        expect(result).to.be.equal('Invalid input');
        done();
    });

    it('should return correct API when filtered data is passed', (done) => {
            let result = azure.generateAzureAPI({"filteredData":inputOutputforApi.input});
            expect(result).to.be.equal(inputOutputforApi.output);
            done();
    });
});



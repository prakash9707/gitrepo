"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const msRestAzure = require('ms-rest-azure');
const RESOURCE_GROUP_COST = 'ResourceGroup';
const CURRENT_PERIOD = 'CurrentPeriod';
const RESOURCE_TYPE_COST = 'ResourceType';
class AZUREUsageDetails {
    generateAzureAPI(filterData) {
        try {
            let filterquery = null;
            let url = "";
            const subscriptionId = '98846a4a-670c-426e-beac-362d79862397';
            if (filterData.hasOwnProperty('filteredData') && filterData['filteredData'].hasOwnProperty('intent') && filterData['filteredData'].hasOwnProperty('filter') && filterData['filteredData'].hasOwnProperty('DateRange')) {
                if (filterData['filteredData']['intent'] == "Cost") {
                    let filterLength = filterData['filteredData']['filter'].length;
                    if (filterData['filteredData']['DateRange'] != CURRENT_PERIOD) {
                        let dates = filterData['filteredData']['DateRange'].split('to');
                        filterquery = `(properties/usageStart ge '${dates[0]}' AND properties/usageEnd le '${dates[1]}')`;
                    }
                    if (filterLength != 0) {
                        if (filterquery == null)
                            filterquery = '(';
                        else
                            filterquery += `AND (`;
                        for (let idx = 0; idx < filterLength; idx++) {
                            filterquery += `properties/instanceName eq '${filterData['filteredData']['filter'][idx].value}'`;
                            if (idx != filterLength - 1)
                                filterquery += 'OR ';
                        }
                        filterquery += `) AND tags eq 'dev:tools'`;
                    }
                    if (filterData['filteredData']['Resources'] === RESOURCE_GROUP_COST)
                        url = `https://management.azure.com/subscriptions/${subscriptionId}/providers/Microsoft.Consumption/usageDetails?$filter=${filterquery}&api-version=2018-10-01`;
                    else
                        url = `https://management.azure.com/subscriptions/${subscriptionId}/providers/Microsoft.Consumption/usageDetails?$expand=properties/meterDetails&$filter=${filterquery}&api-version=2018-10-01`;
                }
            }
            return url;
        }
        catch (e) {
            console.log(e, " Occurs on generating the azure API");
        }
    }
    getAzureUsageDetails(currentUrl) {
        try {
            return new Promise(function (resolve, reject) {
                const AzureServiceClient = msRestAzure.AzureServiceClient;
                const clientId = '4d689e3d-f9a8-4863-8845-cf4e7adfa421';
                const secret = 'f2167dc2-b08a-4d7b-a21a-a1d90912de86';
                const domain = '97a80a72-fec2-4577-81ad-2da2880ff7bb';
                msRestAzure.loginWithServicePrincipalSecret(clientId, secret, domain).then((creds) => {
                    var client = new AzureServiceClient(creds);
                    let options = {
                        method: 'GET',
                        url: currentUrl,
                        headers: {
                            'user-agent': 'MyTestApp/1.0'
                        }
                    };
                    return client.sendRequest(options);
                }).then((result) => {
                    resolve(result);
                }).catch((err) => {
                    reject(err);
                });
            });
        }
        catch (err) {
            console.log(err + "occurs on getting data from azure api");
        }
    }
}
exports.AZUREUsageDetails = AZUREUsageDetails;

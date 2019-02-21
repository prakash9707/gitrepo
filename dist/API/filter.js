"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function convertData(getLuisData) {
    if (getLuisData.hasOwnProperty('entities')) {
        try {
            let entityLength = getLuisData['entities'].length;
            let checkPeriod = null;
            let result = { filter: [] };
            let CURRENT_PERIOD = 'CurrentPeriod';
            let RESOURCE_GROUP_NAMES = 'ResourceGroupNames';
            let USER_MONTH = 'builtin.datetimeV2.daterange';
            let USER_DATE = 'builtin.datetimeV2.date';
            if (getLuisData['topScoringIntent']['intent'] === "Cost") {
                for (let idx = 0; idx < entityLength; idx++) {
                    if (getLuisData['entities'][idx]['type'] == "Resources")
                        result['Resources'] = getLuisData['entities'][idx].resolution.values[0];
                    else if (getLuisData['entities'][idx]['type'] == "ResourceGroupNames") {
                        result.filter.push({
                            "category": "ResourceGroup",
                            "value": getLuisData['entities'][idx]['resolution'].values[0]
                        });
                        result['Resources'] = "ResourceGroup";
                    }
                    else if (getLuisData['entities'][idx]['type'] == USER_MONTH) {
                        result['DateRange'] = `${getLuisData['entities'][idx].resolution.values[0].start} to ${getLuisData['entities'][idx].resolution.values[0].end}`;
                        checkPeriod = USER_MONTH;
                    }
                    else if (getLuisData['entities'][idx]['type'] == USER_DATE) {
                        result['DateRange'] = `${getLuisData['entities'][idx].resolution.values[0].value} to ${getLuisData['entities'][idx].resolution.values[0].value}`;
                        checkPeriod = USER_DATE;
                    }
                }
                if (checkPeriod === null)
                    result['DateRange'] = CURRENT_PERIOD;
                result.intent = getLuisData['topScoringIntent']['intent'];
                return result;
            }
            else {
            }
        }
        catch (e) {
            console.log(e, " Occurs on filtering the luis data");
        }
    }
}
exports.convertData = convertData;

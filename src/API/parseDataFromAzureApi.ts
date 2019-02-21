export class ParsingAzureData {

    findCost(azureData: any): any {
        if (azureData.hasOwnProperty('value')) {
            let totalRecords: number = azureData['value'].length;
            let resourceCost: any = {};
            let totalCost: number = 0;
            let currencyUsed: string;
            try {
                for (let idx: number = 0; idx < totalRecords; idx++) {
                    if (idx == 0)
                        currencyUsed = azureData.value[idx].properties.currency;
                    if (resourceCost.hasOwnProperty(azureData.value[idx].properties.instanceName)) {
                        resourceCost[azureData.value[idx].properties.instanceName] += azureData.value[idx].properties.pretaxCost;
                    }
                    else {
                        resourceCost[azureData.value[idx].properties.instanceName] = azureData.value[idx].properties.pretaxCost;
                    }
                    totalCost += azureData.value[idx].properties.pretaxCost;
                }
            }
            catch (e) {
                console.log(e + "Occurs on findCost function");
            }
            let keysSorted: Array<string> = Object.keys(resourceCost).sort(function (a, b) { return resourceCost[b] - resourceCost[a] });
            resourceCost['keys'] = keysSorted;
            resourceCost['totalCost'] = totalCost;
            resourceCost['currency'] = currencyUsed;



            return resourceCost;
        }

        else
            return "Invalid input";
    }
    sortingValues(params) {
        let sortedOrder = Object.keys(params).sort(function (a, b) { return params[b] - params[a] });
        return sortedOrder;
    }

    findmeterCost(azureData: any): any {
        let meterCategory = {};
        let totalCost: number = 0;
        let currencyUsed: string;
        if (azureData.hasOwnProperty('value')) {
            let total_records = azureData.value.length;
            try {
                for (let itr = 0; itr < total_records; itr++) {
                    if (itr == 0)
                        currencyUsed = azureData.value[itr].properties.currency;
                    if (meterCategory.hasOwnProperty(azureData.value[itr].properties.instanceName)) {
                        let temp_instance_name = azureData.value[itr].properties.instanceName;
                        if (meterCategory[temp_instance_name].hasOwnProperty(azureData.value[itr].properties.meterDetails.meterCategory)) {
                            meterCategory[temp_instance_name][azureData.value[itr].properties.meterDetails.meterCategory] += azureData.value[itr].properties.pretaxCost;
                        }
                        else {
                            meterCategory[temp_instance_name][azureData.value[itr].properties.meterDetails.meterCategory] = azureData.value[itr].properties.pretaxCost;
                        }
                        totalCost += azureData.value[itr].properties.pretaxCost;
                    }
                    else {
                        meterCategory[azureData.value[itr].properties.instanceName] = {};
                        itr--;
                    }
                }
            } catch (e) {
                console.log(e + " occured on find meter category function");
            }



            var resource = (Object.keys(meterCategory));
            let resourcegroup = {};
            for (let i = 0; i < resource.length; i++) {
                let type = Object.keys(meterCategory[resource[i]]);
                let sum = 0;

                for (let j = 0; j < type.length; j++) {
                    sum += (meterCategory[resource[i]][type[j]]);

                }
                resourcegroup[resource[i]] = sum;
            }
            
            let resourcegroupSorted = this.sortingValues(resourcegroup);
            let resource_type_result = {};
            let meter;
            let arr = [];
            for (let i = 0; i < resourcegroupSorted.length; i++) {
                meter = this.sortingValues(meterCategory[resourcegroupSorted[i]]);
                for (let k = 0; k < meter.length; k++)
                    arr.push(meter[k]);
                for (let j = 0; j < meter.length; j++) {
                    `${meter[j]}` + " " + `----${Number(meterCategory[resourcegroupSorted[i]][meter[j]]).toFixed(3)}  INR` + "\n    ";
                    resource_type_result[meter[j]] = meterCategory[resourcegroupSorted[i]][meter[j]];
                }
            }
            resource_type_result['keys'] = arr;
            resource_type_result['totalCost'] = totalCost;
            resource_type_result['currency'] = currencyUsed;
            return resource_type_result;
        }
        else
            return "Invalid input";

    }


}

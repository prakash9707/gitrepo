"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function cardData(result, type) {
    let currency = result['currency'];
    let data = [{
            "type": "ColumnSet",
            "columns": [
                {
                    "type": "Column",
                    "width": 1,
                    "items": [
                        {
                            "type": "TextBlock",
                            "text": `**${type}**`,
                            "isSubtle": false,
                            "size": "default",
                            "horizontalAlignment": "left"
                        }
                    ]
                },
                {
                    "type": "Column",
                    "width": 1,
                    "items": [
                        {
                            "type": "TextBlock",
                            "text": "**Cost**",
                            "isSubtle": false,
                            "size": "default",
                            "horizontalAlignment": "right"
                        }
                    ]
                }
            ]
        }];
    let obj;
    for (let idx = 0; idx < result.keys.length; idx++) {
        try {
            if (Number((result[result.keys[idx]]).toFixed(2)) > 0) {
                obj = {
                    "type": "ColumnSet",
                    "separator": true,
                    "columns": []
                };
                obj.columns.push({
                    "type": "Column",
                    "width": "1",
                    "items": [{
                            "type": "TextBlock",
                            "text": result.keys[idx],
                            "size": "default",
                            "horizontalAlignment": "left"
                        }]
                });
                obj.columns.push({
                    "type": "Column",
                    "width": "1",
                    "items": [{
                            "type": "TextBlock",
                            "text": `${result[result.keys[idx]].toFixed(2)} ${currency}`,
                            "size": "default",
                            "horizontalAlignment": "right"
                        }]
                });
                data.push(obj);
            }
        }
        catch (e) {
            console.log(e + " occured in printing data in card");
        }
    }
    obj = {
        "type": "ColumnSet",
        "separator": true,
        "columns": []
    };
    obj.columns.push({
        "type": "Column",
        "width": "1",
        "items": [{
                "type": "TextBlock",
                "text": "**TotalCost**",
                "size": "default",
                "horizontalAlignment": "left"
            }]
    });
    obj.columns.push({
        "type": "Column",
        "width": "1",
        "items": [{
                "type": "TextBlock",
                "text": `**${result['totalCost'].toFixed(2)} ${currency}**`,
                "size": "default",
                "horizontalAlignment": "right"
            }]
    });
    data.push(obj);
    return data;
}
exports.cardData = cardData;

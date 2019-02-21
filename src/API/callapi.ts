var rp = require('request-promise');
var restify = require('./serverconf');
export function callAPI(filteredData: any) {
    var options = {
        method: 'POST',
        uri: 'http://localhost:3000/azureData',
        body: {
            filteredData
        },
        json: true
    };


    return new Promise((resolve, reject) => {
        try{
        rp(options)
            .then((parsedBody) => {
                resolve(parsedBody);
            })
            .catch((err) => {
                reject(err);
            })
        }
        catch(err){
            console.log(err+"occurs on calling localhost api");
        }
    });



}


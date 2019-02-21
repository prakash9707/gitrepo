const restify = require('restify');
const restifyErrors = require('restify-errors');
import { AZUREUsageDetails } from "../API/azuresubs";
import { ParsingAzureData } from "../API/parseDataFromAzureApi";
const azuresubs = new AZUREUsageDetails();
const parsingAzureDataObj = new ParsingAzureData();
const RESOURCE_GROUP = 'ResourceGroup';
const RESOURCE_TYPE = 'ResourceType';
const port = 3000;



export const server = restify.createServer({
    name: 'restify started'
});

server.use(restify.plugins.bodyParser());

server.post('/azureData', async (req, res, next) => { // defining what your API needs to do with the input....

    if (!req.body) {
        res.send(400, 'Please give any query');
        return next(new restifyErrors.BadRequestError());
    }
    else {
        try{
        if ((req.body).hasOwnProperty('filteredData') && (req.body.filteredData).hasOwnProperty('filter') && (req.body.filteredData).hasOwnProperty('DateRange') && (req.body.filteredData).hasOwnProperty('intent')) {
            let url = azuresubs.generateAzureAPI(req.body);
            let subsData = await azuresubs.getAzureUsageDetails(url);
            let data: any;
            if (req.body.filteredData.Resources == RESOURCE_GROUP)
                data = parsingAzureDataObj.findCost(subsData);
            else if (req.body.filteredData.Resources == RESOURCE_TYPE)
                data = parsingAzureDataObj.findmeterCost(subsData);

            res.send(200, data);
        }
        else
            res.send(422, null);
        return next();
    }
    catch(err){
        console.log(err+"happend while hitting azure api");
    }
}

});


server.listen(port, () => {
    console.log(`Running in ${port}`);
});


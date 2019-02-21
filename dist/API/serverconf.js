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
const restify = require('restify');
const restifyErrors = require('restify-errors');
const azuresubs_1 = require("../API/azuresubs");
const parseDataFromAzureApi_1 = require("../API/parseDataFromAzureApi");
const azuresubs = new azuresubs_1.AZUREUsageDetails();
const parsingAzureDataObj = new parseDataFromAzureApi_1.ParsingAzureData();
const RESOURCE_GROUP_COST = 'ResourceGroup';
const RESOURCE_TYPE_COST = 'ResourceType';
const port = 3000;
exports.server = restify.createServer({
    name: 'restify started'
});
exports.server.use(restify.plugins.bodyParser());
exports.server.post('/azureData', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    if (!req.body) {
        res.send(400, 'Please give any query');
        return next(new restifyErrors.BadRequestError());
    }
    else {
        try {
            if ((req.body).hasOwnProperty('filteredData') && (req.body.filteredData).hasOwnProperty('filter') && (req.body.filteredData).hasOwnProperty('DateRange') && (req.body.filteredData).hasOwnProperty('intent')) {
                let url = azuresubs.generateAzureAPI(req.body);
                console.log(url);
                let subsData = yield azuresubs.getAzureUsageDetails(url);
                let data;
                if (req.body.filteredData.Resources == RESOURCE_GROUP_COST)
                    data = parsingAzureDataObj.findCost(subsData);
                else if (req.body.filteredData.Resources == RESOURCE_TYPE_COST)
                    data = parsingAzureDataObj.findmeterCost(subsData);
                res.send(200, data);
            }
            else
                res.send(422, null);
            return next();
        }
        catch (err) {
            console.log(err + "happend while hitting azure api");
        }
    }
}));
exports.server.listen(port, () => {
    console.log(`Running in ${port}`);
});

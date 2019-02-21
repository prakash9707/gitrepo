import * as request from "supertest";
import { AzureUsageBot } from "../src/botfiles/bot";
import * as assume from "assume";
import { expect } from 'chai';

const bot = new AzureUsageBot();

describe('Testing luis', () => {

    it('should check luis response for Greeting', async() => {
        let result = await bot.getLuisIntent('hi');
        expect(result['topScoringIntent']['intent']).to.equal('Greeting');
        expect(result['topScoringIntent']['score']).to.above(0.8);
        expect(200)
    });

    it('should check luis response for Cost', async() => {
        let result = await bot.getLuisIntent('cost of resource group');
        expect(result['topScoringIntent']['intent']).to.equal('Cost');
        expect(result['topScoringIntent']['score']).to.above(0.8);
        expect(200)
    });

    it('should check luis response for Cost', async() => {
        let result = await bot.getLuisIntent('cost of resource type');
        expect(result['topScoringIntent']['intent']).to.equal('Cost');
        expect(200)
    });

});

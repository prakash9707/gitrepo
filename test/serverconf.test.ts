import * as request from "supertest";
import { server } from "../src/API/serverconf";
import * as assume from "assume";
import { expect } from 'chai';

let input = {
    filteredData:
    {
        filter: [],
        Resources:'ResourceGroup',
        DateRange: 'CurrentPeriod',
        intent: 'Cost'
    }
};

describe('Testing the API', () => {

    after((done) => {
        server.close(done);
    });

    it('should return 400 when it does not get input', (done) => {
        request(server)
            .post('/azureData')
            .send()
            .expect(400)
            .end(done);

    });

    it('should return 404 when the bad end point get hit', (done) => {
        request(server)
            .post('/azuredata')
            .expect(404)
            .end(done);
    });

    it('should return 422 when the wrong type of input is passed', (done) => {
        request(server)
            .post('/azureData')
            .send('input')
            .expect(422)
            .end(done);
    });


    it('should return status code as 200 when correct type of input is passed', (done) => {

        request(server)
            .post('/azureData')
            .send(input)
            .expect((res) => {
                assume(res).is.a('object')
                expect(res.body).to.have.property("keys");
                expect(200)
            })
            .expect('Content-Type', /json/)
            .end(done);
    });
});

import * as assume from "assume";
import { expect } from 'chai';
import { convertData } from "../src/API/filter";



describe('Testing the filter function' ,() => {

    it('should return Invalid input when string input is passed', (done) => {
        let result : string = convertData('hai');
        expect(result).to.equal('Invalid input');
        done();
    });

    it('should return Invalid input when number input is passed', (done) => {
        let result : string = convertData(100);
        expect(result).to.equal('Invalid input');
        done();
    });

    it('should return Invalid input when boolean input is passed', (done) => {
        let result : string = convertData(true);
        expect(result).to.equal('Invalid input');
        done();
    });

    
});
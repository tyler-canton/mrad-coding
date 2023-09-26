const chai = require('chai');
const expect = chai.expect;
const Axios = require('axios');

describe('API Test', () => {
    it('should return 200', async () => {
        const response = await Axios.get('http://localhost:3000');
        expect(response.status).to.equal(200);
    });
});

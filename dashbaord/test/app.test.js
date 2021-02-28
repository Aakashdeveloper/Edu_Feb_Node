let chai = require('chai');
let chaiHttp = require('chai-http');
let expect = chai.expect;
chai.use(chaiHttp);

describe('Testing Rest Api',() => {
    it('should return 200 for health',(done) => {
        chai.request(`http://localhost:9800`)
        .get('/health')
        .then((res) => {
            expect(res).to.have.status(200);
            done()
        })
        .catch((err)=>{
            throw err
        })
    })
})
const sinon = require('sinon');
const chai = require('chai');

chai.should();

describe('The http client module', function () {
    let httpClient;

    const axios = require('axios');

    before(function () {
        httpClient = require('./http-client');
    });

    describe('#get()', function () {
        let cbSpy;

        beforeEach(function () {
            cbSpy = sinon.spy();
        });

        it('should not call the callback with a result with a missing URL', function (done) {
            httpClient.get(null, cbSpy)
                .then(() => {
                    cbSpy.called.should.be.false;
                })
                .then(done, done);
        });

        it('should not call the callback with a result with an erroneous URL', function (done) {
            httpClient.get('This is not a proper URL', cbSpy)
                .then(() => {
                    cbSpy.called.should.be.false;
                })
                .then(done, done);
        });

        it('should call the callback when provided a proper URL', function (done) {
            let getStub = sinon.stub(axios, 'get');

            const res = { data: 'A real result' };
            getStub.resolves(res);

            httpClient.get('http://localhost', cbSpy)
                .then(() => {
                    cbSpy.calledWith(res.data).should.be.true;
                })
                .then(done, done);

            axios.get.restore();
        });
    });
});

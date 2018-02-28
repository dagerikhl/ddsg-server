const sinon = require('sinon');
const chai = require('chai');

chai.should();

describe('The entities routes module', function () {
    let app;
    let req;
    let res;

    before(function () {
        app = { get: null };

        req = {
            method: null,
            headers: {
                host: null
            },
            url: null
        };
        res = { json: null };
    });

    beforeEach(function () {
        app.get = sinon.spy();

        require('./entities-routes')(app);

        res.json = sinon.spy();
    });

    it('should export exactly one route', function () {
        app.get.calledOnce.should.be.true;
    });

    it('should export the /entities route', function () {
        app.get.calledWith('/entities').should.be.true;
    });

    it('should log a serving statement when requested', function () {
        app.get.callArgWith(1, req, res);

        logger.info.calledWithMatch(/Serving.*/).should.be.true;
    });

    it('should serve JSON response when requested', function () {
        const emptyResponseString = '{}';
        const emptyResponseObject = JSON.parse(emptyResponseString);

        app.get.callArgWith(1, req, res);

        res.json.lastCall.args[0].should.be.eql(emptyResponseObject);
    });

});

const sinon = require('sinon');
const chai = require('chai');

chai.should();

describe('The entities routes module', function () {
    let app;
    let req;
    let res;

    const fileHandler = require('../services/file-handler');

    before(function () {
        sinon.stub(fileHandler, 'getFileContent').returns('{}');
        sinon.stub(fileHandler, 'setFileContent');

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

    after(function () {
        fileHandler.getFileContent.restore();
        fileHandler.setFileContent.restore();
    });

    beforeEach(function () {
        app.get = sinon.spy();
        res.json = sinon.spy();

        require('./entities-routes')(app);
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

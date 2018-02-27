const sinon = require('sinon');
const chai = require('chai');

chai.should();

describe('The entities routes module', function () {
    // Arrange
    const app = {
        get: sinon.spy()
    };

    const req = {
        method: null,
        headers: {
            host: null
        },
        url: null
    };
    const res = {
        json: sinon.spy()
    };

    const emptyResponseString = '{}';
    const emptyResponseObject = JSON.parse(emptyResponseString);

    require('./entities-routes')(app);

    it('should export the /entities route', function () {
        // Assert
        app.get.calledWith('/entities').should.be.true;
    });

    it('should log a serving statement when requested', function () {
        // Act
        app.get.callArgWith(1, req, res);

        // Assert
        logger.info.calledWithMatch(/Serving.*/).should.be.true;
    });

    it('should serve JSON response', function () {
        // Act
        app.get.callArgWith(1, req, res);

        // Assert
        res.json.lastCall.args[0].should.be.eql(emptyResponseObject);
    });

});

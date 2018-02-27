const sinon = require('sinon');
const chai = require('chai');

chai.should();

describe('The entities routes module', function () {
    // Arrange
    const appSpy = {
        get: sinon.spy()
    };

    require('./entities-routes')(appSpy);

    it('should export the /entities route', function () {
        // Assert
        appSpy.get.calledWith('/entities').should.be.true;
    });

    it('should log a serving statement when requested', function () {
        // Arrange
        const req = {
            method: null,
            headers: {
                host: null
            },
            url: null
        };
        const res = {
            json: () => {
            }
        };

        // Act
        appSpy.get.callArgWith(1, req, res);

        // Assert
        logger.info.calledWithMatch(/Serving.*/).should.be.true;
    });

});

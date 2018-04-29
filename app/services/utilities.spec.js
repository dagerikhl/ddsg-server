const sinon = require('sinon');
const chai = require('chai');

chai.should();

describe('The utilities module', function () {
    let utilities;

    before(function () {
        utilities = require('./utilities');
    });

    describe('#timestamp()', function () {
        let timestampSpy;
        let timeNow;
        let timestamp;

        before(function () {
            timestampSpy = sinon.spy(utilities, 'timestamp');
        });

        after(function () {
            timestampSpy.restore();
        });

        beforeEach(function () {
            timeNow = new Date(Date.now());

            timestamp = timestampSpy();
        });

        it('should return an ISO 8601 formatted date-string', function () {
            const isoTimeRegex = /^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)$/;

            timestamp.should.match(isoTimeRegex);
        });

        it('should return a time within 10 seconds of being called', function () {
            const lowerRange = new Date(timeNow.getTime() - 1000*10);
            const upperRange = new Date(timeNow.getTime() + 1000*10);

            let interpretedTime = new Date(timestamp);

            interpretedTime.should.be.within(lowerRange, upperRange);
        });
    });

    describe('#uuid()', function () {
        let uuidSpy;
        let uuid;

        before(function () {
            uuidSpy = sinon.spy(utilities, 'uuid');
        });

        after(function () {
            uuidSpy.restore();
        });

        beforeEach(function () {
            uuid = uuidSpy();
        });

        it('should return a uuid formatted string', function () {
            const uuidRegex = /^[a-f\d]{8}-([a-f\d]{4}-){3}[a-f\d]{12}$/i;

            uuid.should.match(uuidRegex);
        });

        it('should return a version 4 uuid formatted string', function () {
            const uuidV4Regex = /^[a-f\d]{8}-[a-f\d]{4}-4[a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}$/i;

            uuid.should.match(uuidV4Regex);
        });
    });

    describe('#uniqueFilter()', function () {
        let uniqueFilterSpy;

        before(function () {
            uniqueFilterSpy = sinon.spy(utilities, 'uniqueFilter');
        });

        after(function () {
            uniqueFilterSpy.restore();
        });

        it('should return an array with only unique elements from an array with duplicates', function () {
            const data = [
                1,
                1,
                2,
                2,
                2
            ];

            const filteredData = data.filter(utilities.uniqueFilter);

            data.length.should.be.equal(5);
            filteredData.length.should.be.equal(2);
        });
    });
});

let chai = require('chai');
let utils = require('../utils');
let expect = chai.expect;
let assert = chai.assert;

describe('Utils', () => {

    it('it should change coverage report', async function() {
        let originalFile = {
            "/home/test/Downloads/file1": "value1",
            "/home/test/Downloads/file2": "value2",
            "/home/test/Downloads/file3": "value3",
        };

        let result = utils.readCoverageReport(originalFile);
        expect(Object.keys(result)).to.be.all.members(["file1", "file2", "file3"])
    });

    it('it should fail to send email', async function() {
        var user = {
            name: "John",
            email: "john@email.com"
        };
        var book = {
            title: "Title",
            authors: ["Jack Smith"]
        }
        let result = utils.sendEmail(user, book);
        assert.isNotOk(result.success);
    });
});
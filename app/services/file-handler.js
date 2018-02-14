const fs = require('fs');
const path = require('path');

const basePath = 'data';

function getFileContent(filename) {
    const filePath = path.join(basePath, filename + '.json');
    const rawContent = fs.readFileSync(filePath);

    return JSON.parse(rawContent.toString());
}

function setFileContent(filename, content) {
    const filePath = path.join(basePath, filename + '.json');
    const rawContent = JSON.stringify(content);

    fs.writeFileSync(filePath, rawContent);
}

module.exports = {
    getFileContent,
    setFileContent
};

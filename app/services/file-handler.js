const fs = require('fs');
const path = require('path');

const basePath = 'data';

function getFileContent(filename) {
    const filePath = path.join(basePath, filename);
    const rawContent = fs.readFileSync(filePath);

    return JSON.parse(rawContent.toString());
}

// TODO Replace entire content of local file
function setFileContent(filename, content) {
    const filePath = path.join(basePath, filename);
    const rawContent = JSON.stringify(content);

    fs.writeFileSync(filePath, rawContent);
}

module.exports = {
    getFileContent,
    setFileContent
};

const fs = require('fs');
const path = require('path');

const basePath = 'data';

function getFileContent(fileName) {
    const rawContent = fs.readFileSync(path.join(basePath, fileName));

    return rawContent.toString();
}

function setFileContent(fileName, content) {
    fs.writeFileSync(path.join(basePath, fileName), content);
}

function removeFile(fileName) {
    if (fs.existsSync(path.join(basePath, fileName))) {
        fs.unlink(path.join(basePath, fileName), (err) => {
            if (err) {
                logger.error(`Error removing file ${fileName}:`, err);
                console.log(`Error removing file ${fileName}:`, err);
            }
        });
    }
}

module.exports = {
    getFileContent,
    setFileContent,
    removeFile
};

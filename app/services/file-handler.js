const fs = require('fs');
const path = require('path');
const unzip = require('unzip');

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
            }
        });
    }
}

function extractEntryFromZipFile(zipFileName, entryFileName, cb) {
    fs.createReadStream(path.join(basePath, zipFileName))
        .pipe(unzip.Parse())
        .on('entry', (entry) => {
            if (entry.path === entryFileName) {
                const stream = fs.createWriteStream(path.join(basePath, entryFileName));
                stream.addListener('close', cb);

                entry.pipe(stream);
            } else {
                entry.autodrain();
            }
        });
}

module.exports = {
    getFileContent,
    setFileContent,
    removeFile,
    extractEntryFromZipFile
};

const stixGeneralGen = require('./general-generator');

// Local state
let cweObject = null;

function feed(feedObject) {
    cweObject = feedObject;
}

function clear() {
    cweObject = null;
}

function genName() {
    return cweObject['_attributes']['Name'];
}

function genDescription() {
    // return stixGeneralGen.buildRecursiveCweText([], { 'Description': cweObject['Description'] }, 'Description');
    return stixGeneralGen.buildRecursiveText([], cweObject['Description']);
}

function genExtendedDescription() {
    // return stixGeneralGen.buildRecursiveCweText([], { 'Extended_Description': cweObject['Extended_Description'] }, 'Extended_Description');
    return stixGeneralGen.buildRecursiveText([], cweObject['Extended_Description']);
}

function genLikelihood() {
    let likelihood = null;

    const likelihoodObject = cweObject['Likelihood_Of_Exploit'];
    if (likelihoodObject) {
        likelihood = likelihoodObject['_text'];
    }

    return likelihood;
}

// FIXME
function genConsequences() {
}

module.exports = {
    feed,
    clear,
    genName,
    genDescription,
    genExtendedDescription,
    genLikelihood,
    genConsequences
};

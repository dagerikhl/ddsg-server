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
    return stixGeneralGen.buildRecursiveText(cweObject['Description']);
}

function genExtendedDescription() {
    return stixGeneralGen.buildRecursiveText(cweObject['Extended_Description']);
}

function genTypicalLikelihoodOfExploit() {
    let likelihood = null;

    const likelihoodObject = cweObject['Likelihood_Of_Exploit'];
    if (likelihoodObject) {
        likelihood = likelihoodObject['_text'];
    }

    return likelihood;
}

function genConsequences() {
    const consequencesObjects = cweObject['Common_Consequences']['Consequence'];

    if (consequencesObjects instanceof Array) {
        return consequencesObjects.map((e) => {
            return genConsequence(e);
        });
    } else if (consequencesObjects) {
        return [genConsequence(consequencesObjects)];
    }

    return null;
}

function genConsequence(consequenceObject) {
    return {
        scope: stixGeneralGen.buildRecursiveText(consequenceObject['Scope']),
        impact: stixGeneralGen.buildRecursiveText(consequenceObject['Impact']),
        note: stixGeneralGen.buildRecursiveText(consequenceObject['Note']),
        likelihood: stixGeneralGen.buildRecursiveText(consequenceObject['Likelihood'])
    };
}

module.exports = {
    feed,
    clear,
    genName,
    genDescription,
    genExtendedDescription,
    genTypicalLikelihoodOfExploit,
    genConsequences
};

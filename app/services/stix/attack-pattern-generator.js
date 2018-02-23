const stixGeneralGen = require('./general-generator');

// Local state
let capecObject = null;

function feed(feedObject) {
    capecObject = feedObject;
}

function clear() {
    capecObject = null;
}

function genName() {
    return capecObject['_attributes']['Name'];
}

function genDescription() {
    return stixGeneralGen.buildRecursiveCapecDescription([], capecObject['capec:Description']);
}

function genSeverity() {
    let severity = null;

    const severityObject = capecObject['capec:Typical_Severity'];
    if (severityObject) {
        severity = severityObject['_text'];
    }

    return severity;
}

function genLikelihood() {
    let likelihood = null;

    const likelihoodObject = capecObject['capec:Typical_Likelihood_of_Exploit'];
    if (likelihoodObject && likelihoodObject['capec:Likelihood']) {
        likelihood = likelihoodObject['capec:Likelihood']['_text'];
    }

    return likelihood;
}

function genInjectionVector() {
    let injectionVector = null;

    const injectionVectorObject = capecObject['capec:Injection_Vector'];
    if (injectionVectorObject && injectionVectorObject['capec:Text']) {
        injectionVector = injectionVectorObject['capec:Text']['_text'];
    }

    return injectionVector;
}

function genPayload() {
    let payload = null;

    const payloadObject = capecObject['capec:Payload'];
    if (payloadObject && payloadObject['capec:Text']) {
        payload = payloadObject['capec:Text']['_text'];
    }

    return payload;
}

function genActivationZone() {
    let activationZone = null;

    const activationZoneObject = capecObject['capec:Activation_Zone'];
    if (activationZoneObject && activationZoneObject['capec:Text']) {
        activationZone = activationZoneObject['capec:Text']['_text'];
    }

    return activationZone;
}

function genCia() {
    let cia = null;

    const ciaObject = capecObject['capec:CIA_Impact'];
    if (ciaObject && ciaObject !== {}) {
        cia = {
            confidentiality: ciaObject['capec:Confidentiality_Impact']['_text'],
            integrity: ciaObject['capec:Integrity_Impact']['_text'],
            availability: ciaObject['capec:Availability_Impact']['_text']
        };
    }

    return cia;
}

module.exports = {
    feed,
    clear,
    genName,
    genDescription,
    genSeverity,
    genLikelihood,
    genInjectionVector,
    genPayload,
    genActivationZone,
    genCia
};

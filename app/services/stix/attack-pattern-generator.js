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

function genSummary() {
    return stixGeneralGen.buildRecursiveText([], capecObject['capec:Description']['capec:Summary']);
}

function genAttackSteps() {
    let attackSteps = {
        explore: null,
        experiment: null,
        exploit: null
    };

    if (capecObject['capec:Description']['capec:Attack_Execution_Flow']) {
        const phases = capecObject['capec:Description']['capec:Attack_Execution_Flow']['capec:Attack_Phases']['capec:Attack_Phase'];

        // Can be: explore, experiment, and exploit
        if (phases instanceof Array) {
            for (let phase of phases) {
                let phaseName = phase['_attributes']['Name'];
                let phaseObjects = phase['capec:Attack_Steps']['capec:Attack_Step'];

                attackSteps[phaseName.toLowerCase()] = extractAttackPhases(phaseObjects);
            }
        } else if (phases && typeof phases === 'object') {
            let phaseName = phases['_attributes']['Name'];
            let phaseObjects = phases['capec:Attack_Steps']['capec:Attack_Step'];

            attackSteps[phaseName.toLowerCase()] = extractAttackPhases(phaseObjects);
        }
    }

    return attackSteps;
}

function genAttackPrerequisites() {
    const prerequisitesObject = capecObject['capec:Attack_Prerequisites'];
    if (prerequisitesObject) {
        let prerequisitesArrayOrObject = prerequisitesObject['capec:Attack_Prerequisite'];
        if (prerequisitesArrayOrObject instanceof Array) {
            return prerequisitesArrayOrObject.map((prerequisite) => stixGeneralGen.buildJoinedRecursiveText([], prerequisite));
        } else if (prerequisitesArrayOrObject && typeof prerequisitesArrayOrObject === 'object') {
            return stixGeneralGen.buildRecursiveText([], prerequisitesArrayOrObject);
        }
    }

    return null;
}

function genTypicalSeverity() {
    let severity = null;

    const severityObject = capecObject['capec:Typical_Severity'];
    if (severityObject) {
        severity = severityObject['_text'];
    }

    return severity;
}

function genTypicalLikelihoodOfExploit() {
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

function genCiaImpact() {
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

function extractAttackPhases(phaseObjects) {
    if (phaseObjects instanceof Array) {
        return phaseObjects.map((phaseObject) => extractAttackPhase(phaseObject['capec:Custom_Attack_Step']));
    } else if (phaseObjects && typeof phaseObjects === 'object') {
        return [extractAttackPhase(phaseObjects['capec:Custom_Attack_Step'])];
    }

    return null;
}

function extractAttackPhase(phaseObject) {
    let phase = {
        title: null,
        description: null,
        steps: null
    };

    phase.title = phaseObject['capec:Attack_Step_Title'] ? phaseObject['capec:Attack_Step_Title']['_text'] : null;
    phase.description = stixGeneralGen.buildRecursiveText([], phaseObject['capec:Attack_Step_Description']);

    if (phaseObject['capec:Attack_Step_Techniques']) {
        const steps = phaseObject['capec:Attack_Step_Techniques']['capec:Attack_Step_Technique'];
        if (steps instanceof Array) {
            phase.steps = steps.map((step) => stixGeneralGen.buildJoinedRecursiveText([], step['capec:Attack_Step_Technique_Description']));
        } else if (steps && typeof steps === 'object') {
            phase.steps = stixGeneralGen.buildRecursiveText([], steps['capec:Attack_Step_Technique_Description']);
        }
    }

    return phase;
}

module.exports = {
    feed,
    clear,
    genName,
    genSummary,
    genAttackSteps,
    genAttackPrerequisites,
    genTypicalSeverity,
    genTypicalLikelihoodOfExploit,
    genInjectionVector,
    genPayload,
    genActivationZone,
    genCiaImpact
};

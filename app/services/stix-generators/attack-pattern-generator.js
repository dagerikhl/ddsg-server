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
    return stixGeneralGen.buildRecursiveText(capecObject['capec:Description']['capec:Summary']);
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
    return extractTransformedFieldOnSelectors('capec:Attack_Prerequisites',
        'capec:Attack_Prerequisite',
        stixGeneralGen.buildJoinedRecursiveText);
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

function genExamplesInstances() {
    return extractTransformedFieldOnSelectors('capec:Examples-Instances', 'capec:Example-Instance', extractExample);
}

function genProbingTechniques() {
    return extractTransformedFieldOnSelectors('capec:Probing_Techniques',
        'capec:Probing_Technique',
        stixGeneralGen.buildJoinedRecursiveText);
}

function genIndicatorsWarningsOfAttack() {
    return extractTransformedFieldOnSelectors('capec:Indicators-Warnings_of_Attack',
        'capec:Indicator-Warning_of_Attack',
        stixGeneralGen.buildJoinedRecursiveText);
}

function genAttackMotivationConsequences() {
    return extractTransformedFieldOnSelectors('capec:Attack_Motivation-Consequences',
        'capec:Attack_Motivation-Consequence',
        extractMotivation);
}

function genInjectionVector() {
    let injectionVector = {
        description: null,
        category: null
    };

    const injectionVectorObject = capecObject['capec:Injection_Vector'];
    if (injectionVectorObject && injectionVectorObject['capec:Text']) {
        injectionVector.description = injectionVectorObject['capec:Text']['_text'];
    }

    if (injectionVector.description) {
        injectionVector.category = categorizeInjectionVector(injectionVector.description);
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
    phase.description = stixGeneralGen.buildRecursiveText(phaseObject['capec:Attack_Step_Description']);

    if (phaseObject['capec:Attack_Step_Techniques']) {
        const steps = phaseObject['capec:Attack_Step_Techniques']['capec:Attack_Step_Technique'];
        if (steps instanceof Array) {
            phase.steps = steps
                .map((step) => stixGeneralGen.buildJoinedRecursiveText(step['capec:Attack_Step_Technique_Description']));
        } else if (steps && typeof steps === 'object') {
            phase.steps = stixGeneralGen.buildRecursiveText(steps['capec:Attack_Step_Technique_Description']);
        }
    }

    return phase;
}

function extractExample(exampleObject) {
    const cveRegex = /CVE-\d{4}-\d+/g;

    let example = {
        description: null,
        external_references: null
    };

    example.description =
        exampleObject['capec:Example-Instance_Description'] ?
            stixGeneralGen.buildRecursiveText(exampleObject['capec:Example-Instance_Description']) :
            null;

    const relations = exampleObject['capec:Example-Instance_Related_Vulnerabilities'];
    if (relations) {
        const references = relations['capec:Example-Instance_Related_Vulnerability'];
        if (references instanceof Array) {
            example.external_references = references.map((reference) => {
                let referenceText = stixGeneralGen.buildJoinedRecursiveText(reference);

                let cveId = referenceText.match(cveRegex);
                if (cveId) {
                    return stixGeneralGen.genCveExternalReference(cveId[0]);
                }

                return stixGeneralGen.genUnknownExternalReference(referenceText);
            });
        } else if (references && typeof references === 'object') {
            let referenceText = stixGeneralGen.buildJoinedRecursiveText(references);

            let cveId = referenceText.match(cveRegex);
            if (cveId) {
                example.external_references = [stixGeneralGen.genCveExternalReference(cveId[0])];
            } else {
                example.external_references = [stixGeneralGen.genUnknownExternalReference(referenceText)];
            }
        }
    }

    return example;
}

function extractMotivation(motivationObject) {
    let motivation = {
        scope: null,
        impact: null,
        notes: null
    };

    motivation.scope =
        motivationObject['capec:Consequence_Scope'] ?
            stixGeneralGen.buildRecursiveText(motivationObject['capec:Consequence_Scope']) :
            null;

    motivation.impact =
        motivationObject['capec:Consequence_Technical_Impact'] ?
            stixGeneralGen.buildRecursiveText(motivationObject['capec:Consequence_Technical_Impact']) :
            null;

    motivation.notes =
        motivationObject['capec:Consequence_Note'] ?
            stixGeneralGen.buildRecursiveText(motivationObject['capec:Consequence_Note']) :
            null;

    return motivation;
}

function extractTransformedFieldOnSelectors(selector1, selector2, transform) {
    const outerObjects = capecObject[selector1];
    if (outerObjects) {
        let innerObjects = outerObjects[selector2];
        if (innerObjects instanceof Array) {
            return innerObjects.map(transform);
        } else if (innerObjects && typeof innerObjects === 'object') {
            return [transform(innerObjects)];
        }
    }

    return null;
}

function categorizeInjectionVector(description) {
    let categories = [];
    if (description.match(
        /(user[- ]?(control(led|lable)?)?|malicious) ?(input|request|variable)s?|client.*parameters?|app(lication).*interface|(e|e-)?mail|(url|resource)[- ]?paths?/gi)) {
        categories.push('Client');
    }
    if (description.match(
        /(https?|server|api|communication|web|client|app(lication)?).*(call|request|response|protocol|cookie)s?|get|post|cookie?s|data.*transit/gi)) {
        categories.push('Network');
    }
    if (description.match(
        /append(ing|s)? ?(delimiter|option|switche?)s?|sym(bolic)?[- ]?links?|config(uration)?s?[- ]?files?|files?[- ]?paths?/gi)) {
        categories.push('Server');
    }

    return categories.length > 0 ? categories : null;
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
    genExamplesInstances,
    genProbingTechniques,
    genIndicatorsWarningsOfAttack,
    genAttackMotivationConsequences,
    genInjectionVector,
    genPayload,
    genActivationZone,
    genCiaImpact
};

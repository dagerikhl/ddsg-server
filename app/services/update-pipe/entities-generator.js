const stixAttackPatternGen = require('../stix/attack-pattern-generator');
const stixCourseOfActionGen = require('../stix/course-of-action-generator');
const stixGeneralGen = require('../stix/general-generator');
const stixRelationshipGen = require('../stix/relationship-generator');
const stixWeaknessGen = require('../stix/weakness-generator');

/**
 * All of the objects generated by this method is supposed to follow the STIX 2 standard. This includes both the
 * objects and the relationships. This is restricted to the layout of STIX, and does not mean they will follow the
 * exact schema for ojects and relationships.
 *
 * The STIX 2 standard can be found here: https://oasis-open.github.io/cti-documentation/stix/intro
 *
 * The relevant STIX Data Objects (SDOs) created by this method are:
 * 1. Attack Pattern: Represents an attack pattern as fetched from CAPEC.
 * 2. Course of Action: Represents a potential mitigation of an attack pattern.
 *
 * In addition, these custom data objects outisde the STIX standard will be included:
 * 3. Weakness: Represents a weakness as fetched from CWE.
 *
 * And the relevant STIX Relationship Objects (SROs) created by this method are:
 * 1. Relationship.
 *
 * @param objects Contains the filtered and unfiltered objects from data sources.
 * @param cb Used to relay the generated entities back to the calling function.
 */
function genStixEntities(objects, cb) {
    const [attackPatterns, courseOfActions] = genAttackPatternsAndCourseOfActions(objects);
    const weaknesses = genWeaknesses(objects);
    const SDOs = {
        attack_patterns: attackPatterns,
        course_of_actions: courseOfActions,
        weaknesses
    };

    const relationships = genRelationships(objects, SDOs);
    const SROs = {
        relationships
    };

    const entities = {
        SDOs,
        SROs
    };

    cb(entities);
}

function genAttackPatternsAndCourseOfActions(objects) {
    const attackPatterns = [];
    let courseOfActions = [];
    for (let capecObject of objects.capecObjectsFiltered) {
        attackPatterns.push(genAttackPatternFrom(capecObject));

        const tempCourseOfActions = genCourseOfActionsFor(capecObject);
        if (tempCourseOfActions) {
            courseOfActions = courseOfActions.concat(tempCourseOfActions);
        }
    }

    return [
        attackPatterns,
        courseOfActions
    ];
}

function genAttackPatternFrom(capecObject) {
    stixAttackPatternGen.feed(capecObject);

    const id = capecObject['_attributes']['ID'];
    const attackPattern = stixGeneralGen.createEntity('attack-pattern');

    // Generated standard STIX properties
    attackPattern.name = stixAttackPatternGen.genName();
    attackPattern.description = stixAttackPatternGen.genSummary();
    attackPattern.external_references = stixGeneralGen.genMitreExternalReferences('capec', id);

    // Custom properties outside of STIX
    attackPattern.custom = {
        attackSteps: stixAttackPatternGen.genAttackSteps(),
        severity: stixAttackPatternGen.genSeverity(),
        likelihood: stixAttackPatternGen.genLikelihood(),
        injection_vector: stixAttackPatternGen.genInjectionVector(),
        payload: stixAttackPatternGen.genPayload(),
        activation_zone: stixAttackPatternGen.genActivationZone(),
        cia: stixAttackPatternGen.genCia()
    };

    stixAttackPatternGen.clear();
    return attackPattern;
}

function genCourseOfActionsFor(capecObject) {
    // Handle no mitigations
    const mitigationsObject = capecObject['capec:Solutions_and_Mitigations'];
    if (!mitigationsObject) {
        return null;
    }

    const id = capecObject['_attributes']['ID'];
    const mitigations = mitigationsObject['capec:Solution_or_Mitigation'];
    if (mitigations instanceof Array) {
        return mitigations.map((e) => {
            return genCourseOfActionFrom(id, e);
        });
    } else {
        return genCourseOfActionFrom(id, mitigations);
    }
}

function genCourseOfActionFrom(id, capecObjectMitigation) {
    stixCourseOfActionGen.feed(capecObjectMitigation);

    const courseOfAction = stixGeneralGen.createEntity('course-of-action');

    // Generated standard STIX properties
    courseOfAction.description = stixCourseOfActionGen.genMitigationText();
    courseOfAction.external_references = stixGeneralGen.genMitreExternalReferences('capec', id);

    stixCourseOfActionGen.clear();
    return courseOfAction;
}

function genWeaknesses(objects) {
    const weaknesses = [];
    for (let cweObject of objects.cweObjectsFiltered) {
        weaknesses.push(genWeaknessFrom(cweObject));
    }

    return weaknesses;
}

function genWeaknessFrom(cweObject) {
    stixWeaknessGen.feed(cweObject);

    const id = cweObject['_attributes']['ID'];
    const weakness = stixGeneralGen.createEntity('weakness');

    // Generated standard STIX properties
    weakness.name = stixWeaknessGen.genName();
    weakness.description = stixWeaknessGen.genDescription();
    weakness.external_references = stixGeneralGen.genMitreExternalReferences('cwe', id);

    // Custom properties outside of STIX
    weakness.custom = {
        extended_description: stixWeaknessGen.genExtendedDescription(),
        likelihood: stixWeaknessGen.genLikelihood(),
        consequences: stixWeaknessGen.genConsequences()
    };

    // if (process.env.NODE_ENV === 'development') {
    //     logger.verbose('Writing to file...');
    //     fileHandler.setFileContent('entitiesTest.json', JSON.stringify(data, null, 4));
    //     logger.verbose('Writing to file... Done.');
    // }

    stixWeaknessGen.clear();
    return weakness;
}

function genRelationships(objects, SDOs) {
    let relationships = [];

    // Course of Actions mitigates Attack Patterns
    for (let attackPattern of SDOs.attack_patterns) {
        let courseOfActions = SDOs.course_of_actions.filter((e) => {
            return e.external_references[0].id === attackPattern.external_references[0].id;
        });
        let mitigationRelationships = stixRelationshipGen.genMitigationRelationships(attackPattern, courseOfActions);

        relationships = relationships.concat(mitigationRelationships);
    }

    // Attack Patterns targets Weaknesses
    for (let attackPattern of SDOs.attack_patterns) {
        let targetRelationships = stixRelationshipGen.genTargetRelationships(attackPattern, SDOs.weaknesses, objects);

        relationships = relationships.concat(targetRelationships);
    }

    return relationships;
}

module.exports = {
    genStixEntities
};

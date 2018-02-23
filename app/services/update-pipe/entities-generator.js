const fileHandler = require('../file-handler');
const stixAttackPatternGen = require('../stix/attack-pattern-generator');

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
 * In addition, these custom Data Objects (DOs) will be included:
 * 3. Weakness: Represents a weakness as fetched from CWE.
 *
 * And the relevant STIX Relationship Objects (SROs) created by this method are:
 * 1. Relationship.
 *
 * @param objects Contains the filtered and unfiltered objects from data sources.
 * @param cb Used to relay the generated entities back to the calling function.
 */
function genStixEntities(objects, cb) {
    const { attackPatterns, courseOfActions } = genAttackPatternsAndCourseOfActions(objects);
    const weaknesses = genWeaknesses(objects);
    const SDOs = {
        attackPatterns,
        courseOfActions,
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
    const courseOfActions = [];
    for (let capecObject of objects.capecObjectsFiltered) {
        attackPatterns.push(genAttackPatternFrom(capecObject));
        courseOfActions.concat(genCourseOfActionsFor(capecObject));
    }

    return {
        attackPatterns,
        courseOfActions
    };
}

function genAttackPatternFrom(capecObject) {
    stixAttackPatternGen.feed(capecObject);

    const attackPattern = stixAttackPatternGen.createEntity('attack-pattern');

    // Generated standard STIX properties
    attackPattern.name = stixAttackPatternGen.genName();

    attackPattern.description = stixAttackPatternGen.genDescription();
    attackPattern.external_references = stixAttackPatternGen.genExternalReferences();

    // Custom properties outside of STIX
    attackPattern.custom = {
        severity: stixAttackPatternGen.genSeverity(),
        likelihood: stixAttackPatternGen.genLikelihood(),
        injection_vector: stixAttackPatternGen.genInjectionVector(),
        payload: stixAttackPatternGen.genPayload(),
        activation_zone: stixAttackPatternGen.genActivationZone(),
        cia: stixAttackPatternGen.genCia()
    };

    if (process.env.NODE_ENV === 'development') {
        writeTestOutputToFile(capecObject);
    }

    stixAttackPatternGen.clear();
    return attackPattern;
}

function genCourseOfActionsFor(capecObject) {
}

function genCourseOfActionFrom(capecObjectMitigation) {
}

function genWeaknesses(objects) {
}

function genWeaknessFrom(cweObject) {
}

function genRelationships(objects, SDOs) {
}

function writeTestOutputToFile(data) {
    console.log('DEBUG Writing...');
    fileHandler.setFileContent('entitiesTest.json', JSON.stringify(data, null, 4));
    console.log('DEBUG Written.');
}

module.exports = {
    genStixEntities
};

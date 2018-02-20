const fileHandler = require('../file-handler');

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
function generateStixEntities(objects, cb) {
    const { attackPatterns, courseOfActions } = generateAttackPatternsAndCourseOfActions(objects);
    const weaknesses = generateWeaknesses(objects);
    const SDOs = {
        attackPatterns,
        courseOfActions,
        weaknesses
    };

    const relationships = generateRelationships(objects, SDOs);
    const SROs = {
        relationships
    };

    const entities = {
        SDOs,
        SROs
    };

    cb(entities);
}

function generateAttackPatternsAndCourseOfActions(objects) {
    const attackPatterns = [];
    const courseOfActions = [];
    for (let capecObject of objects.capecObjectsFiltered) {
        attackPatterns.push(generateAttackPatternFrom(capecObject));
        courseOfActions.concat(generateCourseOfActionsFor(capecObject));
    }

    return {
        attackPatterns,
        courseOfActions
    };
}

function generateAttackPatternFrom(capecObject) {
    const attackPattern = {};

    if (process.env.NODE_ENV === 'development') {
        writeTestOutputToFile(attackPattern);
    }

    return attackPattern;
}

function generateCourseOfActionsFor(capecObject) {
}

function generateCourseOfActionFrom(capecObjectMitigation) {
}

function generateWeaknesses(objects) {
}

function generateWeaknessFrom(cweObject) {
}

function generateRelationships(objects, SDOs) {
}

function writeTestOutputToFile(data) {
    console.log('DEBUG Writing...');
    fileHandler.setFileContent('entitiesTest.json', JSON.stringify(data, null, 4));
    console.log('DEBUG Written.');
}

module.exports = {
    generateStixEntities
};

const stixAssetGen = require('../stix-generators/asset-generator');
const stixAttackPatternGen = require('../stix-generators/attack-pattern-generator');
const stixCourseOfActionGen = require('../stix-generators/course-of-action-generator');
const stixGeneralGen = require('../stix-generators/general-generator');
const stixRelationshipGen = require('../stix-generators/relationship-generator');

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
 * And the relevant STIX Relationship Objects (SROs) created by this method are:
 * 1. Relationship.
 *
 * @param objects Contains the filtered and unfiltered objects from data sources.
 * @param cb Used to relay the generated entities back to the calling function.
 */
function genStixEntities(objects, cb) {
    const attackPatternObjects = objects.capecObjectsFiltered['capec:Attack_Pattern_Catalog']['capec:Attack_Patterns']['capec:Attack_Pattern'];
    const [attackPatterns, courseOfActions, assets] = genEntitiesFromAttackPatterns(attackPatternObjects);
    const SDOs = {
        attack_patterns: attackPatterns,
        course_of_actions: courseOfActions,
        assets: assets
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

function genEntitiesFromAttackPatterns(attackPatternObjects) {
    const attackPatterns = [];
    let courseOfActions = [];
    let assets = [];
    for (let capecObject of attackPatternObjects) {
        attackPatterns.push(genAttackPatternFrom(capecObject));

        const tempCourseOfActions = genCourseOfActionsFor(capecObject);
        if (tempCourseOfActions) {
            courseOfActions = courseOfActions.concat(tempCourseOfActions);
        }

        const tempAsset = genAssetFor(capecObject);
        if (tempAsset) {
            assets.push(tempAsset);
        }
    }

    return [
        attackPatterns,
        courseOfActions,
        assets
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
        steps: stixAttackPatternGen.genAttackSteps(),
        prerequisites: stixAttackPatternGen.genAttackPrerequisites(),
        severity: stixAttackPatternGen.genTypicalSeverity(),
        likelihood: stixAttackPatternGen.genTypicalLikelihoodOfExploit(),
        examples: stixAttackPatternGen.genExamplesInstances(),
        probing_techniques: stixAttackPatternGen.genProbingTechniques(),
        indicators: stixAttackPatternGen.genIndicatorsWarningsOfAttack(),
        motivations: stixAttackPatternGen.genAttackMotivationConsequences(),
        injection_vector: stixAttackPatternGen.genInjectionVector(),
        payload: stixAttackPatternGen.genPayload(),
        activation_zone: stixAttackPatternGen.genActivationZone(),
        impact: stixAttackPatternGen.genCiaImpact()
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

function genAssetFor(capecObject) {
    // Handle no assets or empty activation zone field
    const assetsObject = capecObject['capec:Activation_Zone'];
    if (!assetsObject || Object.keys(assetsObject).length === 0) {
        return null;
    }

    const id = capecObject['_attributes']['ID'];

    stixAssetGen.feed(assetsObject);

    const asset = stixGeneralGen.createEntity('asset');

    // Generated standard STIX properties
    asset.description = stixAssetGen.genAssetText();
    asset.external_references = stixGeneralGen.genMitreExternalReferences('capec', id);

    stixAssetGen.clear();
    return asset;
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

    return relationships;
}

module.exports = {
    genStixEntities
};

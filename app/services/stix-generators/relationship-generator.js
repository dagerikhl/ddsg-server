const stixGeneralGen = require('./general-generator');

function genMitigationRelationships(attackPattern, courseOfActions) {
    const relationships = [];
    for (let courseOfAction of courseOfActions) {
        let relationship = stixGeneralGen.createEntity('relationship');
        relationship.relationship_type = 'mitigates';
        relationship.source_ref = courseOfAction.id;
        relationship.target_ref = attackPattern.id;
        relationship.custom = null;

        relationships.push(relationship);
    }

    return relationships;
}

module.exports = {
    genMitigationRelationships
};

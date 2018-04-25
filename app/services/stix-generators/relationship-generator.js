const stixGeneralGen = require('./general-generator');

function genRelationshipOfType(type, source, relateds, reverse = false) {
    const relationships = [];
    for (let related of relateds) {
        let relationship = stixGeneralGen.createEntity('relationship');
        relationship.relationship_type = type;

        if (reverse) {
            relationship.source_ref = related.id;
            relationship.target_ref = source.id;
        } else {
            relationship.source_ref = source.id;
            relationship.target_ref = related.id;
        }

        relationship.custom = null;

        relationships.push(relationship);
    }

    return relationships;
}

module.exports = {
    genRelationshipOfType
};

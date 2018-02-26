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

function genTargetRelationships(attackPattern, allWeaknesses, objects) {
    const capecObject = objects.capecObjectsFiltered.filter((e) => {
        return e['_attributes']['ID'] === attackPattern.external_references[0].id.split('-')[1];
    })[0];

    let relatedWeaknesses = capecObject['capec:Related_Weaknesses']['capec:Related_Weakness'];

    // Make into array if not one to treat as general case after
    if (!(relatedWeaknesses instanceof Array)) {
        relatedWeaknesses = [relatedWeaknesses];
    }

    const relationships = [];
    for (let relatedWeakness of relatedWeaknesses) {
        let weakness = allWeaknesses.filter((e) => {
            // console.log(relatedWeakness);
            return e.external_references[0].id.split('-')[1] === relatedWeakness['capec:CWE_ID']['_text'];
        })[0];

        // Abort if no weakness was matched for the relationship
        if (!weakness) {
            break;
        }

        let relationship = stixGeneralGen.createEntity('relationship');
        relationship.relationship_type = 'targets';
        relationship.source_ref = attackPattern.id;
        relationship.target_ref = weakness.id;
        relationship.custom = {
            target_mode: relatedWeakness['capec:Weakness_Relationship_Type']['_text'].toLowerCase()
        };

        relationships.push(relationship);
    }

    return relationships;
}

module.exports = {
    genMitigationRelationships,
    genTargetRelationships
};

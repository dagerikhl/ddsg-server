const stixGeneralGen = require('./general-generator');

// Local state
let assetObject = null;

function feed(feedObject) {
    assetObject = feedObject;
}

function clear() {
    assetObject = null;
}

function genAssetText() {
    const text = stixGeneralGen.buildRecursiveText(assetObject);
    if (text && text.length > 0) {
        return text;
    }

    return null;
}

/**
 * This function only considers the data-set of assets filtered by the OWASP Top 10 list. This can be improved.
 * Returns null if it can not find a fitting category.
 *
 * TODO Improve the parsing this function does so it more intelligently assigns a category and handles bigger data sets.
 *
 * @param description The assets decriptive text, as parsed from CAPEC's field "activation zone".
 * @returns {string|null} A formatted string representing a generalized category of this asset.
 */
function categorize(description) {
    let descriptionString = description.join(' ');

    if (descriptionString.match(/client ?(machine|software|browser)/gi)) {
        return 'Client';
    } else if (descriptionString.match(/file ?system/gi)) {
        return 'File System';
    } else if (descriptionString.match(/server ?(side)? ?(function|func)/gi)) {
        return 'Server Side Function';
    } else if (descriptionString.match(/ldap/gi)) {
        return 'LDAP System';
    } else if (descriptionString.match(/(scripting|script) ?host/gi)) {
        return 'Scripting Host';
    } else if (descriptionString.match(/sessions? ?((handling|handler|management|mechanism|system) ?)+/gi)) {
        return 'Session Management System';
    } else if (descriptionString.match(/error? ?((handling|handler|management|mechanism|system) ?)+/gi)) {
        return 'Error Handling System';
    } else if (descriptionString.match(/(xml|json) ?(parser|handler)/gi)) {
        return 'Data Parser';
    } else if (descriptionString.match(/database/gi)) {
        return 'Database';
    } else if (descriptionString.match(/(email|e-mail|mail)/gi)) {
        return 'E-mail System';
    } else if (descriptionString.match(/overflow(ed)? ?.*buffer/gi)) {
        return 'Buffer';
    } else if (descriptionString.match(/config(uration) ?(files?|sources?)/gi)) {
        return 'Configuration File';
    } else if (descriptionString.match(/((commands?|requests?) ?)+ ?(interpreter|handler|system)/gi)) {
        return 'Command Interpreter';
    } else if (descriptionString.match(/(messages?|communications?)/gi)) {
        return 'Message';
    } else if (descriptionString.match(/(operati(ng|on) ?sys(tem)s?|os)/gi)) {
        return 'Operating System';
    }

    return null;
}

module.exports = {
    feed,
    clear,
    genAssetText,
    categorize
};

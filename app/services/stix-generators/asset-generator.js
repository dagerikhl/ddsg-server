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
 *
 * TODO Improve the parsing this function does so it more intelligently assigns a category and handles bigger data sets.
 *
 * @param description The assets decriptive text, as parsed from CAPEC's field "activation zone".
 * @returns {string | null} A formatted string representing a generalized category of this asset. null if not found.
 */
function categorize(description) {
    let d = description.join(' ');

    if (d.match(/client ?(machine|software|browser)/gi)) {
        return 'Client';
    } else if (d.match(/file ?system/gi)) {
        return 'File System';
    } else if (d.match(/server ?(side)? ?(function|func)/gi)) {
        return 'Server Side Function';
    } else if (d.match(/ldap/gi)) {
        return 'LDAP System';
    } else if (d.match(/(scripting|script) ?host/gi)) {
        return 'Scripting Host';
    } else if (d.match(/sessions? ?((handling|handler|management|mechanism|system) ?)+/gi)) {
        return 'Session Management System';
    } else if (d.match(/error? ?((handling|handler|management|mechanism|system) ?)+/gi)) {
        return 'Error Handling System';
    } else if (d.match(/(xml|json) ?(parser|handler)/gi)) {
        return 'Data Parser';
    } else if (d.match(/database/gi)) {
        return 'Database';
    } else if (d.match(/(email|e-mail|mail)/gi)) {
        return 'E-mail System';
    } else if (d.match(/overflow(ed)? ?.*buffer/gi)) {
        return 'Buffer';
    } else if (d.match(/config(uration) ?(files?|sources?)/gi)) {
        return 'Configuration File';
    } else if (d.match(/((commands?|requests?) ?)+ ?(interpreter|handler|system)/gi)) {
        return 'Command Interpreter';
    } else if (d.match(/(messages?|communications?)/gi)) {
        return 'Message';
    } else if (d.match(/(operati(ng|on) ?sys(tem)s?|os)/gi)) {
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

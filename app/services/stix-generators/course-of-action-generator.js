const stixGeneralGen = require('./general-generator');

// Local state
let mitigationObject = null;

function feed(feedObject) {
    mitigationObject = feedObject;
}

function clear() {
    mitigationObject = null;
}

function genMitigationText() {
    return stixGeneralGen.buildRecursiveText(mitigationObject);
}

/**
 * This function only considers the data-set of mitigations filtered by the OWASP Top 10 list. This can be improved.
 *
 * TODO Improve the parsing this function does so it more intelligently assigns a category and handles bigger data sets.
 *
 * @param description The assets decriptive text, as parsed from CAPEC's field "activation zone".
 * @returns {[string, string] | [null, null]} A formatted string representing a generalized category of this course of
 * action, and a formatted string representing the mitigation placed by taking this course of action. null if not found.
 */
function categorize(description) {
    let descriptionString = description.join(' ');

    if (descriptionString.match(/(roles?|(grant|deny) (users? )?access)+/gi)) {
        return [
            'Use Access Control List (ACL)',
            'Access Control List (ACL)'
        ];
    } else if (descriptionString.match(/(don't|do not).*(single security (mechanism|system|implementation))/gi)) {
        return [
            'Use Multiple Security Mechanisms',
            'Usage of Multiple Security Mechanisms'
        ];
    } else if (descriptionString.match(/(https|ssl|tsl|ssh|scp)/gi)) {
        return [
            'Encrypt Communication with SSL, TSL, SSH, SCP, or others',
            'Encrypted Communication Channels'
        ];
    } else if (descriptionString.match(/(modify|change|alter).*session tokens?/gi)) {
        return [
            'Implement Modification of Session Tokens',
            'Session Token Modificator'
        ];
    } else if (descriptionString.match(/(prevent|disable|turn off|avoid|(do not|don't) allow).*script(ing|s)?/gi)) {
        return [
            'Disable Script Execution',
            'Script Disabler'
        ];
    } else if (descriptionString.match(
        /((powerful|strong|tough).*(input|text|string) ?validation)|(validate (input|text|string)s?.*strongly)/gi)) {
        return [
            'Strongly Validate Input',
            'Strong Input Validator'
        ];
    } else if (descriptionString.match(
        /(((input|text|string) ?validation)|(validate (.*user.*)(input|text|string)s?))|(treat.*inputs?.*guilty)/gi)) {
        return [
            'Validate Input',
            'Input Validator'
        ];
    } else if (descriptionString.match(/validation|validate/gi)) {
        return [
            'Validate',
            'Validator'
        ];
    } else if (descriptionString.match(/(privilege?|restrict|trust|secure)(ed)?/gi)) {
        return [
            'Restrict Privileged Areas',
            'Privileged Zone Restrictor'
        ];
    } else if (descriptionString.match(/encod(e|ing)/gi)) {
        return [
            'Encode Input/Output',
            'Input/Output Encoder'
        ];
    } else if (descriptionString.match(/(disable|turn off|remove).*mssql/gi)) {
        return [
            'Disable MSSQL',
            'MSSQL Disabler'
        ];
    } else if (descriptionString.match(/(data|files?) ?access/gi)) {
        return [
            'Restrict Data Access',
            'Data Access Restrictor'
        ];
    } else if (descriptionString.match(/up[- ]?to[- ]?date|updates?|patch(ing)?/gi)) {
        return [
            'Keep System Up To Date',
            'System Updater'
        ];
    } else if (descriptionString.match(/not.*file[- ]?(name|content|type)s?/gi)) {
        return [
            'Avoid Basing Logic on File-types',
            'Don\'t Base Logic on File-types'
        ];
    } else if (descriptionString.match(/parameters?.*bind(ing)?/gi)) {
        return [
            'Bind Parameters',
            'Parameter Binder'
        ];
    } else if (descriptionString.match(/secret ?spaces?/gi)) {
        return [
            'Allow Many Possible Secrets',
            'Large Secret Space'
        ];
    } else if (descriptionString.match(/(secrets?)?.*external ?auth(orit(y|ies)|)?.*(secrets?)?/gi)) {
        return [
            'Check Secrets Against External Authority',
            'External Authority Secret Checks'
        ];
    } else if (descriptionString.match(/access ?control/gi)) {
        return [
            'Configure Access Control',
            'Access Controller'
        ];
    } else if (descriptionString.match(/prox(y|ies)/gi)) {
        return [
            'Use Proxy Communication',
            'Communication Proxy'
        ];
    } else if (descriptionString.match(/(monitor|watch|check)?.*integrity.*(monitor(ing)?s?)?/gi)) {
        return [
            'Monitor Integrity',
            'Integrity Monitor'
        ];
    } else if (descriptionString.match(/(do|perform|initiate).*test(ing)?.*(for|to)/gi)) {
        return [
            'Scan or Test for Vulnerabilities',
            'Vulnerability Scanner'
        ];
    } else if (descriptionString.match(/indirect ?references?/gi)) {
        return [
            'Use Indirect References',
            'Indirect Referencer'
        ];
    } else if (descriptionString.match(/blank ?index.?html?/gi)) {
        return [
            'Use Blank index.html',
            'Blank index.html'
        ];
    } else if (descriptionString.match(/(prevent|disable|prohibit).*htaccess/gi)) {
        return [
            'Prevent With .htaccess',
            '.htaccess File'
        ];
    } else if (descriptionString.match(/suppress(ing) ?error ?(messages?)?/gi)) {
        return [
            'Suppress Error Messages',
            'Error Message Suppressor'
        ];
    } else if (descriptionString.match(/env(ironment) (file|variable)s?/gi)) {
        return [
            'Protect Environment Variables',
            'Environment Variable Protector'
        ];
    } else if (descriptionString.match(/config(uration)s? (file|variable)s?/gi)) {
        return [
            'Protect Configuration Files',
            'Configuration Protector'
        ];
    } else if (descriptionString.match(/(assume|assumption|foresee).*((malicious|destructive|dangerous)|inputs?)+/gi)) {
        return [
            'Assume Input is Malicious',
            'Input is Malicious Assumption'
        ];
    } else if (descriptionString.match(/(minimize|limit).*(switch(es)?|options?)/gi)) {
        return [
            'Minimize Switches and Options',
            'Minimal Switches and Options'
        ];
    } else if (descriptionString.match(/(remove|disable|delete).*test(ing)?.*prod(uction)?/gi)) {
        return [
            'Delete Debug Testing in Production',
            'No Debug Testing in Production'
        ];
    } else if (descriptionString.match(/type ?conversion/gi)) {
        return [
            'Use Type Conversion',
            'Type Converter'
        ];
    } else if (descriptionString.match(/authenticat(e|ion)/gi)) {
        return [
            'Authenticate Users',
            'Authenticator'
        ];
    } else if (descriptionString.match(/cryptographic|encryption.*data/gi)) {
        return [
            'Encrypt Data',
            'Data Encrypter'
        ];
    } else if (descriptionString.match(/(sanitize[sd]?.*contents?)|(contents?.*sanitize[sd]?)/gi)) {
        return [
            'Sanitize Content',
            'Content Sanitizer'
        ];
    } else if (descriptionString.match(/(difficult.*)?session ?(tokens?|ids?|keys?)(.*difficult)?/gi)) {
        return [
            'Use Strong Session Tokens',
            'Strong Session Token Checker'
        ];
    } else if (descriptionString.match(/session ?(tokens?|ids?|keys?)/gi)) {
        return [
            'Use Session Tokens',
            'Session Token Checker'
        ];
    } else if (descriptionString.match(/key (spaces? ?)?(sizes?|search(es)?)/gi)) {
        return [
            'Use Sufficiently Complex Decryption Key',
            'Complex Decryption Key'
        ];
    } else if (descriptionString.match(/saml/gi)) {
        return [
            'Use Security Assertion Markup Language (SAML) for Communication',
            'Security Assertion Markup Language (SAML) Communication'
        ];
    } else if (descriptionString.match(/code ?book/gi)) {
        return [
            'Use a Code Book',
            'Code Book'
        ];
    } else if (descriptionString.match(/(hide|obfuscate|customiz(e|ing)).*(http|api('s)?|cookies?)/gi)) {
        return [
            'Hide Data',
            'Data Hider'
        ];
    } else if (descriptionString.match(/(scan|search for) virus(es)?|anti[- ]?virus|virus (scanning|searching)/gi)) {
        return [
            'Install Anti-virus Software',
            'Anti-virus Software'
        ];
    } else if (descriptionString.match(/(robust|strong|tough).*xml.*parser/gi)) {
        return [
            'Use a Strong XML Parser',
            'Strong XML Parser'
        ];
    } else if (descriptionString.match(/(e-mail|email|mail).*filter(ing|s)/gi)) {
        return [
            'Filter E-mail',
            'E-mail Filterer'
        ];
    } else if (descriptionString.match(/symbolic links?|symlinks?/gi)) {
        return [
            'Check for Symbolic Links',
            'Symbolic Link Checker'
        ];
    } else if (descriptionString.match(
        /buffers?.*(overflow(ed|s)?|check ?(the )?size)|(overflow(ed|s)?|check ?(the )?size).*buffers?/gi)) {
        return [
            'Prevent Buffer Overflow',
            'Buffer Overflow Preventor'
        ];
    } else if (descriptionString.match(/check(s|ing)? bounds?|bounds? check(s|ing)?/gi)) {
        return [
            'Check Buffer Bounds',
            'Buffer Bounds Checker'
        ];
    } else if (descriptionString.match(/(dangerous|risky|riskful|tricky).* api/gi)) {
        return [
            'Avoid Risky APIs',
            'API Risk Checker'
        ];
    } else if (descriptionString.match(/sha(ke)?[- ]?\d+(\/\d+)?|strong ?hash/gi)) {
        return [
            'Use Strong Hash Algorithms (like SHA-256 or SHA-512)',
            'Strong Hash Algorithm (like SHA-256 or SHA-512)'
        ];
    } else if (descriptionString.match(/users?.*log ?out|log ?out.*users?/gi)) {
        return [
            'Force Users to Logout',
            'Logout Forcer'
        ];
    } else if (descriptionString.match(/secur(e|ity) questions?/gi)) {
        return [
            'Use Security Questions for Password Recovery',
            'Security Questions'
        ];
    } else if (descriptionString.match(/(e-mail|email|mail).*(temp(orary)? )?password/gi)) {
        return [
            'E-mail Temporary Password instead of Doing it Online',
            'Temporary Password Sent By E-mail'
        ];
    } else if (descriptionString.match(
        /hmac|keyed-hash message authentication code|hash-based message authentication code/gi)) {
        return [
            'Use Hashed Message Authentication Code (HMAC) to Verify Messages',
            'HMAC Verifier'
        ];
    } else if (descriptionString.match(/audit ?log(ger)?/gi)) {
        return [
            'Implement an Audit Log',
            'Audit Log'
        ];
    } else if (descriptionString.match(/(weak|bad|silly|useless).*encryption/gi)) {
        return [
            'Prevent Weak Encryption',
            'Weak Encryption Preventer'
        ];
    } else if (descriptionString.match(/sim.{0,10}card/gi)) {
        return [
            'Upgrade SIM Card Algorithm',
            'Strong SIM Card Algorithm'
        ];
    } else if (descriptionString.match(/(do( not|n't)|avoid).*us(e|ing).*get.*post/gi)) {
        return [
            'Use POST- over GET-requests for Submitting Data',
            'POST-requests for Submitting Data'
        ];
    } else if (descriptionString.match(/(encod|decod)(e|ing).*(urls?|param(eters?|s)?)/gi)) {
        return [
            'Encode/Decode URL or Parameters Safely',
            'Safe URL and Parameter Encoder/Decoder'
        ];
    } else if (descriptionString.match(/efkwaefnwerjfadawejkldadklawejkldnwefwerfawdjawedwejndw/gi)) {
        return [
            '',
            ''
        ];
    } else if (descriptionString.match(/efkwaefnwerjfadawejkldadklawejkldnwefwerfawdjawedwejndw/gi)) {
        return [
            '',
            ''
        ];
    } else if (descriptionString.match(/efkwaefnwerjfadawejkldadklawejkldnwefwerfawdjawedwejndw/gi)) {
        return [
            '',
            ''
        ];
    } else if (descriptionString.match(/efkwaefnwerjfadawejkldadklawejkldnwefwerfawdjawedwejndw/gi)) {
        return [
            '',
            ''
        ];
    } else if (descriptionString.match(/efkwaefnwerjfadawejkldadklawejkldnwefwerfawdjawedwejndw/gi)) {
        return [
            '',
            ''
        ];
    } else if (descriptionString.match(/efkwaefnwerjfadawejkldadklawejkldnwefwerfawdjawedwejndw/gi)) {
        return [
            '',
            ''
        ];
    }

    return [
        null,
        null
    ];
}

module.exports = {
    feed,
    clear,
    genMitigationText,
    categorize
};

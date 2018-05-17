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
    let d = description.join(' ');

    if (d.match(/(roles?|(grant|deny) (users? )?access)+/gi)) {
        return [
            'Use access control list (ACL)',
            'Access control list (ACL)'
        ];
    } else if (d.match(/(don't|do not).*(single security (mechanism|system|implementation))/gi)) {
        return [
            'Use multiple security mechanisms',
            'Usage of multiple security mechanisms'
        ];
    } else if (d.match(/(https|ssl|tsl|ssh|scp)|(encrypt (all)? ?communications?)/gi)) {
        return [
            'Encrypt communication (with SSL, TSL, SSH, SCP, or others)',
            'Encrypted communication channels'
        ];
    } else if (d.match(/(modify|change|alter).*session tokens?/gi)) {
        return [
            'Implement modification of session tokens',
            'Session token modificator'
        ];
    } else if (d.match(/(prevent|disable|turn off|avoid|(do not|don't) allow).*script(ing|s)?/gi)) {
        return [
            'Disable script execution',
            'Script disabler'
        ];
    } else if (d.match(
        /((powerful|strong|tough).*(input|text|string) ?validation)|(validate (input|text|string)s?.*strongly)/gi)) {
        return [
            'Strongly validate input',
            'Strong input validator'
        ];
    } else if (d.match(
        /(((input|text|string) ?validation)|(validate (.*user.*)(input|text|string)s?))|(treat.*inputs?.*guilty)/gi)) {
        return [
            'Validate input',
            'Input validator'
        ];
    } else if (d.match(/validation|validate/gi)) {
        return [
            'Validate',
            'Validator'
        ];
    } else if (d.match(/(privilege?|restrict|trust|secure)(ed)?/gi)) {
        return [
            'Restrict privileged areas',
            'Privileged zone restrictor'
        ];
    } else if (d.match(/encod(e|ing)/gi)) {
        return [
            'Encode input/output',
            'Input/output encoder'
        ];
    } else if (d.match(/(disable|turn off|remove).*mssql/gi)) {
        return [
            'Disable MSSQL',
            'MSSQL disabler'
        ];
    } else if (d.match(/(data|files?) ?access/gi)) {
        return [
            'Restrict data access',
            'Data access restrictor'
        ];
    } else if (d.match(/up[- ]?to[- ]?date|updates?|patch(ing)?/gi)) {
        return [
            'Keep system up to date',
            'System updater'
        ];
    } else if (d.match(/not.*file[- ]?(name|content|type)s?/gi)) {
        return [
            'Avoid basing logic on file-types',
            'Don\'t base logic on file-types'
        ];
    } else if (d.match(/parameters?.*bind(ing)?/gi)) {
        return [
            'Bind parameters',
            'Parameter binder'
        ];
    } else if (d.match(/secret ?spaces?/gi)) {
        return [
            'Allow many possible secrets',
            'Large secret space'
        ];
    } else if (d.match(/(secrets?)?.*external ?auth(orit(y|ies)|)?.*(secrets?)?/gi)) {
        return [
            'Check secrets against external authority',
            'External authority secret checks'
        ];
    } else if (d.match(/access ?control/gi)) {
        return [
            'Configure access control',
            'Access controller'
        ];
    } else if (d.match(/prox(y|ies)/gi)) {
        return [
            'Use proxy communication',
            'Communication proxy'
        ];
    } else if (d.match(/(monitor|watch|check)?.*integrity.*(monitor(ing)?s?)?/gi)) {
        return [
            'Monitor integrity',
            'Integrity monitor'
        ];
    } else if (d.match(/(do|perform|initiate).*test(ing)?.*(for|to)/gi)) {
        return [
            'Scan or test for vulnerabilities',
            'Vulnerability scanner'
        ];
    } else if (d.match(/indirect ?references?/gi)) {
        return [
            'Use indirect references',
            'Indirect referencer'
        ];
    } else if (d.match(/blank ?index.?html?/gi)) {
        return [
            'Use blank index.html',
            'Blank index.html'
        ];
    } else if (d.match(/(prevent|disable|prohibit).*htaccess/gi)) {
        return [
            'Prevent with .htaccess',
            '.htaccess file'
        ];
    } else if (d.match(/suppress(ing) ?error ?(messages?)?/gi)) {
        return [
            'Suppress error messages',
            'Error message suppressor'
        ];
    } else if (d.match(/env(ironment) (file|variable)s?/gi)) {
        return [
            'Protect environment variables',
            'Environment variable protector'
        ];
    } else if (d.match(/config(uration)s? (file|variable)s?/gi)) {
        return [
            'Protect configuration files',
            'Configuration protector'
        ];
    } else if (d.match(/(assume|assumption|foresee).*((malicious|destructive|dangerous)|inputs?)+/gi)) {
        return [
            'Assume input is malicious',
            'Input is malicious assumption'
        ];
    } else if (d.match(/(minimize|limit).*(switch(es)?|options?)/gi)) {
        return [
            'Minimize switches and options',
            'Minimal switches and options'
        ];
    } else if (d.match(/(remove|disable|delete).*test(ing)?.*prod(uction)?/gi)) {
        return [
            'Delete debug testing in production',
            'No debug testing in production'
        ];
    } else if (d.match(/type ?conversion/gi)) {
        return [
            'Use type conversion',
            'Type converter'
        ];
    } else if (d.match(/authenticat(e|ion)/gi)) {
        return [
            'Authenticate users',
            'Authenticator'
        ];
    } else if (d.match(/cryptographic|encryption.*data/gi)) {
        return [
            'Encrypt data',
            'Data encrypter'
        ];
    } else if (d.match(/(sanitize[sd]?.*contents?)|(contents?.*sanitize[sd]?)/gi)) {
        return [
            'Sanitize content',
            'Content sanitizer'
        ];
    } else if (d.match(/(difficult.*)?session ?(tokens?|ids?|keys?)(.*difficult)?/gi)) {
        return [
            'Use strong session tokens',
            'Strong session token checker'
        ];
    } else if (d.match(/session ?(tokens?|ids?|keys?)/gi)) {
        return [
            'Use session tokens',
            'Session token checker'
        ];
    } else if (d.match(/key (spaces? ?)?(sizes?|search(es)?)/gi)) {
        return [
            'Use sufficiently complex decryption key',
            'Complex decryption key'
        ];
    } else if (d.match(/saml/gi)) {
        return [
            'Use security assertion markup language (SAML) for communication',
            'Security assertion markup language (SAML) communication'
        ];
    } else if (d.match(/code ?book/gi)) {
        return [
            'Use a code book',
            'Code book'
        ];
    } else if (d.match(/(hide|obfuscate|customiz(e|ing)).*(http|api('s)?|cookies?)/gi)) {
        return [
            'Hide data',
            'Data hider'
        ];
    } else if (d.match(/(scan|search for) virus(es)?|anti[- ]?virus|virus (scanning|searching)/gi)) {
        return [
            'Install anti-virus software',
            'Anti-virus software'
        ];
    } else if (d.match(/(robust|strong|tough).*xml.*parser/gi)) {
        return [
            'Use a strong XML parser',
            'Strong XML parser'
        ];
    } else if (d.match(/(e-mail|email|mail).*filter(ing|s)/gi)) {
        return [
            'Filter e-mail',
            'E-mail filterer'
        ];
    } else if (d.match(/symbolic links?|symlinks?/gi)) {
        return [
            'Check for symbolic links',
            'Symbolic link checker'
        ];
    } else if (d.match(/buffers?.*(overflow(ed|s)?|check ?(the )?size)|(overflow(ed|s)?|check ?(the )?size).*buffers?/gi)) {
        return [
            'Prevent buffer overflow',
            'Buffer overflow preventor'
        ];
    } else if (d.match(/check(s|ing)? bounds?|bounds? check(s|ing)?/gi)) {
        return [
            'Check buffer bounds',
            'Buffer bounds checker'
        ];
    } else if (d.match(/(dangerous|risky|riskful|tricky).* api/gi)) {
        return [
            'Avoid risky APIs',
            'API risk checker'
        ];
    } else if (d.match(/sha(ke)?[- ]?\d+(\/\d+)?|strong ?hash/gi)) {
        return [
            'Use strong hash algorithms (like SHA-256 or SHA-512)',
            'Strong hash algorithm (like SHA-256 or SHA-512)'
        ];
    } else if (d.match(/users?.*log ?out|log ?out.*users?/gi)) {
        return [
            'Force users to logout',
            'Logout forcer'
        ];
    } else if (d.match(/secur(e|ity) questions?/gi)) {
        return [
            'Use security questions for password recovery',
            'Security questions'
        ];
    } else if (d.match(/(e-mail|email|mail).*(temp(orary)? )?password/gi)) {
        return [
            'E-mail temporary password instead of doing it online',
            'Temporary password sent by e-mail'
        ];
    } else if (d.match(/hmac|keyed-hash message authentication code|hash-based message authentication code/gi)) {
        return [
            'Use hashed message authentication code (HMAC) to verify messages',
            'HMAC verifier'
        ];
    } else if (d.match(/audit ?log(ger)?/gi)) {
        return [
            'Implement an audit log',
            'Audit log'
        ];
    } else if (d.match(/(weak|bad|silly|useless).*encryption/gi)) {
        return [
            'Prevent weak encryption',
            'Weak encryption preventer'
        ];
    } else if (d.match(/sim.{0,10}card/gi)) {
        return [
            'Upgrade SIM card algorithm',
            'Strong SIM card algorithm'
        ];
    } else if (d.match(/(do( not|n't)|avoid).*us(e|ing).*get.*post/gi)) {
        return [
            'Use POST- over GET-requests for submitting data',
            'POST-requests for submitting data'
        ];
    } else if (d.match(/(encod|decod)(e|ing).*(urls?|param(eters?|s)?)/gi)) {
        return [
            'Encode/decode URL or parameters safely',
            'Safe URL and parameter encoder/decoder'
        ];
    } else if (d.match(/paths?.*(encod|decod)(e|ing)|(encod|decod)(e|ing).*paths?/gi)) {
        return [
            'Encode/decode URL or parameters safely',
            'Safe URL and parameter encoder/decoder'
        ];
    } else if (d.match(/scan (http|url) ?requests?/gi)) {
        return [
            'Scan for valid URL',
            'URL scanner'
        ];
    } else if (d.match(/(detect|scan for|search( for)?|discover) (the)? ?sniffers?/gi)) {
        return [
            'Scan for network sniffer',
            'Network sniffer scanner'
        ];
    } else if (d.match(/(never|do(n't| not)|avoid).*(own|private|self[- ]?made) (encryption|cryptography)/gi)) {
        return [
            'Avoid self-made cryptography',
            'No self-made cryptography'
        ];
    } else if (d.match(/security ?(by ?)?obscurity.*inject(ion)?/gi)) {
        return [
            'Don\'t rely on security by obscurity for to avoid injection',
            'Don\'t use security by obscurity for injection'
        ];
    } else if (d.match(/config(uration)?s?.*(separate|memory|space|cd|process|device).*(config(uration)?s?)?/gi)) {
        return [
            'Use separate storing of configuration',
            'Store configuration separately'
        ];
    } else if (d.match(/(separate|divide) (the)? ?(presentation|business)[- ]?layers?.*(separate|divided)?/gi)) {
        return [
            'Separate the business and presentation layers',
            'Separate business and presentation layers'
        ];
    } else if (d.match(/encapsulat(e|ion)/gi)) {
        return [
            'Encapsulate variables',
            'Encapsulated variables'
        ];
    } else if (d.match(/backslash(ed|es)?.*escape[ds]?/gi)) {
        return [
            'Verify escaped characters',
            'Escaped character verifier'
        ];
    } else if (d.match(/(not|avoid|do(n't| not)|never).*hard[- ]?cod(e|ing)/gi)) {
        return [
            'Avoid hard-coding',
            'No hard-coding'
        ];
    } else if (d.match(/languages? ?apis?.*(os'?|operati(ng|on) ?sys(tem)?).*commands?/gi)) {
        return [
            'Use language APIs over OS commands',
            'Language APIs used over OS commands'
        ];
    } else if (d.match(
        /(filter|remove|delete).*(data|parameter|string)s?.*(os'?|operati(ng|on) ?sys(tem)?).*commands?/gi)) {
        return [
            'Filter out potential OS commands',
            'OS command filterer'
        ];
    } else if (d.match(/public ?(key)?.*sign(ed)?|sign(ed)?.*public ?(key)?/gi)) {
        return [
            'Sign public key',
            'Public key signer'
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

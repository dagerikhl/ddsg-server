const fs = require('fs');
const gulp = require('gulp');
const gulpZip = require('gulp-zip');
const minimist = require('minimist');
const path = require('path');

const knownOptions = {
    string: [
        'packageName',
        'packagePath'
    ],
    default: {
        packageName: 'Package.zip',
        packagePath: path.join(__dirname, '_package')
    }
};
const options = minimist(process.argv.slice(2), knownOptions);

gulp.task('default', function () {
    const packagePaths = [
        '**',
        '!**/_package/**',
        '!_package',
        '!gulpfile.js'
    ];

    // Add exclusion patterns for all dev dependencies
    const packageJSON = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
    const devDeps = packageJSON.devDependencies;

    for (let propName in devDeps) {
        const excludePattern1 = '!**/node_modules/' + propName + '/**';
        const excludePattern2 = '!**/node_modules/' + propName;
        packagePaths.push(excludePattern1);
        packagePaths.push(excludePattern2);
    }

    return gulp.src(packagePaths)
        .pipe(gulpZip(options.packageName))
        .pipe(gulp.dest(options.packagePath));
});

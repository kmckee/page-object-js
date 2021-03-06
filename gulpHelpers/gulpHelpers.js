var gulp        = require("gulp"),
    sourcemaps  = require("gulp-sourcemaps"),
    mergeStream = require('merge-stream'),
    q           = require("q");

module.exports = {};

module.exports.streamToPromise = function streamToPromise(stream) {
    "use strict";

    var dfd = q.defer();

    stream.once("error", function (err) {
        dfd.reject(err);
    });

    stream.once("end", function () {
        dfd.resolve();
    });

    return dfd.promise;
};


module.exports.buildTypeScript = function buildTypeScript(srcGlobs, jsOutputDir, typingsOutputDir) {
    "use strict";

    var ts           = require('gulp-typescript'),
        tsHelpers    = require('gulpTsHelpers'),
        tsResults,
        merged,
        tsPromise;

    tsResults = gulp.src(srcGlobs /*, {base: 'src'}*/)
        .pipe(sourcemaps.init())
        .pipe(ts({
                target:            'ES5',
                declarationFiles:  true,
                noExternalResolve: false,
                noEmitOnError:     true,
                module:            'commonjs'
            },
            undefined,
            ts.reporter.longReporter()));

    merged = mergeStream(
        tsResults.dts.pipe(gulp.dest(typingsOutputDir)),
        tsResults.js.pipe(sourcemaps.write())
            .pipe(gulp.dest(jsOutputDir))
    );

    tsPromise = tsHelpers.processTsResults(tsResults, merged);
    return tsPromise;
};

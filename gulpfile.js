var gulp        = require("gulp"),
    gulpHelpers = require("./gulpHelpers/gulpHelpers"),
    sourcemaps  = require("gulp-sourcemaps"),
    path        = require("path"),
    q           = require("q"),
    chalk       = require('chalk'),
    fs          = require("node-fs-extra");


////////////////////////////////////////////////////////////////////////////////
// default
////////////////////////////////////////////////////////////////////////////////
gulp.task("default", ["usage"], function () {
});


////////////////////////////////////////////////////////////////////////////////
// usage
////////////////////////////////////////////////////////////////////////////////
gulp.task(
    "usage",
    function () {
        "use strict";

        var lines = [
            chalk.green("gulp [usage]"),
            "    Show this usage information",
            "",
            chalk.green("gulp clean"),
            "    Delete all generated files.  You must run 'npm run setup'",
            "    to setup the project once again.",
            "",
            chalk.green("gulp ut"),
            "    Build and run the unit tests",
            "",
            chalk.green("gulp buildRelease"),
            "    Builds a release.",
            "",
            chalk.green("gulp cukes"),
            "    Starts the sample server and runs the cukes.",
            ""
        ];

        console.log(lines.join("\n"));
    }
);

////////////////////////////////////////////////////////////////////////////////
// clean
////////////////////////////////////////////////////////////////////////////////
gulp.task(
    "clean",
    function (cb) {
        "use strict";

        var del = require("del"),
            dirsToDelete = [
                "dist",
                "typings",
                "node_modules",
                "tmp"
            ];

        del(dirsToDelete, cb);
    }
);


////////////////////////////////////////////////////////////////////////////////
// tslint
////////////////////////////////////////////////////////////////////////////////
gulp.task(
    "tslint", function () {
        "use strict";

        var tslint = require("gulp-tslint"),
            tsSources = getTypeScriptSourceGlobs(true, false);

        return gulp.src(tsSources)
            .pipe(tslint())
            .pipe(tslint.report("verbose"));
    }
);


////////////////////////////////////////////////////////////////////////////////
// build
////////////////////////////////////////////////////////////////////////////////
gulp.task(
    "build",
    ["tslint"],
    function () {
        "use strict";

        var outputDir = path.join(__dirname, "dist");

        fs.removeSync(outputDir);

        return gulpHelpers.buildTypeScript(
            getTypeScriptSourceGlobs(false, true), outputDir, outputDir);
    }
);


////////////////////////////////////////////////////////////////////////////////
// ut
////////////////////////////////////////////////////////////////////////////////
gulp.task(
    "ut",
    ["tslint"],
    function () {
        "use strict";

        var outDir = path.join(__dirname, "tmp", "ut");

        fs.removeSync(outDir);

        return gulpHelpers.buildTypeScript(
            getTypeScriptSourceGlobs(true, true), outDir, outDir)
            .then(function () {
                var tape   = require("gulp-tape"),
                    faucet = require("faucet"),
                    stream;

                stream = gulp.src(outDir + "/**/*.spec.js")
                    .pipe(tape({reporter: faucet()}));

                return gulpHelpers.streamToPromise(stream);
            });
    }
);


////////////////////////////////////////////////////////////////////////////////
// cukes
////////////////////////////////////////////////////////////////////////////////
gulp.task(
    "cukes",
    ["build"],
    function () {
        "use strict";

        //
        // Copy dist folders into testProject as if they were installed
        // using npm.
        //
        fs.removeSync("testProject/node_modules/page-object-js");
        fs.copySync("dist", "testProject/node_modules/page-object-js/dist");
        fs.copySync("package.json",
            "testProject/node_modules/page-object-js/package.json");

        //
        // Invoke testProject's cuke task.
        //
        return exec(
            "gulp cukes",
            {cwd: path.join(__dirname, "testProject")}
        );



    }
);


////////////////////////////////////////////////////////////////////////////////
// Helper Functions
////////////////////////////////////////////////////////////////////////////////

function getTypeScriptSourceGlobs(includeSpecs, includeTypings) {
    "use strict";

    var tsSources = ["src/**/*.ts"];

    if (!includeSpecs) {
        tsSources.push("!src/**/*.spec.ts");
    }

    if (includeTypings) {
        tsSources.push("typings/main.d.ts");
        tsSources.push("typings/main/**/*.d.ts");
    }

    return tsSources;
}

// Just like Node's child_process.exec(), but returns a promise.  The promise is is
// fulfilled (with stdout) when the process exits successfully.  The promise is reject
// with an Error object otherwise.
function exec(command, options) {
    "use strict";

    var nodeExec = require("child_process").exec,
        child,
        dfd = q.defer();

    nodeExec(command, options, function (err, stdout, stderr) {
        if (err) {
            console.log(stderr);
            dfd.reject(err);
            return;
        }

        console.log(stdout);
        dfd.resolve(stdout);
    });

    return dfd.promise;

}
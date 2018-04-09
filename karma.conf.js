module.exports = function(config) {
    config.set({

        // base path, that will be used to resolve files and exclude
        basePath: '',

        // frameworks to use
        frameworks: ['mocha'],


        // list of files / patterns to load in the browser
        files: [
            'node_modules/es6-shim/es6-shim.js',
            'node_modules/jquery/dist/jquery.js',
            'node_modules/react/umd/react.development.js',
            'node_modules/react-dom/umd/react-dom.development.js',
            'node_modules/react-dom/umd/react-dom-test-utils.development.js',
            'node_modules/prop-types/prop-types.js',
            'node_modules/chai/chai.js',
            'node_modules/chai-jquery/chai-jquery.js',
            'build/reactable.js',
            'build/tests/*.js',
        ],


        // list of files to exclude
        exclude: [ ],


        // test results reporter to use
        // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
        reporters: [ process.env.CI === 'true' ? 'spec' : 'dots'],

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_WARN,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera (has to be installed with `npm install karma-opera-launcher`)
        // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
        // - PhantomJS
        // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
        browsers: ['PhantomJS'],

        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: true
    });
};



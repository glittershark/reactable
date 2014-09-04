module.exports = function(grunt) {
    grunt.initConfig({
        watch: {
            build: {
                files: ['src/**/*.jsx'],
                tasks: ['build']
            },
            test: {
                files: ['src/**/*.jsx', 'tests/*.jsx'],
                tasks: ['testOnce']
            }
        },
        react: {
            compile: {
                files: {
                    'build/reactable.js': 'src/reactable.jsx',
                    'build/tests/reactable_test.js': 'tests/reactable_test.jsx'
                }
            }
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-react');
    grunt.loadNpmTasks('grunt-karma');

    grunt.registerTask('testOnce', ['build', 'karma']);
    grunt.registerTask('test', ['testOnce', 'watch:test']);

    grunt.registerTask('build', ['react']);
    grunt.registerTask('default', ['build', 'watch:build']);
};


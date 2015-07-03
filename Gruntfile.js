module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

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
        babel: {
            options: {
                sourceRoot: 'src',
                modules: 'umdStrict'
            },
            compile: {
                files: {
                    'tmp/reactable/lib/to_array.js': 'src/reactable/lib/to_array.jsx',
                    'tmp/reactable/lib/filter_props_from.js': 'src/reactable/lib/filter_props_from.jsx',
                    'tmp/reactable/lib/extract_data_from.js': 'src/reactable/lib/extract_data_from.jsx',
                    'tmp/reactable/lib/is_react_component.js': 'src/reactable/lib/is_react_component.jsx',
                    'tmp/reactable/lib/stringable.js': 'src/reactable/lib/stringable.jsx',
                    'tmp/reactable/filterer.js': 'src/reactable/filterer.jsx',
                    'tmp/reactable/sort.js': 'src/reactable/sort.jsx',
                    'tmp/reactable/td.js': 'src/reactable/td.jsx',
                    'tmp/reactable/tr.js': 'src/reactable/tr.jsx',
                    'tmp/reactable/thead.js': 'src/reactable/thead.jsx',
                    'tmp/reactable/unsafe.js': 'src/reactable/unsafe.jsx',
                    'tmp/reactable/th.js': 'src/reactable/th.jsx',
                    'tmp/reactable/paginator.js': 'src/reactable/paginator.jsx',
                    'tmp/reactable/table.js': 'src/reactable/table.jsx',

                    'tmp/reactable.js': 'src/reactable.jsx',

                    'build/tests/reactable_test.js': 'tests/reactable_test.jsx'
                }
            }
        },
        concat: {
            dist: {
                src: [
                    'tmp/reactable/lib/filter_props_from.js',
                    'tmp/reactable/lib/to_array.js',
                    'tmp/reactable/lib/stringable.js',
                    'tmp/reactable/lib/extract_data_from.js',
                    'tmp/reactable/lib/is_react_component.js',
                    'tmp/reactable/unsafe.js',
                    'tmp/reactable/filterer.js',
                    'tmp/reactable/sort.js',
                    'tmp/reactable/td.js',
                    'tmp/reactable/tr.js',
                    'tmp/reactable/th.js',
                    'tmp/reactable/thead.js',
                    'tmp/reactable/paginator.js',
                    'tmp/reactable/table.js',
                    'tmp/reactable.js'
                ],
                dest: 'build/reactable.js'
            }
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        }
    });

    grunt.registerTask('testOnce', ['build', 'karma']);
    grunt.registerTask('test', ['testOnce', 'watch:test']);

    grunt.registerTask('build', ['babel', 'concat']);
    grunt.registerTask('default', ['build', 'watch:build']);
};


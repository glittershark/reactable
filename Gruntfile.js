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
                    'lib/reactable/lib/to_array.js': 'src/reactable/lib/to_array.jsx',
                    'lib/reactable/lib/filter_props_from.js': 'src/reactable/lib/filter_props_from.jsx',
                    'lib/reactable/lib/extract_data_from.js': 'src/reactable/lib/extract_data_from.jsx',
                    'lib/reactable/lib/is_react_component.js': 'src/reactable/lib/is_react_component.jsx',
                    'lib/reactable/lib/stringable.js': 'src/reactable/lib/stringable.jsx',
                    'lib/reactable/filterer.js': 'src/reactable/filterer.jsx',
                    'lib/reactable/sort.js': 'src/reactable/sort.jsx',
                    'lib/reactable/td.js': 'src/reactable/td.jsx',
                    'lib/reactable/tr.js': 'src/reactable/tr.jsx',
                    'lib/reactable/thead.js': 'src/reactable/thead.jsx',
                    'lib/reactable/tfoot.js': 'src/reactable/tfoot.jsx',
                    'lib/reactable/unsafe.js': 'src/reactable/unsafe.jsx',
                    'lib/reactable/th.js': 'src/reactable/th.jsx',
                    'lib/reactable/paginator.js': 'src/reactable/paginator.jsx',
                    'lib/reactable/table.js': 'src/reactable/table.jsx',

                    'lib/reactable.js': 'src/reactable.jsx',

                    'build/tests/reactable_test.js': 'tests/reactable_test.jsx'
                }
            }
        },
        concat: {
            dist: {
                src: [
                    'lib/reactable/lib/filter_props_from.js',
                    'lib/reactable/lib/to_array.js',
                    'lib/reactable/lib/stringable.js',
                    'lib/reactable/lib/extract_data_from.js',
                    'lib/reactable/lib/is_react_component.js',
                    'lib/reactable/unsafe.js',
                    'lib/reactable/filterer.js',
                    'lib/reactable/sort.js',
                    'lib/reactable/td.js',
                    'lib/reactable/tr.js',
                    'lib/reactable/th.js',
                    'lib/reactable/thead.js',
                    'lib/reactable/tfoot.js',
                    'lib/reactable/paginator.js',
                    'lib/reactable/table.js',
                    'lib/reactable.js'
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


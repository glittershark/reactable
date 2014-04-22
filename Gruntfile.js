module.exports = function(grunt) {
    grunt.initConfig({
        watch: {
            files: ['src/**/*.jsx'],
            tasks: ['build']
        },
        react: {
            compile: {
                files: {
                    'build/reactable.js': 'src/reactable.jsx'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-react');

    grunt.registerTask('build', ['react']);
    grunt.registerTask('default', ['build', 'watch']);
};


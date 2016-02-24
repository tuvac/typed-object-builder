/*global module:false*/
'use strict';
module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        // Task configuration.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/**\n' +
            ' * <%= pkg.title || pkg.name %>\n' +
            ' * <%= pkg.description %>\n' +
            ' * \n' +
            ' * @author <%= pkg.author.name %> <<%= pkg.author.email %>>\n' +
            ' * @since <%= grunt.template.today("yyyy-mm-dd") %>\n' +
            ' * @version v<%= pkg.version %>\n' +
            ' */\n',
        jshint: {
            src: ['lib/**/*.js'],
            options: {
                jshintrc: true
            }
        },
        mochaTest: {
            jenkins: {
                options: {
                    reporter: 'xunit',
                    captureFile: 'results.xml',
                    quiet: false,
                },
                src: ['test/**/*.js']
            },
            dev: {
                options: {
                    reporter: 'spec',
                },
                src: ['test/**/*.js']
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-git-release');
    // Default task.
    grunt.registerTask('default', ['jshint', 'mochaTest:dev']);
    grunt.registerTask('jenkins', ['jshint', 'mochaTest:jenkins']);
};

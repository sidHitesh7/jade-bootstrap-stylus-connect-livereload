'use strict';

module.exports = function(grunt) {
  // Project configuration
  grunt.initConfig({
    // Metadata
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= props.license %> */\n',
    // Task configuration
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ['lib/<%= pkg.name %>.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true
      },
      gruntfile: {
        //src: 'gruntfile.js'
      },
      lib_test: {
        src: ['lib/**/*.js', 'test/**/*.js', 'app/scripts/*.js']
      }
    },
    qunit: {
      files: ['test/**/*.html']
    },
    copy: {
      main: {
        files: [
          // includes files within path
          {
            expand: true,
            cwd: 'app/scripts',
            src: ['**'],
            dest: 'public/js',
            filter: 'isFile'
          }, {
            expand: true,
            cwd: 'app/images',
            src: ['**'],
            dest: 'public/images',
            filter: 'isFile'
          },
        ]
      },
    },
    watch: {
      stylus: {
        files: ["bower_components/stylus/*.styl", "app/stylus/*.styl"],
        tasks: ["stylus:dev"]
      },
      jade: {
        files: ["app/html/*.jade"],
        tasks: ["jade:dev"]
      },
      copy: {
        files: ["app/images/*", "app/scripts/**/*.js"],
        tasks: ["copy"]
      },
      options: {
        livereload: true
      }
    },
    jade: {
      dev: {
        options: {
          pretty: true
        },
        files: [{
          cwd: 'app/html',
          src: '*.jade',
          expand: true,
          dest: 'public',
          ext: '.html'
        }]
      },
      release: {
        options: {
          pretty: false
        },
        files: [{
          cwd: 'app/html',
          src: '*.jade',
          expand: true,
          dest: 'public',
          ext: '.html'
        }]
      }
    },
    stylus: {
      dev: {
        options: {
          compress: false
        },
        files: {
          "public/css/main.css": ["bower_components/bootstrap-stylus/stylus/bootstrap.styl", "app/stylus/main.styl"]
        }
      },
      release: {
        options: {
          compress: true
        },
        files: {
          "public/css/main.css": ["bower_components/bootstrap-stylus/stylus/bootstrap.styl", "app/stylus/main.styl"]
        }
      }
    },
    clean: {
      build: ["public"]
    },
    connect: {
      server: {
        options: {
          port: 9001,
          base: 'public',
          livereload: true
        }
      }
    }
  });

  //these plugins provide necessary tasks
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');

  //default task
  grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify']);

  //development task
  grunt.registerTask('dev', ['jshint', 'copy', 'jade:dev', 'stylus:dev', 'connect', 'watch']);
};
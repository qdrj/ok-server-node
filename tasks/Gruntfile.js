module.exports = function(grunt) {

	grunt.initConfig({

		clean: {
			main: {
				src: ["../../Game/dev/payment/*"],
				options: { force: true }
			}
		},

		copy: {
			main: {
				files: [{
					expand: true,
					cwd: "../dev/",
					src: ["**"],
					dest: "../../Game/dev/payment/"
				}]
			}
		},

		secret: grunt.file.readJSON('sftp.json'),
		sftp: {
			main: {
				files: { "./": ["../dev/**", "!../dev/node_modules/**"] },
				options: {
					host: '<%= secret.host %>',
					path: '<%= secret.path %>',
					username: '<%= secret.username %>',
					password: '<%= secret.password %>',
					showProgress: true,
					srcBasePath: "../dev/",
					createDirectories: true
				}
			},

			full: {
				files: { "./": "../dev/**" },
				options: {
					host: '<%= secret.host %>',
					path: '<%= secret.path %>',
					username: '<%= secret.username %>',
					password: '<%= secret.password %>',
					showProgress: true,
					srcBasePath: "../dev/",
					createDirectories: true
				}
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-ssh');

	grunt.registerTask('default', 'sftp:main');
	grunt.registerTask('deploy', 'sftp:main');
	grunt.registerTask('local', ['clean', 'copy']);
};
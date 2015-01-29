This project is to help jump start the beginning of html projects.

##Installation

###Install node
http://node.org

###Install NPM Packages
Open the terminal and navigate to the project folder.
```console
    npm install
```	
###Install bower globally
```console
    npm install -g bower
```
###Install & Build Handlebars

Navigate to the bower_components handlebars folder in terminal.  bower_components/handlebars.  Type in these commands to build the handlebars libs
```console
    npm install
	grunt
```
##Usage

This project uses Gulp (http://gulp.io) to build the project.  Typing in 'gulp' in the terminal will build the project to the public folder.  The public folder is where all the js, css, images, and fonts go.  Do not make any changes to the files in this folder because the changes will be overriden when the project is built.
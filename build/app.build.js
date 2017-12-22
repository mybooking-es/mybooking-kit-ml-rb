// app.build.js (Builder for optimize project)
// node r.js -o mainConfigFile=main_config.js name=main.js out=built.js baseUrl=.
// node r.js -o app.build.js
// http://japhr.blogspot.com.es/2011/12/whole-project-optimization-with.html
//
// paths relatives to this file (app.build.js)
//
// node r.js -o app.build.js
({
   baseUrl: 'js', // where scripts are stored
   name: 'app.js', // application name (in js folder)
   out: '../public/assets/js/built.js', // output file
   mainConfigFile: 'app.build.config.js', // configuration
})

/* --------------------------
   Defines the modules
   --------------------------
*/
var require = {
	
	/*enforceDefine: true,*/
	
	baseUrl: '/development/js',

    paths: {
        "jquery"                  : "jquery", 
        "jquery.migrate"          : "jquery.migrate",
        "jquery.ui"               : "jquery.ui", 
        "jquery.ui.datepicker-es" : "jquery.ui.datepicker-es",
        "jquery.ui.datepicker-en" : "jquery.ui.datepicker-en",
        "jquery.ui.datepicker-ca" : "jquery.ui.datepicker-ca",
        "jquery.ui.datepicker-it" : "jquery.ui.datepicker-it",
        "jquery.ui.datepicker.validation" : "jquery.ui.datepicker.validation",        
        "jquery.validate"         : "jquery.validate",
        "jquery.form"             : "jquery.form",
        "jquery.formparams"       : "jquery.formparams",
        "bootstrap"               : "bootstrap",
        "bootstrap.select"        : "bootstrap.select",
        "jquery.prettyPhoto"      : "jquery.prettyPhoto",
        "jquery.easing"           : "jquery.easing",
        "jquery.smoothscroll"     : "jquery.smoothscroll",
        "superfish"               : "superfish",
        "jquery.sticky"           : "jquery.sticky",
        "swiper.jquery"           : "swiper.jquery",
        "json2"                   : "json2",
        "datejs"                  : "datejs",
        "ysdtemplate"             : "ysdtemplate"
    },

    shim: {
        "jquery.migrate": ['jquery'],
        "jquery.ui"    : ['jquery'],
        "jquery.ui.datepicker-es" : ['jquery', 'jquery.ui'],
        "jquery.ui.datepicker-en" : ['jquery', 'jquery.ui'],
        "jquery.ui.datepicker-ca" : ['jquery', 'jquery.ui'],
        "jquery.ui.datepicker-it" : ['jquery', 'jquery.ui'],
        "jquery.ui.datepicker.validation" : ["jquery.ui.datepicker-es"],
        "jquery.validate" : ['jquery'],
        "jquery.formparams" : ['jquery'],
        "jquery.form" : ['jquery'],
        "bootstrap" : ['jquery'],
        "superfish": ['jquery'],
        "jquery.prettyPhoto": ['jquery'],
        "jquery.sticky": ['jquery'],
        "jquery.easing": ['jquery'],
        "jquery.smoothscroll" : ['jquery'],
        "swiper.jquery": ['jquery'],
        "bootstrap.select": ['bootstrap'],
        "json2" : { 
          "exports": 'JSON'
        },
        "datejs" : {},
        "modernizr" : {
          "exports": 'Modernizr'
        },      
        "ysdtemplate": {}
    }

};



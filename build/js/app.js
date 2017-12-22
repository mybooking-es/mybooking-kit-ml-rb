//
// Built using the following
// node ../../build_js/r.js -o mainConfigFile=app.build.config.js name=app.js out=built.js baseUrl=.
//
// NEW
//
// node r.js -o app.build.js 
//
requirejs(['jquery',
           'jquery.migrate',
           'jquery.ui',
           'jquery.ui.datepicker-es',
           'jquery.ui.datepicker-ca',
           'jquery.ui.datepicker-it',
           'jquery.ui.datepicker-en',
           'jquery.validate', 
           'jquery.ui.datepicker.validation',
           'jquery.formparams',
           'jquery.form',
           'bootstrap',
           'superfish',
           'jquery.prettyPhoto',
           'jquery.sticky',
           'jquery.easing',
           'jquery.smoothscroll',
           'swiper.jquery',     
           'bootstrap.select', 
           'json2', 
           'datejs',
           'YSDAbstractDataSource',         // DataSource
           'YSDRemoteDataSource',           // DataSource
           'YSDDataAdapter',                // Data adapter
           'YSDListSelectorModel',          // Select an element from a list (checkboxes)
           'YSDSelectSelector',             // Select an element from a select
           'YSDEventTarget', 
           'ysdtemplate'
        ],
        function() {
          // none	
        });

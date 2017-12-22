require(['jquery', 'YSDRemoteDataSource','YSDSelectSelector','/js/common.js',
	     'jquery.validate', 'jquery.ui', 'jquery.ui.datepicker-es',
         'jquery.ui.datepicker-en', 'jquery.ui.datepicker-ca', 'jquery.ui.datepicker-it',
	     'jquery.ui.datepicker.validation', 'datejs',
	     'bootstrap', 'bootstrap.select'], 
	     function($, RemoteDataSource, SelectSelector,commonServices) {

  selectorModel = {
    requestLanguage: <%if session[:locale] && settings.default_locale != session[:locale]%>'<%=session[:locale]%>'<%else%>null<%end%>,
    minDays   : 1,
  };

  selectorController = {

    dateFromChanged: function() {

      var dateFrom = $('#date_from').datepicker('getDate');
      var dateTo = $('#date_from').datepicker('getDate');
      dateTo.setDate(dateTo.getDate() + selectorModel.minDays)
      $('#date_to').datepicker('setDate', dateTo );
      $('#date_to').datepicker('option', 'minDate', dateFrom.add(selectorModel.minDays).days());

    }

  };

  selectorView = {

  	init: function() {

  		this.setupDateControls();
  		this.loadPickupReturnPlaces();
  		this.loadPickupReturnTime();

  	},

  	setupDateControls: function() {
      
      $.datepicker.setDefaults( $.datepicker.regional["<%=session[:locale] || 'es'%>" ] );
      var locale = $.datepicker.regional["<%=session[:locale] || 'es'%>"];

      $('#date_from').datepicker({numberOfMonths:1, 
          minDate: new Date(), 
          maxDate: new Date().add(365).days(), 
          dateFormat: 'dd/mm/yy'},
          locale);
      $('#date_from').datepicker('setDate', '+0'); 

      $('#date_to').datepicker({numberOfMonths:1, 
          minDate: new Date().add(selectorModel.minDays).days(),
            maxDate: new Date().add(365).days(), 
            dateFormat: 'dd/mm/yy'}, locale);
      $('#date_to').datepicker('setDate', '+'+selectorModel.minDays);

      $('#date_from').bind('change', function() {
           selectorController.dateFromChanged();
         });

  	},

  	loadPickupReturnPlaces: function() {

  	    var pickupPlacesURL = commonServices.URL_PREFIX + '/api/booking/frontend/pickup-places'
        if (selectorModel.requestLanguage != null) {
            pickupPlacesURL += '?lang='+selectorModel.requestLanguage;
        }

        var dataSourcePickupPlaces = new RemoteDataSource(pickupPlacesURL, {'id':'id','description':'name'});
        var pickupPlace = new SelectSelector('pickup_place', 
        		dataSourcePickupPlaces, null, false, '',
                function() { 

                    $('#pickup_place').selectpicker();
                    $('#pickup_place').selectpicker('refresh');  

                } );

        var returnPlacesURL = commonServices.URL_PREFIX + '/api/booking/frontend/return-places'
        if (selectorModel.requestLanguage != null) {
            returnPlacesURL += '?lang='+selectorModel.requestLanguage;
        }

        var dataSourceReturnPlaces = new RemoteDataSource(returnPlacesURL, {'id':'id','description':'name'});
        var returnPlace = new SelectSelector('return_place', 
        		dataSourcePickupPlaces, null, false, '',
                function() {
               
                	  $('#return_place').selectpicker();
                    $('#return_place').selectpicker('refresh'); 

                } );          

  	},

  	loadPickupReturnTime: function() {

        var dataSourcePickupReturnTime = new RemoteDataSource(commonServices.URL_PREFIX + '/api/booking/frontend/pickup-return-times', {
        	  id: function(data){return data;}, 
        	  description: function(data){return data;} });

        var pickupTime = new SelectSelector('time_from', 
        		dataSourcePickupReturnTime, '10:00', false, '',
                function() {
                   
                	  $('#time_from').selectpicker();
					          $('#time_from').val('10:00');
					          $('#time_from').selectpicker('refresh');

                } );             
        var returnTime = new SelectSelector('time_to', 
        		dataSourcePickupReturnTime, '10:00', false, '',
                function() {
                
                	  $('#time_to').selectpicker();
					          $('#time_to').val('10:00');
					          $('#time_to').selectpicker('refresh');
               	 
                } );  

  	}

  };

  selectorView.init();

});
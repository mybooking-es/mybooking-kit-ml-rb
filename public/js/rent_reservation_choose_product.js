require(['jquery', 'YSDRemoteDataSource','YSDSelectSelector','/js/common.js',
         'ysdtemplate',
	     'jquery.validate', 'jquery.ui', 'jquery.ui.datepicker-es',
         'jquery.ui.datepicker-en', 'jquery.ui.datepicker-ca', 'jquery.ui.datepicker-it',
         'jquery.ui.datepicker.validation', 'datejs',
	     'bootstrap', 'bootstrap.select'], 
	     function($, RemoteDataSource, SelectSelector, commonServices, tmpl) {

  model = {
    requestLanguage: <%if session[:locale] && settings.default_locale != session[:locale]%>'<%=session[:locale]%>'<%else%>null<%end%>,
    minDays: 1,
    data : null,
    shopping_cart: null,
    products: null,
    sales_process: null,
    date_from : null,
    time_from : null,
    date_to : null,
    time_to : null,
    pickup_place: null,
    return_place: null,
    driver_under_age: null,
    loading : true, // control the loading process
    loadedPickupPlaces: false,
    loadedReturnPlaces: false,
    loadedPickupTimes: false,
    loadedReturnTimes: false,

    // -------------- Extract data -----------------------------

    getUrlVars : function() {
      var vars = [], hash;
      var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
      for(var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
      }
      return vars;
    }, 

    extractVariables: function() { // Load variables from the request

      var url_vars = this.getUrlVars();
          
      this.date_from = decodeURIComponent(url_vars['date_from']);        
      if (this.date_from == null || this.date_from == 'undefined') {
        this.date_from = '<%=@date_from%>';
      }
      this.time_from = decodeURIComponent(url_vars['time_from']);
      if (this.time_from == null || this.time_from == 'undefined') {
        this.time_from = '<%=@time_from%>'
      }
      this.date_to = decodeURIComponent(url_vars['date_to']);
      if (this.date_to == null || this.date_to == 'undefined') {
        this.date_to = '<%= @date_to %>';
      }
      this.time_to = decodeURIComponent(url_vars['time_to']);
      if (this.time_to == null || this.time_to == 'undefined') {
        this.time_to = '<%= @time_to %>';
      }
      this.pickup_place = decodeURIComponent(url_vars['pickup_place']);
      if (this.pickup_place == null || this.pickup_place == 'undefined') {
        this.pickup_place = '<%= @pickup_place %>';
      }
      this.return_place = decodeURIComponent(url_vars['return_place']);
      if (this.return_place == null || this.return_place == 'undefined') {
        this.return_place = '<%= @return_place %>';
      }
      this.driver_under_age = decodeURIComponent(url_vars['driver_under_age']);
      if (this.driver_under_age == null || this.driver_under_age == 'undefined') {
        this.driver_under_age = '<%= (@driver_under_age ? "on" : "") || "on" %>';
      }
    },

    // --------------- Miscelanea -------------------------------------

    checkLoading: function() {

       if (this.loadedPickupPlaces &&
           this.loadedReturnPlaces &&
           this.loadedPickupTimes &&
           this.loadedReturnTimes &&
           this.loading) {
         this.loading = false;
         this.loadShoppingCart();
       }

    },

    // -------------- Shopping cart ----------------------------

    putShoppingCartFreeAccessId: function(value) {
      sessionStorage.setItem('shopping_cart_free_access_id', value);
    },

    getShoppingCartFreeAccessId: function() {
      return sessionStorage.getItem('shopping_cart_free_access_id');
    },

    isShoppingCartData: function() {

      return (this.date_from != 'undefined' && this.date_from != '' &&
              this.time_from != 'undefined' && this.time_from != '' &&
              this.date_to != 'undefined' && this.date_to != '' &&
              this.time_to != 'undefined' && this.time_to != '' &&
              this.pickup_place != 'undefined' && this.pickup_place != '' &&
              this.return_place != 'undefined' && this.return_place != '' &&
              this.driver_under_age != 'undefined');
    
    },

    buildLoadShoppingCartDataParams: function() { /* Build create/update shopping cart data */

      var data = {
        date_from : this.date_from,
        time_from : this.time_from,
        date_to : this.date_to,
        time_to : this.time_to,
        pickup_place: this.pickup_place,
        return_place: this.return_place,
        driver_under_age: this.driver_under_age
      };

      var jsonData = encodeURIComponent(JSON.stringify(data));

      return jsonData;

    },

    loadShoppingCart: function() {

       // Build the URL
       var url = commonServices.URL_PREFIX + '/api/booking/frontend/shopping-cart';
       var freeAccessId = this.getShoppingCartFreeAccessId();
       if (freeAccessId) {
         url += '/' + freeAccessId;
       }

       if (model.requestLanguage != null) {
          url += '?lang=' + model.requestLanguage;
       }

       if (this.isShoppingCartData()) { // create or update shopping cart
         $.ajax({
               type: 'POST',
               url : url,
               data: model.buildLoadShoppingCartDataParams(),
               dataType : 'json',
               contentType : 'application/json; charset=utf-8',
               crossDomain: true,               
               success: function(data, textStatus, jqXHR) {
                 model.shoppingCartResultProcess(data, textStatus, jqXHR);
               },
               error: function(data, textStatus, jqXHR) {
                 alert('Error obteniendo la información');
               },
               complete: function(jqXHR, textStatus) {
                 $('#full_loader').hide();
                 $('#sidebar').show();
               }
          });
       }
       else { // retrieve the shopping cart
         $.ajax({
               type: 'GET',
               url : url,
               dataType : 'json',
               contentType : 'application/json; charset=utf-8',
               crossDomain: true,               
               success: function(data, textStatus, jqXHR) {
                 model.shoppingCartResultProcess(data, textStatus, jqXHR);
               },
               error: function(data, textStatus, jqXHR) {
                 alert('Error obteniendo la información');
               },
               complete: function(jqXHR, textStatus) {
                 $('#full_loader').hide();
                 $('#sidebar').show();
               }
          });
       }

    },

    shoppingCartResultProcess: function(data, textStatus, jqXHR) {
                 model.shopping_cart = data.shopping_cart;
                 model.products = data.products;
                 model.sales_process = data.sales_process;
                 // Store the shopping cart free access id in the session
                 if (model.getShoppingCartFreeAccessId() == null) {
                   model.putShoppingCartFreeAccessId(model.shopping_cart.free_access_id);
                 }
                 view.showShoppingCart();
    },

    // -------------- Select product ----------------------------

    buildSelectProductDataParams: function(productCode) {

      var data = {
        product: productCode
      };

      var jsonData = encodeURIComponent(JSON.stringify(data));

      return jsonData;

    },

    selectProduct: function(productCode) {

       // Build the URL 
       var url = commonServices.URL_PREFIX + '/api/booking/frontend/shopping-cart';
       var freeAccessId = this.getShoppingCartFreeAccessId();
       if (freeAccessId) {
         url += '/' + freeAccessId;
       }
       url += '/set-product';

       if (model.requestLanguage != null) {
           url += '?lang=' + model.requestLanguage;
       }

       // Action to the URL
       $.ajax({
               type: 'POST',
               url : url,
               data: this.buildSelectProductDataParams(productCode),
               dataType : 'json',
               contentType : 'application/json; charset=utf-8',
               crossDomain: true, 
               success: function(data, textStatus, jqXHR) {
                 
                 model.shopping_cart = data.shopping_cart;
                 window.location.href= '/reserva/completar<%if session[:locale] && settings.default_locale != session[:locale]%>?lang=<%=session[:locale]%><%end%>';

               },
               error: function(data, textStatus, jqXHR) {
                  // TODO 
                  alert('Error seleccionando producto');
               },
               beforeSend: function(jqXHR) {
                  $('#full_loader').show();
               },
               complete: function(jqXHR, textStatus) {
                 $('#full_loader').hide();
               } 
          });

    }   

  };

  controller = {

    selectProductBtnClick: function(productCode) {

      model.selectProduct(productCode);

    },

    dateFromChanged: function() {

      var dateFrom = $('#date_from').datepicker('getDate');
      var dateTo = $('#date_from').datepicker('getDate');
      dateTo.setDate(dateTo.getDate() + model.minDays)
      $('#date_to').datepicker('setDate', dateTo );
      $('#date_to').datepicker('option', 'minDate', dateFrom.add(model.minDays).days());

    }

  };

  view = {

  	init: function() {
            
      model.extractVariables();

      // Load the frontend controls
      this.setupDateControls();
      $('#full_loader').show();
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
          minDate: new Date().add(model.minDays).days(),
            maxDate: new Date().add(365).days(), 
            dateFormat: 'dd/mm/yy'}, locale);
      $('#date_to').datepicker('setDate', '+'+model.minDays);

      $('#date_from').bind('change', function() {
           controller.dateFromChanged();
         });
    },

    loadPickupReturnPlaces: function() {

        var pickupPlacesURL = commonServices.URL_PREFIX + '/api/booking/frontend/pickup-places'
        if (model.requestLanguage != null) {
            pickupPlacesURL += '?lang='+model.requestLanguage;
        }

        var dataSourcePickupPlaces = new RemoteDataSource(pickupPlacesURL,{'id':'id','description':'name'});
        var pickupPlace = new SelectSelector('pickup_place', 
            dataSourcePickupPlaces, null, false, '',
                function() { 
                  $('#pickup_place').selectpicker();
                  model.loadedPickupPlaces = true;
                  model.checkLoading();
                } );

        var returnPlacesURL = commonServices.URL_PREFIX + '/api/booking/frontend/return-places'
        if (model.requestLanguage != null) {
            returnPlacesURL += '?lang='+model.requestLanguage;
        }

        var dataSourceReturnPlaces = new RemoteDataSource(returnPlacesURL, {'id':'id','description':'name'});
        var returnPlace = new SelectSelector('return_place', 
            dataSourcePickupPlaces, null, false, '',
                function() { 
                  $('#return_place').selectpicker(); 
                  model.loadedReturnPlaces = true;
                  model.checkLoading();
                } );          

    },

    loadPickupReturnTime: function() {

        var dataSourcePickupTime = new RemoteDataSource(commonServices.URL_PREFIX + '/api/booking/frontend/pickup-return-times', {
            id: function(data){return data;}, 
            description: function(data){return data;} });

        var dataSourceReturnTime = new RemoteDataSource(commonServices.URL_PREFIX + '/api/booking/frontend/pickup-return-times', {
            id: function(data){return data;}, 
            description: function(data){return data;} });

        var pickupTime = new SelectSelector('time_from', 
            dataSourcePickupTime, '10:00', false, '',
                function() { 
                  $('#time_from').selectpicker();
                  $('#time_from').val('10:00');
                  $('#time_from').selectpicker('refresh');
                  model.loadedPickupTimes = true;
                  model.checkLoading();
                } );   

        var returnTime = new SelectSelector('time_to', 
            dataSourceReturnTime, '10:00', false, '',
                function() { 
                  $('#time_to').selectpicker();
                  $('#time_to').val('10:00');
                  $('#time_to').selectpicker('refresh');
                  model.loadedReturnTimes = true;
                  model.checkLoading();                
                } );  

    },


    showShoppingCart: function() {

        $('#pickup_place').val(model.shopping_cart.pickup_place.replace(/\+/g, ' '));         
        $('#pickup_place').selectpicker('refresh');
        $('#return_place').val(model.shopping_cart.return_place.replace(/\+/g, ' '));         
        $('#return_place').selectpicker('refresh');

        if (model.shopping_cart.date_from instanceof Date) {
            var date_from = model.shopping_cart.date_from.getDate() + '/' + (model.shopping_cart.date_from.getMonth()+1)+ '/' + model.shopping_cart.date_from.getFullYear();
        }
        else if (typeof model.shopping_cart.date_from === 'string') {
            var date_from = model.shopping_cart.date_from.substring(8,10) + '/' + model.shopping_cart.date_from.substring(5,7) + '/' + model.shopping_cart.date_from.substring(0,4);
        }

        if (model.shopping_cart.date_to instanceof Date) {
            var date_to = model.shopping_cart.date_to.getDate() + '/' + (model.shopping_cart.date_to.getMonth()+1) + '/' + model.shopping_cart.date_to.getFullYear();
        }
        else if (typeof model.shopping_cart.date_to === 'string') {
            var date_to = model.shopping_cart.date_to.substring(8, 10) + '/' + model.shopping_cart.date_to.substring(5, 7) + '/' + model.shopping_cart.date_to.substring(0, 4);
        }
        
        $('#date_from').datepicker("setDate", date_from);        
        $('#time_from').val(model.shopping_cart.time_from);
        $('#time_from').selectpicker('refresh');
        
        $('#date_to').datepicker("setDate", date_to); 
        $('#time_to').val(model.shopping_cart.time_to);
        $('#time_to').selectpicker('refresh');    

        // Show the products
        var result = '';
        for (var idx=0;idx<model.products.length;idx++) {
          result += tmpl('script_detailed_product')({product:model.products[idx]});
        }
        $('#product_listing').html(result);

        // Prepare onclick event to select the product
        $('.btn-choose-product').bind('click', function() {
          controller.selectProductBtnClick($(this).attr('data-product'));
        });

    }

  };

  view.init();

});

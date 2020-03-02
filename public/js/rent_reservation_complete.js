require(['jquery', 'YSDRemoteDataSource','YSDSelectSelector','/js/common.js',
         'ysdtemplate',
         'ysdtemplate', 'jquery.formparams', 'jquery.form',
	     'jquery.validate', 'jquery.ui', 'jquery.ui.datepicker-es',
         'jquery.ui.datepicker-en', 'jquery.ui.datepicker-ca', 'jquery.ui.datepicker-it',
	     'jquery.ui.datepicker.validation', 'datejs',
	     'bootstrap', 'bootstrap.select'], 
	     function($, RemoteDataSource, SelectSelector, commonServices, tmpl) {

  model = { // THE MODEL
    requestLanguage: <%if session[:locale] && settings.default_locale != session[:locale]%>'<%=session[:locale]%>'<%else%>null<%end%>,
    shopping_cart: null,
    products: null,
    extras: null,
    sales_process: null,

    // ------------ Product information detail ------------------------

    getShoppingCartProduct: function() { /** Get a product **/

    	if (this.shopping_cart && this.shopping_cart.items.length > 0)
    	{	
    	   var productCode = this.shopping_cart.items[0].item_id;
    		 if (this.products == null) {
    		 	 return null;
    	 	 }
    		 for (var idx=0;idx<=this.products.length;idx++) {
    		 	 if (this.products[idx].code == productCode) {
    			 	 return this.products[idx];
    			 }
    		 }
		  }

    	return null;

    },

    // ------------ Extras information detail ------------------------

    getShoppingCartExtras: function() { /** Get an object representation of extras **/

      var shoppingCartExtras = {};

      if (this.shopping_cart != null) {
          for (var idx=0;idx<this.shopping_cart.extras.length;idx++) {
            shoppingCartExtras[this.shopping_cart.extras[idx].extra_id] = this.shopping_cart.extras[idx].quantity;
          }
      }

      return shoppingCartExtras;

    },

    // ------------------ Shopping cart -------------------------------

    getShoppingCartFreeAccessId: function() { /* Get the shopping cart id */
      return sessionStorage.getItem('shopping_cart_free_access_id');
    },

    deleteShoppingCartFreeAccessId: function() { /* Get the shopping cart id */
      return sessionStorage.removeItem('shopping_cart_free_access_id');
    },    

    loadShoppingCart: function() { /** Load the shopping cart **/

       // Build the URL
       var url = commonServices.URL_PREFIX + '/api/booking/frontend/shopping-cart';
       var freeAccessId = this.getShoppingCartFreeAccessId();
       if (freeAccessId) {
         url += '/' + freeAccessId;
       }

       var urlParams = [];

       if (model.requestLanguage != null) {
          urlParams.push('lang=' + model.requestLanguage);
       }
       urlParams.push('include_extras=true');
       if (urlParams.length > 0) {
        url += '?';
        url += urlParams.join('&');
       }

       // Action to the URL
       $.ajax({
               type: 'GET',
               url : url,
               dataType : 'json',
               contentType : 'application/json; charset=utf-8',               
               //xhrFields: {
               //  withCredentials: true
               //},
               crossDomain: true, 
               success: function(data, textStatus, jqXHR) {
                 
                 model.shopping_cart = data.shopping_cart;
                 model.products = data.products;
                 model.extras = data.extras;
                 model.sales_process = data.sales_process;

                 view.updateShoppingCart();

               },
               error: function(data, textStatus, jqXHR) {

                 alert('Error cargando carrito');

               },
               complete: function(jqXHR, textStatus) {
                 $('#full_loader').hide();
                 $('#content').show();
                 $('#sidebar').show();
               }
          });

    },

    // -------------- Extras management --------------------------

    buildSetExtraDataParams: function(extraCode, quantity) {

      var data = {
        extra: extraCode,
        quantity: quantity
      };

      var jsonData = encodeURIComponent(JSON.stringify(data));

      return jsonData;

    },

    setExtra: function(extraCode, quantity) { /** Add an extra **/

      // Build the URL 
      var url = commonServices.URL_PREFIX + '/api/booking/frontend/shopping-cart';
      var freeAccessId = this.getShoppingCartFreeAccessId();
      if (freeAccessId) {
        url += '/' + freeAccessId;
      }
      url += '/set-extra';

      if (model.requestLanguage != null) {
          url += '?lang=' + model.requestLanguage;
      }

      // Action to the URL
      $.ajax({
        type: 'POST',
        url : url,
        data: this.buildSetExtraDataParams(extraCode, quantity),
        dataType : 'json',
        contentType : 'application/json; charset=utf-8',        
        //xhrFields: {
        //  withCredentials: true
        //},
        crossDomain: true, 
        success: function(data, textStatus, jqXHR) {

            model.shopping_cart = data.shopping_cart;
            model.products = data.products;
            model.extras = data.extras;

            view.updateShoppingCartSummary();

        },
        error: function(data, textStatus, jqXHR) {

            alert('Error actualizando extra');

        },
        beforeSend: function(jqXHR) {
            $('#full_loader').show();
        },
        complete: function(jqXHR, textStatus) {
            $('#full_loader').hide();
        }   
      });


    },

    buildDeleteExtraDataParams: function(extraCode) {

      var data = {
        extra: extraCode
      };

      var jsonData = encodeURIComponent(JSON.stringify(data));

      return jsonData;

    },

    deleteExtra: function(extraCode) { /** Remove an extra **/

      // Build the URL 
      var url = commonServices.URL_PREFIX + '/api/booking/frontend/shopping-cart';
      var freeAccessId = this.getShoppingCartFreeAccessId();
      if (freeAccessId) {
        url += '/' + freeAccessId;
      }
      url += '/remove-extra';

      if (model.requestLanguage != null) {
          url += '?lang=' + model.requestLanguage;
      }

      // Action to the URL
      $.ajax({
        type: 'POST',
        url : url,
        data: this.buildDeleteExtraDataParams(extraCode),
        dataType : 'json',
        contentType : 'application/json; charset=utf-8',        
        //xhrFields: {
        //  withCredentials: true
        //},
        crossDomain: true, 
        success: function(data, textStatus, jqXHR) {

            model.shopping_cart = data.shopping_cart;
            model.products = data.products;
            model.extras = data.extras;

            view.updateShoppingCartSummary();

        },
        error: function(data, textStatus, jqXHR) {

            alert('Error eliminando extra');

        },
        beforeSend: function(jqXHR) {
            $('#full_loader').show();
        },
        complete: function(jqXHR, textStatus) {
            $('#full_loader').hide();
        }   
      });

    },

    // -------------- Checkout : Confirm reservation ----------------------

    buildCheckoutDataParams: function() {

      var reservation = $('form[name=reservation_form]').formParams(false);
      reservation.comments = $('#comments').val();
      reservation.payment = $('#accordion a').not('.collapsed').attr('data-payment-method');

      var reservationJSON = JSON.stringify(reservation);

      return reservationJSON;
    },

    putBookingFreeAccessId: function(value) {
      sessionStorage.setItem('booking_free_access_id', value);
    },   

    sendBookingRequest: function() { /** Send a booking request **/

      // Prepare the URL
      var url = commonServices.URL_PREFIX + '/api/booking/frontend/shopping-cart';
      var freeAccessId = this.getShoppingCartFreeAccessId();
      if (freeAccessId) {
        url += '/' + freeAccessId;
      }
      url += '/checkout';

      if (model.requestLanguage != null) {
          url += '?lang=' + model.requestLanguage;
      }

      // Action to the URL
      $.ajax({
            type: 'POST',
            url  : url,
            data : this.buildCheckoutDataParams(),
            dataType : 'json',
            contentType : 'application/json; charset=utf-8',            
            //xhrFields: {
            //  withCredentials: true
            //},
            crossDomain: true, 
            success: function(data, textStatus, jqXHR) {
                var payNow = data.pay_now;
                var bookingId = data.free_access_id;
                var payment_method_id = data.payment_method_id;
                // remove the shopping cart id from the session
                model.deleteShoppingCartFreeAccessId();
                model.putBookingFreeAccessId(bookingId);                
                if (payNow && payment_method_id != null && payment_method_id != '') {
                    $.form(commonServices.URL_PREFIX + '/reserva/pagar',{id: bookingId,
                        payment: 'deposit', payment_method_id: payment_method_id},'POST').submit();
                }
                else {
                    window.location.href = '/reserva/' + bookingId;
                }
            },
            error: function(data, textStatus, jqXHR) {
                alert('Lo sentimos. Se ha producido un error registrando la reserva');
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

  controller = { // THE CONTROLLER

      extraChecked: function(extraCode) {
          model.setExtra(extraCode, 1);
      },

      extraUnchecked: function(extraCode) {
          model.deleteExtra(extraCode);
      },

      extraQuantityChanged: function(extraCode, newQuantity) {
          model.setExtra(extraCode, newQuantity);
      },

      sendReservationButtonClick: function() {
          model.sendBookingRequest();
      }

  };

  view = { // THE VIEW

  	init: function() {
  	  this.setupEvents();
  	  this.setupValidation();
      $('#full_loader').show();
  	  model.loadShoppingCart();
  	},

    setupEvents: function() {

        $('#btn_reservation').bind('click', function() {
           $('form[name=reservation_form]').submit();
        });

    },

    setupValidation: function() {

  	  this.setupReservationFormValidation();

    },

    setupReservationFormValidation: function() {

        $('form[name=reservation_form]').validate(
            {

                submitHandler: function(form) {
                    $('#reservation_error').hide();
                    $('#reservation_error').html('');
                    // Difference between reservation vs confirm
                    controller.sendReservationButtonClick();
                    return false;
                },

                invalidHandler : function (form, validator) {
                    $('#reservation_error').html('<%=t.new_booking.form_errors.description%>');
                    $('#reservation_error').show();
                },

                rules : {

                    'customer_name': 'required',
                    'customer_surname' : 'required',
                    'customer_email' : {
                        required: true,
                        email: true
                    },
                    'customer_email_confirmation': {
                        required: true,
                        email: true,
                        equalTo : 'customer_email'
                    },
                    'customer_phone': {
                        required: true,
                        minlength: 9
                    },
                    'driver_date_of_birth': {
                        required: "#fs_driver:visible"
                    },
                    'conditions_read' :  {
                        required: '#conditions_read:visible'
                    }
                },

                messages : {

                    'customer_name': '<%=t.new_booking.customer_name.required%>',
                    'customer_surname' : '<%=t.new_booking.customer_surname.required%>',
                    'customer_email' : {
                        required: '<%=t.new_booking.customer_email.required%>',
                        email: '<%=t.new_booking.customer_email.format%>'
                    },
                    'customer_email_confirmation': {
                        'required': '<%=t.new_booking.customer_email_confirmation.required%>',
                        email: '<%=t.new_booking.customer_email_confirmation.format%>',
                        'equalTo': '<%=t.new_booking.customer_email_confirmation.equal_to%>'
                    },
                    'customer_phone': {
                        'required': '<%=t.new_booking.customer_phone.required%>',
                        'minlength': '<%=t.new_booking.customer_phone.min_length%>'
                    },
                    'driver_date_of_birth': {
                        'required': '<%=t.new_driving_booking.driver_date_of_birth.required%>'
                    },
                    'conditions_read': '<%=t.new_booking.conditions.required%>'

                },

                errorPlacement: function (error, element) {

                    if (element.attr('name') == 'conditions_read')
                    {
                        error.insertAfter(element.parent());
                    }
                    else
                    {
                        error.insertAfter(element);
                    }

                },

                errorClass : 'form-reservation-error'

            }
        );

    },

    updateShoppingCart: function() { // Updates the shopping cart
    	
    	// Show the product information
	  	var productInfo = tmpl('script_product_detail')(
                    {product: model.getShoppingCartProduct(),
										 shopping_cart: model.shopping_cart});
		  $('#selected_product').html(productInfo);

      // Update the summary
      this.updateShoppingCartSummary();
      this.updateExtras();
      this.updatePayment();

    },

    updateShoppingCartSummary: function() { // Updates the shopping cart summary (total)

       var reservationDetail = tmpl('script_reservation_summary')({shopping_cart: model.shopping_cart});
       $('#reservation_detail').html(reservationDetail);

    },

    updateExtras: function() { // Updates the extras (included the selected by the transaction)

        // Show the extras
        var result = '';
        for (var idx=0;idx<model.extras.length;idx++) {
            result += tmpl('script_detailed_extra')({extra:model.extras[idx],
                extrasInShoppingCart: model.getShoppingCartExtras()});
        }
        $('#extras_listing').html(result);

        // Setup events
        $('.extra-select').selectpicker();
        $('.extra-checkbox').bind('change', function() {
            var extraCode = $(this).attr('data-value');
            var checked = $(this).is(':checked');
            if (checked) {
                controller.extraChecked(extraCode);
            }
            else {
                controller.extraUnchecked(extraCode);
            }
        });
        $('.extra-select').bind('change', function() {
            var extraCode = $(this).attr('data-value');
            var extraQuantity = $(this).val();
            controller.extraQuantityChanged(extraCode, extraQuantity);
        });

    },

    updatePayment: function() { // Update the payment 
      var paymentInfo = tmpl('script_payment_detail')(
                    {sales_process: model.sales_process});
      $('#payment_detail').html(paymentInfo);
    }

  };

  view.init();

  // TEMPORARY : TODO : Refactor in JS Module

 

});
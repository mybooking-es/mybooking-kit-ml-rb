define(function(){
	
  YSDListSelectorModel = function(dataSource, value) {
	
	this.dataSource = dataSource;
	this.data = [];
	this.value = value;
	
	this.setView = function(view) {
	  this.view = view;	
	}
	
	var self = this;
	
    this.dataSource.addListener('data_available', 
      function(event) {
        switch (event.type) {
  	      case 'data_available' :
  	        self.data = event.data;
  	        self.view.notify('data_changed');
  	        break;
        }
    });	
	
	this.retrieveData = function() { 	
	  this.dataSource.retrieveData();	
	}
	
	this.setValue = function(value) {
	  this.value = value;
	  this.view.notify('value_changed');	
	}
	
  }

  return YSDListSelectorModel;	
		
});
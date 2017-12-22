define(function() {
  
  //	
  // Inspired by Nicholas C. Zakas (http://www.nczonline.net/blog/2010/03/09/custom-events-in-javascript/)
  //
  YSDEventTarget = function() {

    this.listeners = {}; // A hash when we hold all events by type (each event type has a list of listeners)	

    this.addEventListener = function(type, listener) { /* Adds a event listener */
  	
  	  // If the event type is not registered, adds an entry
  	  if (!this.listeners[type]) {
  	    this.listeners[type] = [];	
  	  }
  	
  	  this.listeners[type].push(listener);
  	
    };	
  
    this.removeEventListener = function(type, listener) { /* Removes an event listener */
  	
      if (this.listeners[type] instanceof Array) {
    	
        this.listeners[type].slice(this.listeners[type].indexOf(listener),1);
    	
        if (this.listeners[type].length == 0) {
          delete this.listeners[type];	
        }	
    	
      }
   	
    };
  
    this.fireEvent = function(event) { /* Fire an event */
  
      if (typeof event == "string") {
        event = {type:event};
      }    	
    
      if (!event.target) {
        event.target = this;	
      }
    
      if (!event.type) {
        throw new Error('The event needs a event type');	
      }
       
      if (this.listeners[event.type] instanceof Array)
      {
        var the_listeners = this.listeners[event.type]; 
        for (n in the_listeners)
        {
          the_listeners[n].call(this,event);	
        }  
      }
    
    };

  }
  
  return YSDEventTarget;
  
});

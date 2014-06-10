(function($){

	$.fn['autosave'] = function(options)
	{
		var settings = $.extend({
					 
		// These are the defaults.
			selector: "form",
			listingContainer: "#autosave",
			listingsMax: 12,
			pages: ['/edit/id/[0-9]+'],
			cookieName: 'pnchc_tsv',
			cookiePath: '/admin/',
			interval: 5,
			createUrl: '/admin/index.php/autosave/create_row/',
			retrieveUrl: '',
			listUrl: '/admin/index.php/autosave/list_rows/12',
			keyUpSelector: 'input',
			
			
		}, options );
		
		
		// Object to hold some properties.
		var props	=	{
							errors: false,
							listingHtml: '<div class="clearfix"></div><p>Autosave listing here.</p>',
						
						};
		
		// Set current window location to string.
		var autosave_uri = window.location.toString();
		
		// Append the autosave_uri to the settings.selector as a hidden form element.
		$(settings.selector).append("\n"+'<input type="hidden" id="autosave_uri" name="autosave_uri" value="'+autosave_uri+'" />'+"\n");
		
		
		
		
		
		// FUNCTIONS //////////////////////////////////////////////////////////////////
		
		
		function setCookie(cname, cvalue, exminutes) {
	    	var d = new Date();
	    	d.setTime(d.getTime() + (exminutes*60*1000));
	    	var expires = "expires="+d.toGMTString();
	    	document.cookie = cname + "=" + cvalue + "; " + expires +"; path="+settings.cookiePath;
		} 
	
	
		function getCookie(cname) {
	    	var name = cname + "=";
			var ca = document.cookie.split(';');
			for(var i=0; i<ca.length; i++) {
	        	var c = ca[i].trim();
				if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
				}
				return "";
		} 
		

		/**
		 * Check current location against patterns in settings.
		 * @return boolean
		 */
		function incPg()
		{
		
			for(i=0;i<settings.pages.length;i++)
			{

				if(autosave_uri.match(settings.pages[i]))
				{
					return true;

				}	else {

					return false;
				}		

			}
		
		} 
		
		
		/**
		 * Grab values from form in current selector and serialize.
		 * @param currSel object 
		 * @return string
		 */
		 
		 formData	= function(currSel)
		 {
			 return $(currSel).serialize();
		 }
		 
		 
		 /** 
		  * Get a listing of recent autosaves for the current uri.
		  * @return void
		  */
		  function listAutoSaves()
		  {
			  
			$.ajax({
			type:"POST",
			url: settings.listUrl,
			data: $(settings.selector).serialize()
						
			}).done(function(data){
			
				props.listingHtml = data;
				$(settings.listingContainer).html(props.listingHtml);
			});

		  }
		  
		  
		  /**
		   * Set a cookie that experires after settings.interval minutes.
		   */
		   function autosaveCookie()
		   {
		   		return setCookie(settings.cookieName,settings.interval,settings.interval);
		   }
		  
		  		 
		 /** 
		  * Create a new autosave record for the current uri.
		  * @return void
		  */
		 function createAutoSave()
		 {
		 
			 $.ajax({
			 			type: "POST",
			 			url: settings.createUrl,
			 			data: $(settings.selector).serialize(),
			 })
			 .done(function(){
				 
				 listAutoSaves(); 
			 });
			  
		 };
		 	

		 //////////////////////////////////////////////////////////////////////////////

		
		
		$(settings.selector).each(function(){

			if( true === incPg() )
			{

				props.formData = formData(this);
				
				createAutoSave();
			}

		});
		
		
		$(settings.selector).children().each(function(){
			
			$(this).focus(function(){
				
				$(this).keyup(function(){

				current = getCookie(settings.cookieName);
				
				if( current == "")
				{
					autosaveCookie();
					
					createAutoSave();

				}
				
				listAutoSaves();
				
				});
				
			});

		});
		
		
		
		//####
		$(settings.listingContainer).html(props.listingHtml);
		
		
		
	} // End $.fn.gdautosave
	
})(jQuery);
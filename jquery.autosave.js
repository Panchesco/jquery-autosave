(function($){

	$.fn['autosave'] = function(options)
	{
		var settings = $.extend({
				selector: "form",
				listingContainer: "#autosave-list",
				listingsMax: 12,
				pages: [],
				cookieName: 'pnchc_tsv',
				cookiePath: '/',
				interval: 5,
				createUrl: '/admin/autosave/create/',
				retrieveUrl: '',
				listUrl: '/admin/autosave/rows/12',
				keyUpSelector: 'input',
				autosaveUrlId: 'autosave_url'
		}, options );
		
		// Object to hold some properties.
		var props	=	{
							errors: false,
							listingHtml: '<div class="clearfix"></div><p>Autosave listing here.</p>',
						};
		
		// Set current window location to string.
		var autosave_url = window.location.toString();

		// Append the autosave_url to the settings.selector as a hidden form element.
		$(settings.selector).append("\n"+'<input type="hidden" id="'+settings.autosaveUrlId+'" name="'+settings.autosaveUrlId+'" value="'+autosave_url+'" />'+"\n");
		
		
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

				if(autosave_url.match(settings.pages[i]))
				{
					return true;
				}	

			}
			
			return false;
		
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



			if( incPg() == true )
			{

				props.formData = formData(this);
				
				createAutoSave();
				
			} 			
			

		});
		
		
		$(settings.selector).find("input,textarea").each(function(){
		
			$(this).focus(function(){

				// On keyup, check for the autosave cookie.

				$(this).keyup(function(){

				current = getCookie(settings.cookieName);

				// If the autosave cookie has expired, create a new autosave row.
				
				if( current == "")
				{
					autosaveCookie();
					
					createAutoSave();

				}
				
				listAutoSaves();
				
				});
				
			});

		});
		

		
	} // End $.fn.gdautosave
	

	
})(jQuery);


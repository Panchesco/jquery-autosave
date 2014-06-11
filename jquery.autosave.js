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
				listUrl: '/admin/autosave/rows/12',
				keyUpSelector: 'input',
				autosaveUrlId: 'autosave_url',
				restoreSelector: '.autosave-restore',
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
				restore(settings.restoreSelector);
				
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
		 
		 
		 /**
		  * Restore form data from autosave data row.
		  */
		function restore(selector)
		{
			$(selector).on("click",function()
			{

				var success = function(data){
				
				// Loop through values in return JSON object and set values to current form.
				$.map(data,function(v,k){
				
					//$("input[name="+k+"],textarea[name="+k+"]").val(v);
					
					var target	= $("input[name="+k+"],textarea[name="+k+"]");
					var type 	= ( target.attr("type") ) ? target.attr("type") : '';
					
					
					
					switch(type)
					{
					
						case 'radio':
							
							var radio = $("input[name="+k+"]");
							
							radio.each(function(){
								
								if($(this).val()==v)
								{
									$(this).prop("checked",true);
								} else {
									$(this).prop("checked",false);
								}
								
							});
						
						break;
					
						default:
							target.val(v);
						break;
						
					}
					

				})

				
			}
			
			
			$.ajax({
				type: "GET",
				url: $(this).attr("href"),
				dataType: "json",
				}
			).done(function(data){
			
				restr = success(data);

			}).error(function(){
			
				alert('Error restoring autosave from JSON object');
				
				});		
			
			return false;          
			
			});
		}

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
		
		
	} // End $.fn.autosave
	

	
})(jQuery);


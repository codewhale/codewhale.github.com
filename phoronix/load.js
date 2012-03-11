function isUrl(s) {
	var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
	return regexp.test(s);
}

function doAjax(url, insertto, selector, remove, callback){
	var container = $(insertto);
	if(url.match('^http')){
		$.getJSON("http://query.yahooapis.com/v1/public/yql?"+
				"q=select%20*%20from%20html%20where%20url%3D%22"+
				encodeURIComponent(url)+
				"%22&format=xml'&callback=?",
				function(data){
					if(data.results[0]){
						var data = data.results[0];
						var tmp = $(data);
						var a = tmp.find(selector);
						a.find(remove).remove();
						container.html(a);
						callback();
					} else {
						var errormsg = '<p>Error: could not load the page.</p>';
						container.html(errormsg);
					}
				}
			 );
	} else {
		$('#target').load(url);
	}
}


function onload(){

	//load is not working due to cross domain
	//$('#phoronix').load('http://www.phoronix.com/scan.php?page=home #phxcms_content_phx', function() {
	
	doAjax('http://www.phoronix.com/scan.php?page=home', 
			'#phoronix', '#phxcms_content_phx', '.phxcms_contentphx_right_bar', function() {

				var a = $('#phxcms_content_phx');
				a.children().removeAttr('style');

				$('a').click(function(event){
					event.preventDefault(); 
					console.log($(this).attr('href'));
					$('#phoronix').hide();

					url = $(this).attr('href');

					if (!isUrl(url))
						url = 'http://www.phoronix.com/' + url;

					doAjax(url, '#story', '.KonaBody', '' , function() {
							$('#story').show();
						});
				});
			});

	$('#summary').click(function(){
		$('#story').hide();
		$('#phoronix').show();
	});
}

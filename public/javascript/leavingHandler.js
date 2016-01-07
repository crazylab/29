$(window).unload(function(){
	var player = document.cookie;
	$.post('leave_request', player, function(){
		$(location).attr('href','index.html');
		player = '';
	});
});

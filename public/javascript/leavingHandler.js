var on_closing_tab = function(){
	$.post('leaveGame');
};
var redirect_to_leaveGame = function(endStatus){
	if(endStatus)
		window.location.assign('leave_game.html');
};

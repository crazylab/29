var showPlayerCount = function(){
	setInterval(function(){
		$.get('playerCount',function(count){
			$('#waiting').html('Waiting for '+count+' other players...')
			if(count==0)
				$(location).attr('href','gamePage.html');
		});
	},2500);
};
$(document).ready(showPlayerCount);

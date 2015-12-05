var showPlayerCount = function(){
	$.get('waiting',function(count){
		$('#waiting').html('Waiting for '+count+' other players...')
	});
}
$(document).ready(showPlayerCount);
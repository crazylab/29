var parseCookie = function(){
	var cookie = document.cookie;
	var seperatedData = cookie.split(';');
	var details = {};
    seperatedData.forEach(function(entity){
		var seperatedEntity = entity.split('=');
		var key = seperatedEntity[0];
		var value = seperatedEntity[1]; 
		details[key] = value;
	});
	return details;
};

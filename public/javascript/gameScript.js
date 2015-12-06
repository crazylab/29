var horizontalCards = function (cards){
	if(typeof cards === 'number'){
		cards = Array.apply(undefined, Array(cards));
	}
	var hand = cards.map(function(cardID){
		var ID = cardID||'';
		var image = ID||'hidden';
		var src = './img/'+image+'.png';
		return '<td id="'+ID+'"><img src="'+src+'"/></td>';
	});
	return hand.join('');
};
var verticalCards = function (numberOfCards){
	var hand = [], number = numberOfCards, margin = 0;
	while(number != 0){
		hand.push('<div style="margin-top:'+margin+'px"><img src="./img/hidden.png"/></div>');
		number--;
		margin = -70;
	}
	return hand.join('');
};
var showTrump = function(trump){
	if(trump)
		return '<img src="img/' + trump + '.png" />';
	return '<img src="img/hidden.png" />';
};
var updateChanges = function(changes){
	var handler = {
		'ownHand' : horizontalCards,
		'partner' : horizontalCards,
		'opponent_1' : verticalCards,
		'opponent_2' : verticalCards,
		'trump' : showTrump
	};
	_.forIn(changes, function(value, key){
		var id = '#'+ key;
		var html = handler[key](value);
		$(id).html(html);
	});
}
var playCard = function(){
	$('#ownHand').on('click','td',function(){
		var id = $(this).attr('id');
		$('#'+id).html('');
		$.post("throwCard", id);
	});
}
var getStatus = function(){
	setInterval(function(){
		$.get("status",function(data){
			var status = JSON.parse(data);
			if(Object.keys(status).length == 0)
				return;
			updateChanges(status);
		});
	},3000);
	playCard();
}
var onPageReady = function(){
	$.get("status",function(status){
		updateChanges(JSON.parse(status));
	});
	getStatus();
};
$(document).ready(onPageReady);
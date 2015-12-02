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
var showAllHands = function(myHand){
	$.get("status",function(data){
		var status = JSON.parse(data);
		$('#ownHand').html(horizontalCards(status.ownHand));
		$('#partner').html(horizontalCards(status.partner));
		$('#opponent_1').html(verticalCards(status.opponent_1));
		$('#opponent_2').html(verticalCards(status.opponent_2));
	});
}
var onPageReady = function(){
	showAllHands();
}
$(document).ready(onPageReady);
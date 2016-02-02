var getShownCard = function(card, addedClass){
	var cardColor = card.suit.match(/Heart|Diamond/g) ? 'red' : 'black';
	addedClass = addedClass ? addedClass : '';
	var suits = {
		Heart : '&hearts;',
		Diamond : '&diams;',
		Club : '&clubs;',
		Spade : '&spades;'
	}
	return '<div id="'+card.id+'" class="card '+cardColor +' '+ addedClass+'">'+
						'<div align="left">'+card.name+'</div>'+
						'<div class="suit">'+suits[card.suit]+'</div>'+
						'<div align="right">'+card.name+'</div>'+
					'</div>';
}

var showMyHand = function (cards){
	var hand = cards.map(function(card){
		return getShownCard(card);
	}).join('');
	$('#you > .hand').html(hand);
};

var renderHand = function(count, distance){
	var htmlTemplate = '<div class="card hidden" style="margin-left: {{distance}}px;"></div>';
	var hand = '';
	for(var index = 0; index < count; index++){
		var d = index == 0 ? 0 : distance;
		hand += htmlTemplate.replace(/{{distance}}/g, d);
	}
	return hand;
}

var showCards = function(status){
	showMyHand(status.me.hand);
	$('#partner > .hand').html(renderHand(status.partner.hand, -50));
	$('#right > .hand').html(renderHand(status.opponent_1.hand, -80));
	$('#left > .hand').html(renderHand(status.opponent_2.hand, -80));
}

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

var showPartnerHand = function(count){
	var cards = Array.apply(undefined, Array(count));
	var hand = cards.map(function(){
		return '<div class="card hidden"></div>';
	}).join('');
	$('#partner > .hand').html(hand);
}

var showOpponentHand = function(leftCount, rightCount){
	var cards = Array.apply(undefined, Array(rightCount));
	var topDistance = -25;
	var htmlTemplate = '<div class="card hidden opponent" style="position: absolute; {{side}}: 35px; top: {{distance}}px;"></div>';
	var hand = cards.map(function(){
		topDistance += 45;
		return htmlTemplate.replace(/{{side}}/g, 'right').replace(/{{distance}}/g, topDistance);
	}).join('');
	$('#right > .hand').html(hand);

	cards = Array.apply(undefined, Array(leftCount));
	topDistance = -25;
	var hand = cards.map(function(){
		topDistance += 45;
		return htmlTemplate.replace(/{{side}}/g, 'left').replace(/{{distance}}/g, topDistance);
	}).join('');
	$('#left > .hand').html(hand);
}
var showCards = function(status){
	showMyHand(status.me.hand);
	showPartnerHand(status.partner.hand);
	showOpponentHand(status.opponent_1.hand, status.opponent_2.hand);
}

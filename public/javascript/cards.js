var getShownCard = function(card, addedClass,z_index){
	var cardColor = card.suit.match(/Heart|Diamond/g) ? 'red' : 'black';
	addedClass = addedClass ? addedClass : '';
	var suits = {
		Heart : '&hearts;',
		Diamond : '&diams;',
		Club : '&clubs;',
		Spade : '&spades;'
	}
	return '<div id="'+card.id+'" class="card '+cardColor +' '+ addedClass+'"  style="z-index:'+ z_index+'">'+
						'<div align="left">'+card.name+'</div>'+
						'<div class="suit">'+suits[card.suit]+'</div>'+
						'<div align="right">'+card.name+'</div>'+
					'</div>';
}

var showMyHand = function (cards){
	var hand = cards.map(function(card,index){
		return getShownCard(card,'my-hand',index);
	}).join('');
	$('#you > .hand').html(hand);
};

var renderHand = function(count,left,top,position){
	var htmlTemplate = '<div class="card hidden" style="margin-left: {{left}}px; margin-top: {{top}}px;"></div>';
	if(position == 'left' || position == 'right')
		var htmlTemplate = '<div class="card hidden rotate-hand" style="margin-left: {{left}}px; margin-top: {{top}}px;"></div>';

	var hand = '';
	for(var index = 0; index < count; index++){
		var l = index == 0 ? 0 : left;
		hand += htmlTemplate.replace(/{{left}}/g, l).replace(/{{top}}/g, top);
		top+=40;
	}
	return hand;
}

var show7thCard = function(_7thCard){
	if(!_7thCard){
		$('#_7thCard').empty();
		return;
	}
	$('#_7thCard').html(getShownCard(_7thCard));
}
var showCards = function(status){
	showMyHand(status.me.hand);
	show7thCard(status.me._7thCard);
	$('#partner > .hand').html(renderHand(status.partner.hand, -50));
	$('#right > .hand').html(renderHand(status.opponent_1.hand, -120,0,'right'));
	$('#left > .hand').html(renderHand(status.opponent_2.hand, -120,0,'left'));
}

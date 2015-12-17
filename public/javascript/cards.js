var shownCard = function(card, addedClass){
	var cardColor = card.suit.match(/Heart|Diamond/g) ? 'red' : 'black';
	var suits = {
		Heart : '&hearts;',
		Diamond : '&diams;',
		Club : '&clubs;',
		Spade : '&spades;'
	}
	return '<div id="'+card.id+'" class="card '+cardColor +' '+ addedClass+'">'+
						'<div align="left">'+card.name+'</div>'+
						'<div align="center" style="padding: 15px">'+suits[card.suit]+'</div>'+
						'<div align="right">'+card.name+'</div>'+
					'</div>';
}

var showMyHand = function (cards){
	var hand = cards.map(function(card){
		return shownCard(card);
	});
	return  hand.join('');
};
var horizontalCards = function (cards){
	if(typeof cards === 'number'){
		cards = Array.apply(undefined, Array(cards));
	}
	var hand = cards.map(function(){
		return '<td class="card hidden"></td>';
	});
	return hand.join('');
};
var verticalCards = function (numberOfCards){
	var hand = [], number = numberOfCards, margin = 0;
	while(number != 0){
		hand.push('<div class="card hidden" style="margin-top:'+margin+'px"></div>');
		number--;
		margin = -70;
	}
	return hand.join('');
};
var showTrump = function(trump){
	var html = '<div class="card hidden"/></div>';
	if(trump)
		html = '<img src="img/' + trump + '.png" />';
	$('#trump').html(html);
};

var showPlayedCards = function(cards){
	var html = '';
	_.forIn(cards, function(value, relation){
		html += shownCard(value.card, relation);
	});
	$('#playedCards').html(html);
};
var showTurn = function(turn,player){
	var id = player == 'me' ? 'mySide' : player;
	$( "#"+id).toggleClass('turn_on', turn);
}
var showBidStatus = function(bid){
	var highestBid = '<b> Top Bid : '+bid.value+'</b>';
	var highestBidder = '<b> Top Bidder : '+bid.player.id.toUpperCase()+'</b>';
	var html = highestBid+'<br><br>'+highestBidder;
	$('#bid_status').html(html);
};
var updateChanges = function(changes){
	var playerHandler = {
		me : showMyHand,
		partner : horizontalCards,
		opponent_1: verticalCards,
		opponent_2: verticalCards
	}

	_.forIn(playerHandler, function(action, player){
		var id = '#'+ player;
		var html = action(changes[player].hand);
		$(id).html(html);
		showTurn(changes[player].turn,player);
	});
	showPlayedCards(changes.playedCards);
	showTrump(changes.trump);
}
var playCard = function(){
	$('#me > div').on('click',function(){
		var id = $(this).attr('id');
		$.post("throwCard", id);
	});
}
var getStatus = function(){
	setInterval(function(){
		$.get("status",function(data){
			var status = JSON.parse(data);
			updateChanges(status);
			playCard();
		});
	},8000);
}
var showTrumpSelectionBox = function(status){
	if(status)
		$('#select_trumps').removeClass('trump_suits');
}
var onPageReady = function(){
	$('#playerName').html(document.cookie.toUpperCase());
	$.get('status',function(status){
		var status = JSON.parse(status);
		updateChanges(status);
		showTrumpSelectionBox(status.isBidWinner);
		playCard();
		showBidStatus(status.bid)
	});
	getStatus();
};
$(document).ready(onPageReady);
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
	var html = '<img src="img/hidden.png" />';
	if(trump)
		html = '<img src="img/' + trump + '.png" />';
	$('#trump').html(html);
};

var showPlayedCard = function(cards){
	var html = '';
	_.forIn(cards, function(value, key){
		html += '<img class="'+key+' card" src="./img/'+value.card.id+'.png"/>';
	});
	$('#playedCards').html(html);
};
var showTurn = function(turn,player){
	$( "#"+player).toggleClass("turn_on", turn );
}
var showBidStatus = function(bid){
	var highestBid = '<b> Top Bid : '+bid.value+'</b>';
	var highestBidder = '<b> Top Bidder : '+bid.player.id.toUpperCase()+'</b>';
	var html = highestBid+'<br><br>'+highestBidder;
	$('#bid_status').html(html);
};

var showScoreCard = function(score){
	var myScore = '<td> Your Team</td><td>' + score.myScore +  '</td>'
	var opponentScore = '<td> Opponent Team</td><td>' + score.opponentScore +  '</td>'
	$('#myTeamScore').html(myScore);
	$('#opponentTeamScore').html(opponentScore);
};

var updateChanges = function(changes){
	var playerHandler = {
		'me' : horizontalCards,
		'partner' : horizontalCards,
		'opponent_1' : verticalCards,
		'opponent_2' : verticalCards
	};
	_.forIn(playerHandler, function(action, player){
		var id = '#'+ player;
		var html = action(changes[player].hand);
		$(id).html(html);
		showTurn(changes[player].turn,player);
	});
	showPlayedCard(changes.playedCards);
	showTrump(changes.trump);
	showScoreCard(changes.score);

}
var playCard = function(){
	$('#me').on('click','td',function(){
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
	},1000);
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
		showBidStatus(status.bid);
	});
	getStatus();
};
$(document).ready(onPageReady);
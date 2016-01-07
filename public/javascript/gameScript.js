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

var showPlayedCards = function(cards){
	var html = '';
	_.forIn(cards, function(value, relation){
		html += shownCard(value.card, relation);
	});
	$('#playedCards').html(html);
};
var playCard = function(){
	$('#me > .playerHand > div').on('click',function(){
		var id = $(this).attr('id');
		$.post("throwCard", {"cardID":id});
	});
}
var showTurn = function(turn,id){
	$(id).toggleClass('turn_on', turn);
}
var showBidStatus = function(bid){
	// var highestBid = '<b> Top Bid : '+bid.value+'</b>';
	// var highestBidder = '<b> Top Bidder : '+bid.player.toUpperCase()+'</b>';
	// var html = highestBid+'<br><br>'+highestBidder;
	// $('#bid_status').html(html);
};

var showScoreCard = function(score){
	var myScore = '<td> Your Team</td><td>' + score.myScore +  '</td>'
	var opponentScore = '<td> Opponent Team</td><td>' + score.opponentScore +  '</td>'
	$('#myTeamScore').html(myScore);
	$('#opponentTeamScore').html(opponentScore);
};
var handleStarting = function(status){
	if(status.isStart)
		dealCard(status);
}
var redirect_to_leaveGame = function(endStatus){
	if(endStatus)
		window.location.assign('leave_game.html');
}

var updateChanges = function(changes){
	redirect_to_leaveGame(changes.end)
	handleStarting(status);
	showTrumpSelectionBox(changes.isBidWinner);
	var playerHandler = {
		partner : horizontalCards,
		opponent_1: verticalCards,
		opponent_2: verticalCards
	}

	_.forIn(playerHandler, function(action, player){
		var id = '#'+ player;
		var html = action(changes[player].hand);
		$(id).html(html);
		showTurn(changes[player].turn,id);
	});
	$('#me > .playerHand').html(showMyHand(changes.me.hand));
	if(changes.me.turn)
		$("#me").css("background-color","green");
	else
		$("#me").css("background-color","white");
	playCard();

	showPlayedCards(changes.playedCards);
	showTrump(changes.trump);
	showScoreCard(changes.score);

}
var getStatus = function(){
	setInterval(function(){
		$.get("status",function(data){
			var status = JSON.parse(data);
			updateChanges(status);

		});
	},500);
}
var showTrumpSelectionBox = function(status){
	if(status){
		$('#select_trumps').removeClass('trump_suits');
		showTrumpOptions();
	}
}
var dealCard = function(status){
	$('#deal').css("visibility","hidden");
	if(status.isDealer){
		$('#deal').css("visibility","visible");
		$('#deal').click(function(){
			$.post('deal', function(){
				// $('#deal').css("visibility","hidden");
			});
		});
	}

}
var onPageReady = function(){
	revealTrump();
	var name = parseCookie(document.cookie).name;
	$('#playerName').html(name.toUpperCase());
	$.get('status',function(status){
		var status = JSON.parse(status);
		dealCard(status);
		showTrumpSelectionBox(status.isBidWinner);
		updateChanges(status);
		showBidStatus(status.bid);
	});
	getStatus();
};
$(document).ready(onPageReady);

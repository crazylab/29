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

var showBidStatus = function(bid){
	if(!bid.player) return;
	var highestBid = '<b> Top Bid : '+bid.value+'</b>';
	var highestBidder = '<b> Top Bidder : '+bid.player.toUpperCase()+'</b>';
	var html = highestBid+'<br><br>'+highestBidder;
	$('#bid_status').html(html);
};

var showScoreCard = function(score){
	var myScore = '<td> Your Team</td><td>' + score.myScore +  '</td>'
	var opponentScore = '<td> Opponent Team</td><td>' + score.opponentScore +  '</td>'
	$('#myTeamScore').html(myScore);
	$('#opponentTeamScore').html(opponentScore);
};
var handleStarting = function(status){
	if(status.isDealer)
		$('#deal').css("visibility","visible");
	if(status.isStart)
		dealCard(status);
}
var updateChanges = function(status){
	redirect_to_leaveGame(status.end)
	handleStarting(status);
	showTrumpSelectionBox(status.isBidWinner);
	// ---------
	showCards(status);
	showTurn(status);
	// ---------
	playCard();

	showPlayedCards(status.playedCards);
	showTrump(status.trump);
	showBidStatus(status.bid);

	showScoreCard(status.score);

}
var getStatus = function(){
	setInterval(function(){
		$.get("status",function(data){
			var status = JSON.parse(data);
			updateChanges(status);
			dealCard(status);
		});
	},500);
}
var showTrumpSelectionBox = function(status){
	// if(status){
		// $('#select_trumps').removeClass('trump_suits');
		showTrumpOptions();
	// }
}
var dealCard = function(status){
	if(status.isDealer){
		$('#deal').one('click', function(){
			$.post('deal');
			$('#deal').css("visibility","hidden");
		});
	}
}
var onPageReady = function(){
	revealTrump();
	var name = parseCookie(document.cookie).name;
	$('#you > .name').html(name.toUpperCase());
	$.get('status',function(status){
		var status = JSON.parse(status);
		if(status.isDealer)
			$('#deal').css("visibility","visible");
		dealCard(status);
		showTrumpSelectionBox(status.isBidWinner);
		updateChanges(status);
	});
	getStatus();
};
$(document).ready(onPageReady);

var showScore = function(score){
	$('#your_score').html(score.myScore);
	$('#opponent_score').html(score.opponentScore);
};

var showPoint = function(point){
	$('#your_point').html(point.myTeamPoint);
	$('#opponent_point').html(point.opponentTeamPoint);
};
var handleStarting = function(status){
	if(!status.isDealComplete){
		$('#deal').css("visibility","visible");
		$('#trump').html('');
		$('#trump').removeClass('card hidden');
	}
}
var updateChanges = function(status){
	redirect_to_leaveGame(status.end)
	handleStarting(status);
	showTrumpSelectionBox(status.isBidWinner);
	// ---------
	showCards(status);
	showTurn(status);
	showHiddenTrumpCard(status.isTrumpSet);
	showBiddingBoard(status.isCurrentBidder);
	// ---------
	playCard();

	showPlayedCards(status.playedCards);
	showTrump(status.trump);
	showBidStatus(status.bid);

	showScore(status.score);
	showPoint(status.point);

}
var getStatus = function(){
	setInterval(function(){
		$.get("status",function(data){
			var status = JSON.parse(data);
			updateChanges(status);
			dealCard(status.isDealComplete);
		});
	},500);
}
var dealCard = function(dealStatus){
	if(dealStatus)
		$('#deal').css("visibility","hidden");
	else
		$('#deal').one('click', function(){
			$.post('deal');
		});
}
var onPageReady = function(){
	revealTrump();
	var name = parseCookie(document.cookie).name;
	$('#you > .name').html(name.toUpperCase());
	$.get('status',function(status){
		var status = JSON.parse(status);
		dealCard(status.isDealComplete);
		updateChanges(status);
	});
	getStatus();
};
$(document).ready(onPageReady);

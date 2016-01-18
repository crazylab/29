var showScore = function(score){
	$('#your_score').html(score.myScore);
	$('#opponent_score').html(score.opponentScore);
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
	showHiddenTrumpCard(status.isTrumpSet);
	// ---------
	playCard();

	showPlayedCards(status.playedCards);
	showTrump(status.trump);
	showBidStatus(status.bid);

	showScore(status.score);

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
var showTrumpSelectionBox = function(status){
	// if(status){
		// $('#select_trumps').removeClass('trump_suits');
		showTrumpOptions();
	// }
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
		showTrumpSelectionBox(status.isBidWinner);
		updateChanges(status);
	});
	getStatus();
};
$(document).ready(onPageReady);

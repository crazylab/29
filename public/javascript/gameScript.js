var showMessage = function(message){
	$('.message').html(message);
	$('.message').fadeOut(3000, function(){
		$('.message').html('').css('display', 'inline');
	});
}
var showScore = function(score){
	$('#your_score').html(' : '+score.myScore);
	$('#opponent_score').html(' : '+score.opponentScore);
};

var showPoint = function(status){
	$('#your_point').html('YOU('+status.me.point+')');
	$('#your_partner_point').html('PARTNER('+status.partner.point+')');
	$('#opponent_right_point').html('RIGHT('+status.opponent_1.point+')');
	$('#opponent_left_point').html('LEFT('+status.opponent_2.point+')');

};
var handleStarting = function(isDealComplete){
	if(!isDealComplete){
		$('#deal').css("visibility","visible");
		$('#trump').html('');
		$('#trump').removeClass('card hidden');
		putClickInBid();
	}
};
var dealCard = function(dealStatus){
	if(dealStatus){
		$('.deal').hide();
		$('.deck').hide();
	}
	else{
		$('.deck').show();
		$('.deal').show();
		$('.deal').click(function(){
			$.post('deal');
		});
	}
};
var redirect_to_leaveGame = function(endStatus){
	if(endStatus)
		window.location.assign('leave_game.html');
};

var updateChanges = function(status){
	redirect_to_leaveGame(status.end);
	showCards(status);
	showTurn(status);
	showHiddenTrumpCard(status.isTrumpSet);
	showBiddingBoard(status.isCurrentBidder);
	handleStarting(status.isDealComplete);
	showPlayedCards(status.playedCards);
	showScore(status.score);
	showTrumpSelectionBox(status.isBidWinner);
	showTrump(status.trump);
	showBidStatus(status.bid);
	showPoint(status);
	playCard(status.me.turn);
	showWhoHasPair(status.pair)
}
var getStatus = function(){
	var statusCall = setInterval(function(){
		$.get("status",function(data){
			var status = JSON.parse(data);
			updateChanges(status);
			dealCard(status.isDealComplete);
		});
	},1000);
	return statusCall;
}
var onPageReady = function(){
	revealTrump();
	$.get('status',function(status){
		var status = JSON.parse(status);
		dealCard(status.isDealComplete);
		updateChanges(status);
	});
	getStatus();
};
$(document).ready(onPageReady);

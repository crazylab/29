var showMessage = function(message){
	$('.message').html(message);
	$('.message').fadeOut(3000, function(){
		$('.message').html('').css('display', 'inline');
	});
}
var showScore = function(score){
	$('#your_score').html(score.myScore);
	$('#opponent_score').html(score.opponentScore);
};

var showPoint = function(point){
	$('#your_point').html('YOU('+point.myTeamPoint+')');
	$('#your_partner_point').html('PARTNER('+point.myTeamPoint+')');
	$('#opponent_left_point').html('LEFT('+point.opponentTeamPoint+')');
	$('#opponent_right_point').html('RIGHT('+point.opponentTeamPoint+')');

};
var handleStarting = function(isDealComplete){
	if(!isDealComplete){
		$('#deal').css("visibility","visible");
		$('#trump').html('');
		$('#trump').removeClass('card hidden');
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
	showPoint(status.point);
	playCard(status.me.turn);
	showWhoHasPair(status.pair)
}
var getStatus = function(){
	setInterval(function(){
		$.get("status",function(data){
			var status = JSON.parse(data);
			updateChanges(status);
			dealCard(status.isDealComplete);
		});
	},1000);
}
var onPageReady = function(){
	revealTrump();
	// var name = parseCookie().name;
	// $('#you > .name').html(name.toUpperCase());
	$.get('status',function(status){
		var status = JSON.parse(status);
		dealCard(status.isDealComplete);
		updateChanges(status);
	});
	getStatus();
};
$(document).ready(onPageReady);

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
	$('#your_point').html(point.myTeamPoint);
	$('#opponent_point').html(point.opponentTeamPoint);
};
var handleStarting = function(isDealComplete){
	if(!isDealComplete){
		$('#deal').css("visibility","visible");
		$('#trump').html('');
		$('#trump').removeClass('card hidden');
	}
};
var dealCard = function(dealStatus){
	if(dealStatus)
		$('.deal').css("visibility","hidden");
	else{
		$('.deal').css("visibility","visible");
		$('.deal').click(function(){
			$.post('deal');
		});
	}
};

var updateChanges = function(status){
	redirect_to_leaveGame(status.end)
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
var menu = function(){
	$('#leave').click(on_closing_tab);
}
var onPageReady = function(){
	menu();
	revealTrump();
	handleLeaveRequest();
	var name = parseCookie().name;
	$('#you > .name').html(name.toUpperCase());
	$.get('status',function(status){
		var status = JSON.parse(status);
		dealCard(status.isDealComplete);
		updateChanges(status);
	});
	getStatus();
};
$(document).ready(onPageReady);

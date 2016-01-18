var postTrump = function () {
	var trumpSuit = $(this).attr('id');
	$.post("setTrump", {trump: trumpSuit}, function(){
		$('#trump').addClass('card hidden');
		window.location.href='#';
	});
};
var showTrumpOptions = function(){
		var cards = {
			D2 : {id: 'D2', suit: 'Diamond', name: '2'},
			C2 : {id: 'C2', suit: 'Club', name: '2'},
			H2 : {id: 'H2', suit: 'Heart', name: '2'},
			S2 : {id: 'S2', suit: 'Spade', name: '2'}
		}
		var trumpSuites = '';
		_.forIn(cards, function(card, id){
			trumpSuites += getShownCard(card);
		});
		$('#trump_options > span').html(trumpSuites);

		$('#D2').on('click', postTrump);
		$('#C2').on('click', postTrump);
		$('#H2').on('click', postTrump);
		$('#S2').on('click', postTrump);
};
var showTrumpSelectionBox = function(isBidWinner){
	if(isBidWinner){
		showTrumpOptions();
		window.location.href = '#trump_options';
	}
}
var showTrump = function(trump){
	if(trump){
		var cards = {
			D2 : {id: 'D2', suit: 'Diamond', name: '2'},
			C2 : {id: 'C2', suit: 'Club', name: '2'},
			H2 : {id: 'H2', suit: 'Heart', name: '2'},
			S2 : {id: 'S2', suit: 'Spade', name: '2'}
		};
		html = getShownCard(cards[trump]);
		$("#trump").unbind();
		$('#trump').html(html);
	}
};
var revealTrump = function(){
	$('#trump').on('click', function(){
		$.get('getTrump');
		$('#trump').revealTrump('card hidden');
	});
}
var showHiddenTrumpCard = function(isTrumpSet){
	if(isTrumpSet)
	$('#trump').addClass('card hidden');
}

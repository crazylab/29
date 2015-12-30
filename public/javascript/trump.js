var postTrump = function () {
	var content = '<div class="card hidden"></div>';
	var trumpSuit = $(this).attr('id');
	$.post("setTrump", {trump: trumpSuit});
	$('#select_trumps').addClass('trump_suits');
	$('.trump').html(content);
};
var showTrumpOptions = function(){
		var cards = {
			D2 : {id: 'D2', suit: 'Diamond', name: '2'},
			C2 : {id: 'C2', suit: 'Club', name: '2'},
			H2 : {id: 'H2', suit: 'Heart', name: '2'},
			S2 : {id: 'S2', suit: 'Spade', name: '2'}
		}
		_.forIn(cards, function(card, id){
			var html = shownCard(card);
			$('#'+id).html(html).on('click', postTrump);
		});
};
var showTrump = function(trump){
	var html = '<div class="card hidden"/></div>';
	if(trump){
		var cards = {
			D2 : {id: 'D2', suit: 'Diamond', name: '2'},
			C2 : {id: 'C2', suit: 'Club', name: '2'},
			H2 : {id: 'H2', suit: 'Heart', name: '2'},
			S2 : {id: 'S2', suit: 'Spade', name: '2'}
		};
		html = shownCard(cards[trump]);
		$("#trump").unbind();
	}
	$('#trump').html(html);
};
var revealTrump = function(){
	$('#trump').on('click', function(){
		$.get('getTrump');
	});
}
	var onReady = function () {
	var postTrump = function () {
		var content = '<div class="card hidden"></div>';
		var trumpSuit = $(this).attr('id');
		$.post("setTrump", {trump: trumpSuit});
		$('#select_trumps').addClass('trump_suits');
		$('.trump').html(content);
	};

	// this function is related to the highest bidder.Use if necessary
	$(function () {
		$('#highestBidder').click(function (){
			$('#select_trumps').removeClass('trump_suits');
		});
	});
	var showTrumpOptions = function(){
		$.get('getTrump',function(data) {
			var cards = {
				D2 : {id: 'D2', suit: 'Diamond', name: '2'},
				C2 : {id: 'C2', suit: 'Club', name: '2'},
				H2 : {id: 'H2', suit: 'Heart', name: '2'},
				S2 : {id: 'S2', suit: 'Spade', name: '2'}
			}
			$('.trump').attr('disabled', 'disabled');
			$('.trump').html(shownCard(cards[data]));
		});
	};

	$('.trump').one('click', showTrumpOptions);

	$('#C2').html(shownCard({
		id : 'C2',
		name: '2',
		suit: 'Club'
	})).on("click", postTrump);

	$('#D2').html(shownCard({
		id : 'D2',
		name: '2',
		suit: 'Diamond'
	})).on("click", postTrump);

	$('#S2').html(shownCard({
		id : 'S2',
		name: '2',
		suit: 'Spade'
	})).on("click", postTrump);

	$('#H2').html(shownCard({
		id : 'H2',
		name: '2',
		suit: 'Heart'
	})).on("click", postTrump);
	// $('#C2')
	// $('#D2').on("click", postTrump);
	// $('#S2').on("click", postTrump);
	// $('#H2').on("click", postTrump);
};

$(document).ready(onReady);
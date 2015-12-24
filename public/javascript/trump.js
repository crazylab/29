var onReady = function () {
	var postTrump = function () {
		var content = '<div class="card hidden"></div>';
		$.post("setTrump", $(this).attr('id'));
		$('#select_trumps').addClass('trump_suits');
		$('.trump').html(content);
	};

	// this function is related to the highest bidder.Use if necessary
	$(function () {
		$('#highestBidder').click(function (){
			$('#select_trumps').removeClass('trump_suits');
		});
	});
	var showTrump = function(){
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

	$(function () {
		$('.trump').one('click', showTrump);
	});

	$('#C2').html(shownCard({
		id : 'C2',
		name: '2',
		suit: 'Club'
	}));
	$('#D2').html(shownCard({
		id : 'D2',
		name: '2',
		suit: 'Diamond'
	}));$('#S2').html(shownCard({
		id : 'S2',
		name: '2',
		suit: 'Spade'
	}));$('#H2').html(shownCard({
		id : 'H2',
		name: '2',
		suit: 'Heart'
	}));
	$('#C2').on("click", postTrump);
	$('#D2').on("click", postTrump);
	$('#S2').on("click", postTrump);
	$('#H2').on("click", postTrump);
};

$(document).ready(onReady);
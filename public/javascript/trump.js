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
			$('.trump').attr('disabled', 'disabled');
			$('.trump').html('<img src=img/'+data+'.png />');
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
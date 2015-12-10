var onReady = function () {
	var postTrump = function () {
		var content = '<img src="img/hidden.png" />';
		$.post("setTrump", $(this).attr('id'));
		$('#select_trumps').addClass('trump_suits');
		$('.trump').html(content);
	};
	$(function () {
		$('#C2').on("click", postTrump);
		$('#D2').on("click", postTrump);
		$('#S2').on("click", postTrump);
		$('#H2').on("click", postTrump);
	});	

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
};

$(document).ready(onReady);
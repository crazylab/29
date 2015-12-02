var onReady = function () {
	var postTrump = function () {
		var content = '<img src="img/hidden.png" />';
		$.post("setTrump", $(this).attr('id'));
		$('#trumps').addClass('trump_suits');
		$('.trump').html(content);
	};
	$(function () {
		$('#club').on("click", postTrump);
		$('#diamond').on("click", postTrump);
		$('#spade').on("click", postTrump);
		$('#heart').on("click", postTrump);
	});	

	// this function is related to the highest bidder.Use if necessary
	$(function(){
		$('#highestBidder').click(function(){
			$('#trumps').removeClass('trump_suits');
		});
	});
};

$(document).ready(onReady);
var onReady = function () {
	var postTrump = function () {
		var content = '<img src="img/hidden.png" />';
		$.post("setTrump", $(this).attr('id'));
		$('#trumps').addClass('trump_suits');
		$('.trump').html(content);
	};
	$(function () {
		$('#C2').on("click", postTrump);
		$('#D2').on("click", postTrump);
		$('#S2').on("click", postTrump);
		$('#H2').on("click", postTrump);
	});	

	// this function is related to the highest bidder.Use if necessary
	$(function(){
		$('#highestBidder').click(function(){
			$('#trumps').removeClass('trump_suits');
		});
	});

	$(function(){
		$('.trump').click(function(){
			$.get('getTrump',function(data){
				$('.trump').html('<img src=img/'+data+'.png />');
			});
		});
	});

};

$(document).ready(onReady);
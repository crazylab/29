var putClickInBid = function(){
    $('.select_bid td').each(function(index){
        $( this ).one('click', function(){
            $.post("bid", {value: $(this).text()});
            $(this).css("background-color","#804000");
        });
    });
}
var showBidStatus = function(bid){
	if(!bid.player) return;
	$('#bidValue').html(bid.value);
	$('#topBidder').html(bid.player.toUpperCase());
};
$(document).ready(putClickInBid);

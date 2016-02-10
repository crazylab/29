var putClickInBid = function(bidValue){
    $('#bid > span > div').each(function(index){
        $( this ).on('click', function(){
            $.post("bid", {value: $(this).text()});
            $(this).css("background-color","#804000");
            window.location.href = '#';
        });
    });
}
var showBidStatus = function(bid){
	if(!bid.player) return;
    var bidResult = ' : '+bid.player.toUpperCase() + '(' + bid.value + ')';
	$('#bidWinner').html(bidResult);
};
var showBiddingBoard = function(currentPlayer){
    if(currentPlayer)
        window.location.href = '#bid';
}
$(document).ready(putClickInBid)

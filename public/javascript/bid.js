var putClickInBid = function(){
    $('#bid > span > div').each(function(index){
        $( this ).on('click', function(){
            $.post("bid", {value: $(this).text()});
            $(this).css("background-color","#804000");
            window.location.href = '#';
        });
        $(this).css("background-color","#FF8C00");
    });
}
var showBidStatus = function(bid){
	if(!bid.player) return;
    var bidResult = ' : '+bid.player.toUpperCase() + '(' + bid.value + ')';
	$('#bidWinner').html(bidResult);
    $('#bid > span > div').each(function(){
        if($(this).text() < bid.threshold)
            $(this).css("background-color","#804000").unbind();
    });
};
var showBiddingBoard = function(currentPlayer){
    if(currentPlayer)
        window.location.href = '#bid';
}
$(document).ready(putClickInBid)

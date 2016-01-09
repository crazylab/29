var putClickInBid = function(){
    $('.select_bid td').each(function(index){
        $( this ).one('click', function(){
            $.post("bid", {value: $(this).text()});
            $(this).css("background-color","#804000");
        });
    });
}
$(document).ready(putClickInBid);

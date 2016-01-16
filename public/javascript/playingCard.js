var showTurn = function(status){
	$('#you').toggleClass('turn_on', status.me.turn);
	$('#partner').toggleClass('turn_on', status.partner.turn);
	$('#right').toggleClass('turn_on', status.opponent_1.turn);
	$('#left').toggleClass('turn_on', status.opponent_2.turn);
}

var playCard = function(){
	$('#you > .hand > div').on('click',function(){
		var id = $(this).attr('id');
		$.post("throwCard", {"cardID":id});
	});
}

var showPlayedCards = function(cards){
	var html = '';
    var positions = {
        me : 'bottom',
        partner : 'top',
        opponent_1 : 'right',
        opponent_2 : 'left'
    };
	_.forIn(cards, function(value, relation){
        var card =
		html += getShownCard(value.card, positions[relation]+'_card');
	});
	$('#played_cards').html(html);
};

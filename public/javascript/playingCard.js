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
        you : 'bottom',
        partner : 'top',
        right : 'right',
        left : 'left'
    };
	cards.forEach(function(played_card){
		html += getShownCard(played_card.card, positions[played_card.relation]+'_card');
	});
	$('#played_cards').html(html);
};
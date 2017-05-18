$(function() {  
	var content_height = 300;

	$('#messageBox').height(content_height);
});

function character(name, ref, attack, hp, counterAttack, img) {
	this.name = name;
	this.ref = ref;
	this.attack = attack;
	this.baseAttack = attack;
	this.hp = hp;
	this.counterAttack = counterAttack;
	this.playerChar = false;
	this.img = img;
};

var charList = [];
var playerChar;
var gameOn;

function attack(charA, charB) {
	sendMessage(charA.name + " attacks " + charB.name);
	// var img = $('<img />',
 //             { id: 'ball',
 //               src: 'assets/images/ball.png', 
 //               width: 30,
 //             })
 //              .appendTo($('#gameBox'));
 //    var charAPosition = $('#'+charA.ref).children('.row').children('img').position();
 //    console.log(charAPosition);
 //              $('#ball').css({top: charAPosition.top, left: charAPosition.left, position:'absolute'});
 //              $('#ball').animate({ top: "+=200px"}, "normal");
	charB.hp = Math.max(charB.hp-charA.attack,0);
	setTimeout(sendMessage(charA.name + " hits " + charB.name + " for " + charA.attack + " damage. " + charB.name + " has " + charB.hp + " hp remaining."),2500);
	charA.attack += charA.baseAttack;
	sendMessage(charA.name + "'s attack raised to " + charA.attack);
	if(charB.hp > 0) {
		charA.hp = Math.max(charA.hp-charB.counterAttack,0);
		if (charA.hp<=0) {
			sendMessage(charB.name + " counterattacks for " + charB.counterAttack + " damage. " + charA.name + " has no hp remaining.");
			sendMessage("You lose. Game Over!");
			gameOn = false;
		}
		else {
			sendMessage(charB.name + " counterattacks for " + charB.counterAttack + " damage. " + charA.name + " has " + charA.hp + " hp remaining.");
		}
	} else { 
		sendMessage(charB.name + " fainted.");
	}
	refreshBoard();
}

function setUpBoard() {
	charList = [new character("Obi-Wan", 'obiwan', 13, 110, 5, 'assets/images/obiwan.jpg'), new character("Vader", 'vader', 15, 200, 25, 'assets/images/vader.jpg'), new character("Jar Jar", 'jarjar', 14, 75, 20, 'assets/images/jarjar.jpg'), new character("Kylo Ren", 'kyloren', 12, 120, 10, 'assets/images/kylo.jpg')];
	gameBox = $('#gameBox');
	sendMessage('------NEW GAME------')
	gameBox.empty();
	gameBox.append($('<div>').addClass('row').append($('<div>').addClass('col-sm-12').text('Select a character:')));
	$.each(charList, function(index, value){
		gameBox.append($('<div>').addClass("char col-sm-3").attr('id',value.ref).data('attachedChar', value).
			append($('<div>').addClass('row').
				append($('<img>').addClass('col-sm-12').attr('src',value.img)).
					append($('<div>').addClass('col-sm-12 hp').attr('id',value.ref+'hp').text('HP: '+value.hp))));
	});
	$(".char").on("click", function() {
        // This should only function on the first click
        var selectedCharStr = this.id;
        //console.log(this.id);
        $('#messageBox').empty();
        sendMessage("You've selected " + $(this).data('attachedChar').name);
        selectCharacter($(this).data('attachedChar'));
    });

}

function sendMessage(str) {
	$('#messageBox').prepend($('<p>').text(str));
}

function refreshBoard() {
	var winConditions = true;
	$.each(charList, function(index, value){
		$("#"+value.ref+'hp').text('HP: '+value.hp);
		if(value.hp<=0) {
			$("#"+value.ref).empty();
		} else if (value.playerChar === false) {
			winConditions = false;
		}
	});
	if (winConditions) {
		gameOn = false;
		sendMessage("Congrats! You Win!!");
		sendMessage("Press New Game to start a new game")
	} 
}

function selectCharacter(char) {
	char.playerChar = true;
	playerChar = char;
	gameOn = true;
	var gameBox = $('#gameBox');
	var playerSide = $('<div>').addClass('row').append($('<div>').addClass('col-sm-12 boardlabel').text('Player 1:'));
	var opponentsSide = $('<div>').addClass('row').append($('<div>').addClass('col-sm-12 boardlabel').text('Enemies:'));
	$.each(charList, function(index, value){
		if (value.playerChar) {
			playerSide.append($('<div>').addClass("char col-sm-6 col-sm-offset-3").attr('id',value.ref).data('attachedChar', value).
				append($('<div>').addClass('row').
					append($('<img>').addClass('col-sm-12').attr('src',value.img)).
						append($('<div>').addClass('col-sm-12 hp').attr('id',value.ref+'hp').text('HP: '+value.hp))));
		} else {
			opponentsSide.append($('<div>').addClass("char enemy col-sm-4").attr('id',value.ref).data('attachedChar', value).
				append($('<div>').addClass('row').
					append($('<img>').addClass('col-sm-12').attr('src',value.img)).
						append($('<div>').addClass('col-sm-12 hp').attr('id',value.ref+'hp').text('HP: '+value.hp))));
		}
	});
	gameBox.empty();
	gameBox.append(playerSide);
	gameBox.append(opponentsSide);
	//Add new on-click for enemies, as apparently the enemies have to be loaded beforehand
	$(".enemy").on("click", function() {
        //Attack!
        if(gameOn) {
        	attack(playerChar,$(this).data('attachedChar'));
        }
    });
}

setUpBoard();

$("#newGame").on("click", function() {
	setUpBoard();
});

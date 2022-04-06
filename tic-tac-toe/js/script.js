var players          = ["", ""];  // Player names
var playerMarkers    = ["", ""];  // Player markers
var playerPoints     = [0, 0];    // Player points based on the tiles they have claimed.
var playerWinCounts  = [0, 0];    // Number of times each player has won.
var whoseTurn        = 0;         // For tracking player turns.
var winningSequences = [7, 56, 73, 84, 146, 273, 292, 448];  // Winning tile combinations.

// Begin collecting player info when play button is pressed
function playButton()
{
	document.getElementById("play-button").className = "hide";
	document.getElementById("player-info-collection").className = "show";
	document.getElementById("player-one-name").focus();
}

// Get player names and markers
function getPlayerInfo(index, playerName, markerOptions)
{	
	players[index] = document.getElementById(playerName).value;  // Get player name
	
	// Get player marker
	var radioButtons = document.getElementsByName(markerOptions);
	for (var i = 0; i < radioButtons.length; i++)
	{
		if (radioButtons[i].checked)
		{
			playerMarkers[index] = radioButtons[i].value;
			break;
		}
	}
	
	// Switch to the player 2 form if player 1's info has been received
	if (players[0] != "" && players[1] == "")
	{
		document.getElementById("player-one-info").className = "hide";
		document.getElementById("player-two-info").className = "show";
		document.getElementById("player-two-name").focus();
	}
	else if (players[1] != "")  // Start game if player 2's info has been received
	{
		startGame();
	}
}

// Start game
function startGame()
{
	// Hide player information collection forms and display game board
	document.getElementById("player-info-collection").className = "hide";
	document.getElementById("game-board").className = "show";
	
	// Display player names, wins, and game events
	document.getElementById("game-info").className = "show";
	document.getElementById("player-one").innerHTML = players[0];
	document.getElementById("player-two").innerHTML = players[1];
	document.getElementById("event-message").innerHTML = players[whoseTurn];
}

// Allow players to claim board tiles
function playerMove(selectedDiv, tileValue)
{
	if (!isWin(playerPoints[whoseTurn]))  // Only allow moves if no one has won yet
	{
		// Insert current player's marker into the selected board tile
		selectedDiv.innerHTML = '<img src=' + playerMarkers[whoseTurn] + ' width="140px" height="140px">';
		selectedDiv.removeAttribute("onclick");  // Prevent claimed tiles from being claimed again
		
		playerPoints[whoseTurn] += tileValue;  // Add tile's value to player's current game score
		
		// End game if a player achieves a winning combination or if all tiles are claimed without a winner
		if (isWin(playerPoints[whoseTurn]) || playerPoints[0] + playerPoints[1] == 511)
		{
			gameOver();
		}
		else  // If no one has won and tiles remain, move to the next player's turn
		{
			takeTurns();
			
			// Display current player's turn
			document.getElementById("event-message").innerHTML = players[whoseTurn];
		}
	}
}

// Take turns between players
function takeTurns()
{
	if (whoseTurn == 0)  // If currently player 1's turn, switch to player 2's turn
		{
			whoseTurn++;
		}
		else  // If currently player 2's turn, switch to player 1's turn
		{
			whoseTurn--;
		}
}

// Check for win.
function isWin(playerScore)
{
	/*
	 * Compare each winning sequence against the player's current score, and if a winning
	 * combination of bits is found, indicate a win.
	 */
	for (var i = 0; i < winningSequences.length; i++)
	{
		if (winningSequences.includes(playerScore & winningSequences[i]))
		{
			return true;
			break;
		}
	}
}

// End current game
function gameOver()
{
	// Hide player turn indicator
	document.getElementById("player-turn").className = "hide";
	
	/* 
	 * On a win, play win sound effect, display name of the player who won, and increment their
	 * win counter.
	 */
	if (isWin(playerPoints[whoseTurn]))
	{
		var winSound = new Audio('js/win.wav');
		
		// Display winner's name
		document.getElementById("event-message").innerHTML = players[whoseTurn] + " Wins!";
		winSound.play();  // Play win sound
		
		// Increment winner's win counter
		playerWinCounts[whoseTurn]++;
		var newScore = playerWinCounts[whoseTurn].toString();
		if (whoseTurn == 0)
		{
			document.getElementById("player-one-score").innerHTML = newScore.padStart(2, '0');
		}
		else
		{
			document.getElementById("player-two-score").innerHTML = newScore.padStart(2, '0');
		}
	}
	// Notify players when a cat's game occurs and play a loss sound effect
	else
	{
		var lossSound = new Audio('js/loss.wav');
		
		document.getElementById("event-message").innerHTML = "Cat's Game!";  // Display cat's game message
		lossSound.play();  // Play loss sound
	}
	
	// Display rematch button
	document.getElementById("rematch-button").className = "show";
	document.getElementById("rematch-button").focus();
}

// Reset board and start new game where previous loser goes first
function rematch()
{
	takeTurns();  // Move to next player's turn so that they can have the first move next game
	playerPoints.fill(0);  // Reset player points back to zero
	
	// Rebuild HTML that creates a blank game board
	var boardTiles = "";
	for (var i = 0; i < 3; i++)
	{
		boardTiles += '<div id="row-' + (i + 1) + '">';
		for (var j = 0; j < 3; j++)
		{
			boardTiles += '<div onclick="playerMove(this, ' + (Math.pow(2, j) * Math.pow(8, i)) + ');"></div>';
		}
		boardTiles += '</div>';
	}
	document.getElementById("game-board").innerHTML = boardTiles;
	
	// Display player turn notifier and hide rematch button
	document.getElementById("player-turn").className = "show";
	document.getElementById("event-message").innerHTML = players[whoseTurn];
	document.getElementById("rematch-button").className = "hide";
}
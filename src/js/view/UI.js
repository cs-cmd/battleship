import controller from "../controller/Controller.js";
import GameInitializer from "./GameInitializer.js";
import '../../res/gameboard-styles.css';
import '../../res/page-styles.css';

// UI elements
const playerGameboard = document.querySelector('.gameboard.player');
const aiGameboard = document.querySelector('.gameboard.ai');
const directionDiv = document.querySelector('.direction-info');

// Controls whether player can make a strike or place their own pieces
let isPlayerTurn = false;
let isPlacement = true;

// Writes status message to status text element
function writeStatusText(msg) {
    const gameStatusHeader = document.getElementById('status-text');
    gameStatusHeader.innerText = msg;
}

// Marks the start of the game
function beginGame() {
    isPlayerTurn = true;

    // Hide direction section from user
    directionDiv.classList.add('hidden');
    
    // reset tiles
    gameInit.resetTiles();
    isPlacement = false;

    writeStatusText('Choose enemy node');
}

// game initialization object
const gameInit = GameInitializer(beginGame, writeStatusText);

// used for when the tile is placed and display preview needs to be updated
function handlePreviewMouseOver(evt) {
    let i = parseInt(evt.target.getAttribute('x'));
    let j = parseInt(evt.target.getAttribute('y'));
    
    handlePreview(i, j);
}

// reset's tiles styling
function handlePreviewMouseOut() {
    gameInit.resetTiles();
}

// Determines if the preview will actually be displayed
// does nothing if not in placement mode
function handlePreview(x, y) {
    if(!isPlacement) {
        return;
    }
    gameInit.displayShipPreview(x, y);
}

// add tiles to page
for(let i = 0; i < 10; i++) {
    for(let j = 0; j < 10; j++) {
        // create base tile
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.setAttribute('x', i);
        tile.setAttribute('y', j);

        // clone for player tile
        const playerTile = tile.cloneNode();
        // resets tiles, places piece, then redraws preview
        playerTile.addEventListener('click', () => {
            handlePreviewMouseOut();
            gameInit.placeShipPiece(i, j, controller);
            handlePreview(i, j);
        });

        // handles preview for ship placement
        playerTile.addEventListener('mouseover', handlePreviewMouseOver);
        playerTile.addEventListener('mouseout', handlePreviewMouseOut);

        // clone for AI tile
        const aiTile = tile.cloneNode();
        aiTile.addEventListener('click', () => {
            handleTileClick(aiTile);
        });

        playerGameboard.appendChild(playerTile);
        aiGameboard.appendChild(aiTile);
    }
}

// handles the tile click
function handleTileClick(tile) {
    // if not the players turn, 
    // is the placement phase,
    // or the tile was already hit, 
    // return
    if (isPlayerTurn === false ||
        isPlacement === true ||
        tile.classList.contains('was-hit')) {
        return;
    }

    // prevent player from attacking until their turn
    isPlayerTurn = false;

    // get coords of tile clicked
    const x = parseInt(tile.getAttribute('x'));
    const y = parseInt(tile.getAttribute('y'));

    // attemp to launch attack on board
    const moveTurn = controller.makeTurn(x, y);

    // moveTurn is null if move was invalid
    if(moveTurn === null) {
        isPlayerTurn = true;
        console.log(`:: ERROR: Invalid move: ${moveTurn} ::`);
        return;
    }

    // load player message and win status
    const playerMsg = moveTurn.playerRes.msg;
    const playerWins = moveTurn.playerRes.hasNoShips;

    // resolve the move; if player won, return (game over)
    if(resolveAttack('Player', tile, playerMsg, playerWins)) {
        return;
    }

    // load ai move message and win status
    const aiMsg = moveTurn.aiRes.msg;
    const aiWins = moveTurn.aiRes.hasNoShips;

    // get the tile that the AI has selected
    const aiSelectedTile = document.querySelector(`.player .tile[x='${moveTurn.aiX}'][y='${moveTurn.aiY}']`);
    
    // if the tile is not valid, error, return 
    if(aiSelectedTile === null) {
        console.log(`:: ERROR: Player board tile (${moveTurn.aiX},${moveTurn.aiY}) not found ::`);
        // display error message
        // display reset button
        return;
    }

    // resolve the move; if the AI has won, return (game over)
    if (resolveAttack('Computer', aiSelectedTile, aiMsg, aiWins)) {
        return;
    }


    isPlayerTurn = true;
}

// combines UI functionality to resolve a move
function resolveAttack(player, tile, msg, wins) {
    applyUiHitMarker(tile, msg);
    return determineVictory(player, wins);
}

// applies UI hit marker to tile selected
function applyUiHitMarker(tile, msg) {
    if(msg === 'EMPTY_SPACE') {
        tile.classList.add('was-hit');
    } else if(msg === 'SUCCESSFUL_HIT') {
        tile.classList.add('was-hit', 'had-ship');
    }
}

// determines if the player has won
// set timeout to change status text after
// UI element has been updated
function determineVictory(player, winStatus) {
    if (winStatus) {
        setTimeout(() => {
            writeStatusText(`${player} has conquered!`)
        }, 0);
        return true;
    } else {
        return false;
    }
}

// populate AI board
controller.populateAiBoard();

import controller from "./Controller.js";

// populate 

const playerGameboard = document.querySelector('.gameboard.player');
const aiGameboard = document.querySelector('.gameboard.ai');
const gameStatusHeader = document.getElementById('status-text')
let isPlayerTurn = false;
let isPlacement = true;


for(let i = 0; i < 10; i++) {
    for(let j = 0; j < 10; j++) {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.setAttribute('x', i);
        tile.setAttribute('y', j);

        const playerTile = tile.cloneNode();
        playerTile.classList.add('player-tile');
        playerTile.addEventListener('click', () => {
            placeShipPiece(i, j);
        });

        playerTile.addEventListener('hover', () => {
            displayShipPreview(i, j);
        })

        playerGameboard.appendChild(playerTile);

        const aiTile = tile.cloneNode();
        aiTile.addEventListener('click', () => {
            handleTileClick(aiGameboard, aiTile);
        });

        aiGameboard.appendChild(aiTile);
    }
}




function handleTileClick(parent, tile) {
    if (parent === playerGameboard ||
        isPlayerTurn === false ||
        isPlacement === true ||
        tile.classList.contains('was-hit')) {
        return;
    }

    isPlayerTurn = false;

    const x = parseInt(tile.getAttribute('x'));
    const y = parseInt(tile.getAttribute('y'));

    const moveTurn = controller.makeTurn(x, y);

    if(moveTurn === null) {
        isPlayerTurn = true;
        // display invalid move icon
        return;
    }

    let playerMsg = moveTurn.playerMsg;
    let aiMsg = moveTurn.aiMsg;

    if(playerMsg === 'VICTORY') {
        writeStatusText('You win!');
        return;
    } else if (playerMsg === 'EMPTY_SPACE') {
        tile.classList.add('was-hit');
    } else if (playerMsg === 'SUCCESSFUL_HIT') {
        tile.classList.add('was-hit', 'had-ship');
    }

    const aiSelectedTile = document.querySelector(`.player .tile[x='${moveTurn.aiX}'][y='${moveTurn.aiY}']`);
    
    if(aiSelectedTile === null) {
        console.log(`:: ERROR: Player board tile (${moveTurn.aiX},${moveTurn.aiY}) not found ::`);
        // display error message
        // display reset button
        return;
    }

    if (aiMsg === 'VICTORY') {
        writeStatusText('Computer wins!');
        return;
    } else if(aiMsg === 'EMPTY_SPACE') {
        aiSelectedTile.classList.add('was-hit');
    } else if(aiMsg === 'SUCCESSFUL_HIT') {
        aiSelectedTile.classList.add('was-hit', 'had-ship');
    }

    isPlayerTurn = true;
}

function resetBoard() {

}

function placeAiPieces() {
    controller.populateAiBoard();
}

let currentShipLength = 5;
let direction = 'H';
writeTitleForShip();

function toggleDirection() {
    direction = (direction === 'H') ? 'V' : 'H';
}
function displayShipPreview(x, y) {
    // get top-left coord and draw image 
}

function placeShipPiece(x, y) {
    if (currentShipLength <= 1) {
        return;
    }

    const response = controller.placePieceOnBoard(x, y, direction, currentShipLength);
    console.log(response);
    if (response !== null) {
        return;
    }

    switch(direction) {
        case 'H':
            for(let i = y; i < y + currentShipLength; i++) {
                let tile = document.querySelector(`.tile[x='${x}'][y='${i}']`);
                tile.classList.add('has-ship');
            }
    }

    currentShipLength--;

    if(currentShipLength === 1) {
        beginGame();
    } else {
        writeTitleForShip();
    }
}

function writeTitleForShip() {
    writeStatusText(`Place ship of length ${currentShipLength}`);
}

function writeStatusText(msg) {
    gameStatusHeader.innerText = msg;
}

function beginGame() {
    isPlacement = false;
    isPlayerTurn = true;
    writeStatusText('Choose enemy node');
}

function validatePlacement(tile, axis) {

}

placeAiPieces();


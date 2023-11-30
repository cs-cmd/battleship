import controller from "./Controller.js";

// populate 

const playerGameboard = document.querySelector('.gameboard.player');
const aiGameboard = document.querySelector('.gameboard.ai');
const gameStatusHeader = document.getElementById('status-text');
const directionDiv = document.querySelector('.direction-info');
const changeAxisButton = document.getElementById('change-axis-button');
const changeAxisMovingIcon = document.getElementById('moving-icon')
let isPlayerTurn = false;
let isPlacement = true;


for(let i = 0; i < 10; i++) {
    for(let j = 0; j < 10; j++) {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.setAttribute('x', i);
        tile.setAttribute('y', j);

        const playerTile = tile.cloneNode();
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
        console.log(`:: ERROR: Invalid move: ${moveTurn} ::`);
        return;
    }

    const playerMsg = moveTurn.playerRes.msg;
    const playerWins = moveTurn.playerRes.hasNoShips;

    if(resolveAttack('Player', tile, playerMsg, playerWins)) {
        return;
    }

    const aiMsg = moveTurn.aiRes.msg;
    const aiWins = moveTurn.aiRes.hasNoShips;

    const aiSelectedTile = document.querySelector(`.player .tile[x='${moveTurn.aiX}'][y='${moveTurn.aiY}']`);
    
    if(aiSelectedTile === null) {
        console.log(`:: ERROR: Player board tile (${moveTurn.aiX},${moveTurn.aiY}) not found ::`);
        // display error message
        // display reset button
        return;
    }

    if (resolveAttack('Computer', aiSelectedTile, aiMsg, aiWins)) {
        return;
    }


    isPlayerTurn = true;
}

function resolveAttack(player, tile, msg, wins) {
    applyUiHitMarker(tile, msg);
    return determineVictory(player, wins);
}

function applyUiHitMarker(tile, msg) {
    if(msg === 'EMPTY_SPACE') {
        tile.classList.add('was-hit');
    } else if(msg === 'SUCCESSFUL_HIT') {
        tile.classList.add('was-hit', 'had-ship');
    }
}

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

function resetBoard() {

}

function placeAiPieces() {
    controller.populateAiBoard();
}




let currentShipLength = 5;
let direction = 'H';

changeAxisButton.addEventListener('click', () => {
    toggleDirection();
});

writeTitleForShip();

let canChangeAxis = false;
playerGameboard.addEventListener('mouseover', () => {
    canChangeAxis = true;
    // enable horizontal/vertical changes with right mouse click'
    // draw rectangle the size of shiplength*tilesize based on 
    // where mouseis
});
playerGameboard.addEventListener('mouseout', () => {
    canChangeAxis = false;
    // disable axis changes
});
playerGameboard.addEventListener('click', (e) => {
    if(!canChangeAxis &&
        e.target != playerGameboard) {
            return;
    }

    console.log(e);
})

function toggleDirection() {
    direction = (direction === 'H') ? 'V' : 'H';
    changeAxisMovingIcon.classList.toggle('right');
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
                let tile = document.querySelector(`.player .tile[x='${x}'][y='${i}']`);
                tile.classList.add('has-ship');
            }
            break;
        case 'V':
            for(let i = x; i < x + currentShipLength; i++) {
                let tile = document.querySelector(`.player .tile[x='${i}'][y='${y}']`)
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
    directionDiv.classList.add('hidden');
    writeStatusText('Choose enemy node');
}

function validatePlacement(tile, axis) {

}

placeAiPieces();


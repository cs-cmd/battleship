const GameInitializer = (beginGame, writeStatusText) => {
    // UI elements
    const changeAxisButton = document.getElementById('change-axis-button');
    const changeAxisMovingIcon = document.getElementById('moving-icon');

    // current ship length and direction (startup)
    let currentShipLength = 5;
    let direction = 'H';

    // toggle direction if button is clicked
    changeAxisButton.addEventListener('click', () => {
        toggleDirection();
    });

    function writeTitleForShip(currentShipLength) {
        writeStatusText(`Place ship of length ${currentShipLength}`);
    }

    // change direction 
    function toggleDirection() {
        direction = (direction === 'H') ? 'V' : 'H';
        changeAxisMovingIcon.classList.toggle('right');
    }

    // places ship piece via controller
    function placeShipPiece(x, y, controller) {
        // if the current ship length is less than 1 (no more ships to place), return
        if (currentShipLength <= 1) {
            return;
        }
    
        // attempt to place ship on board
        const response = controller.placePieceOnBoard(x, y, direction, currentShipLength);
    
        // if response is not null (meaning error found), return
        if (response !== null) {
            return;
        }
    
        // determine the direction of the axis and color UI elements accordingly
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
    
        // decrease current ship length
        currentShipLength--;
    
        // if length is 1 (no more pieces to place), begin game
        if(currentShipLength === 1) {
            beginGame();
        } else {
            writeTitleForShip(currentShipLength);
        }
    }

    // Initialize ship length
    writeTitleForShip(5);

    // and array of HTML elements to remove
    let tilesToPreview = [];

    const displayShipPreview = (x, y) => {

        let classToAdd = 'is-valid';

        switch(direction) {
            case 'H':
                if (y + currentShipLength > 10) {
                    classToAdd = 'is-invalid';
                }
                for(let i = y; i < y + currentShipLength; i++) {
                    const tile = document.querySelector(`.player .tile[x="${x}"][y="${i}"]`);
                    tile.classList.add(classToAdd);
                    tilesToPreview.push(tile);
                }
                break;
            case 'V':
                if (x + currentShipLength > 10) {
                    classToAdd = 'is-invalid';
                }
                for(let i = x; i < x + currentShipLength; i++) {
                    const tile = document.querySelector(`.player .tile[x="${i}"][y="${y}"]`);
                    tile.classList.add(classToAdd);
                    tilesToPreview.push(tile);
                }
                break;
        }
    }

    // removes style from tiles and resets array
    const resetTiles = () => {
        for(let i = tilesToPreview.length - 1; i >= 0; i--) {
            tilesToPreview[i].classList.remove('is-valid', 'is-invalid');
            tilesToPreview.splice(i);
        }
    }

    return {
        placeShipPiece,
        displayShipPreview,
        resetTiles,
    }
};

export default GameInitializer;
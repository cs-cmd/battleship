const GameInitializer = (beginGame, writeTitleForShip) => {
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

    return {
        placeShipPiece,
    }
};

export default GameInitializer;
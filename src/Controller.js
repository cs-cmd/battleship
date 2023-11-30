import PlayerBoard from './PlayerBoard.js';

// single player
const controller = (() => {
    const player = new PlayerBoard();
    const AI = new PlayerBoard();
    AI.generateCoords = () => {
        return {
            x: Math.floor(Math.random() * 9),
            y: Math.floor(Math.random() * 9),
        };
    }

    const makeTurn = (x, y) => {
        const moveResponse = controllerApplyHit(AI, x, y);
        
        if(!moveResponse.wasValid) {
            return null;
        }

        let aiResponse;
        let aiX = -1;
        let aiY = -1;

        do {

            // generate random numbers between 0 and 9 for user
            const { x, y } = AI.generateCoords();

            aiResponse = controllerApplyHit(player, x, y);
            
            if(!aiResponse.wasValid || 
                aiResponse.msg === 'ALREADY_HIT') {
                continue;
            } 
            aiX = x;
            aiY = y;
        } while(!aiResponse.wasValid);

        
        return {
            playerMsg: moveResponse.msg,
            aiMsg: aiResponse.msg,
            aiX,
            aiY,
        };
    }

    const controllerApplyHit = (player, x, y) => {
        const hitResponse = player.applyHit(x, y);

        let msg = '';
        let wasValid = false;

        if(hitResponse.hitRes === null) {
            // no ship present/empty node
            msg = 'EMPTY_SPACE';
            wasValid = true;
        } else if(hitResponse.hitRes === false) {
            // spot was already hit, make move again
            msg = 'ALREADY_HIT';
        } else if (hitResponse.hasNoShips) {
            // has no ships left
            msg = 'VICTORY'
        } else {
            // successful hit
            msg = 'SUCCESSFUL_HIT';
            wasValid = true;
        }

        return {
            msg,
            wasValid
        }
    }

    const populateAiBoard = () => {
        let currentShipLength = 5;

        do {
            const { x, y } = AI.generateCoords();
            // generate either horizontal or vertical placement
            const direction = (Math.floor(Math.random() * 2) === 0) ? 'H' : 'V';

            const error = AI.playerBoard.placeShip(x, y, direction, currentShipLength);

            if(error === null) {
                currentShipLength--;

            } 
        } while(currentShipLength > 1);
    }

    const placePieceOnBoard = (x, y, dir, len) => {
        return player.playerBoard.placeShip(x, y, dir, len);
    }

    return {
        makeTurn,
        populateAiBoard,
        placePieceOnBoard,
    }
})();

export default controller;
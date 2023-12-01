import PlayerBoard from '../model/PlayerBoard.js';

// single player
const controller = (() => {
    // player and AI boards
    const player = new PlayerBoard();
    const AI = new PlayerBoard();
    // additional property to generate random coordinates for the board
    AI.generateCoords = () => {
        return {
            x: Math.round(Math.random() * 9),
            y: Math.round(Math.random() * 9),
        };
    }

    // single player turn. checks if move is valid and applies to
    // enemy gameboard. 
    // returns null if the move was invalid;
    // or an object containing move information for use by the UI
    const makeTurn = (x, y) => {
        const moveResponse = controllerApplyHit(AI, x, y);
        
        if(!moveResponse.wasValid) {
            return null;
        }

        let aiResponse;
        let aiX = -1;
        let aiY = -1;
        let run = true;

        // continue generating random numbers between 0 and 9 until it is a valid ove
        do {
            const { x, y } = AI.generateCoords();

            aiResponse = controllerApplyHit(player, x, y);
             
            if (aiResponse.wasValid) {
                    aiX = x;
                    aiY = y;
                    run = false;
            }
        } while(run);

        return {
            playerRes: moveResponse,
            aiRes: aiResponse,
            aiX,
            aiY,
        };
    }

    // apply hit function for use by controller
    const controllerApplyHit = (player, x, y) => {
        const hitResponse = player.applyHit(x, y);

        let message = '';
        let wasValid = false;

        if(hitResponse.hitRes === null) {
            // no ship present/empty node
            message = 'EMPTY_SPACE';
            wasValid = true;
        } else if(hitResponse.hitRes === false) {
            // spot was already hit, make move again
            message = 'ALREADY_HIT';
        } else {
            // successful hit
            message = 'SUCCESSFUL_HIT';
            wasValid = true;
        }

        return {
            msg: message,
            wasValid,
            hasNoShips: hitResponse.hasNoShips,
        }
    }

    // generates random ship placement for AI player
    const populateAiBoard = () => {
        let currentShipLength = 5;

        do {
            const { x, y } = AI.generateCoords();

            // generate either horizontal or vertical placement
            const direction = (Math.round(Math.random()) === 0) ? 'H' : 'V';

            const error = AI.playerBoard.placeShip(x, y, direction, currentShipLength);

            if(error === null) {
                currentShipLength--;
            } 
        } while(currentShipLength > 1);
    }

    // returns either error info or null
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
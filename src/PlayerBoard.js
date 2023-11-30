import Gameboard from './Gameboard.js';

class PlayerBoard { 
    // make new gameboard
    constructor() {
        this.playerBoard = Gameboard();
    };

    // apply hit returns an object that contains the hit response and 
    // whether the board has no valid ships left
    applyHit(x, y) {
        return {
            hitRes: this.playerBoard.receiveAttack(x, y),
            hasNoShips: this.playerBoard.getUnsunkShipCount() === 0,
        }
    }
}

export default PlayerBoard;
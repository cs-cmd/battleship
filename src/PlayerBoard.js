import Gameboard from './Gameboard.js';

class PlayerBoard { 
    constructor() {
        this.playerBoard = Gameboard();
    };

    applyHit(x, y) {
        return {
            hitRes: this.playerBoard.receiveAttack(x, y),
            hasNoShips: this.playerBoard.getUnsunkShipCount() === 0,
        }
    }
}

export default PlayerBoard;
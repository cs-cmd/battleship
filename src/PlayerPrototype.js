import Gameboard from './Gameboard.js';

const PlayerPrototype = {
    playerBoard: Gameboard(),
    applyHit: (x, y) => {
        const response = playerBoard.receiveAttack(x, y);

        if (response === null) {
            // nothing there
        } else if(!response) {
            // already hit, shouldn't have hit
        } else {
            // successful hit
        }
    }
}

export default PlayerPrototype;
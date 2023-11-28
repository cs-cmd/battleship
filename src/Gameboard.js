const Gameboard = () => {
    const gameboard = [];

    const placeShip = (baseX, baseY) {
        
    }

    const receiveAttack = (x, y) => {
        const spot = gameboard[x][y];

        if (spot = null) {
            return null;
        } 

        if (spot.isSunk()) {
            return false;
        }
        else {
            spot.hit();
            
        }
    }
}
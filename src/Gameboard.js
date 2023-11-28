import Ship from "./Ship.js";

const Gameboard = () => {
    // 10x10 gameboard
    const gameboard = [
        [null,null,null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null,null,null],
    ];

    const shipsOnBoard = 0;

    // direction is either horizontal (H) or vertical (V)
    const placeShip = (baseX, baseY, direction, length) => {
        const ship = Ship(length);
        try {
            switch(direction) {
                case 'H':
                    handleHorizontally(baseX, baseY, ship, checkShipNode);
                    handleHorizontally(baseX, baseY, ship, addShipNode);
                    break;
                case 'V':
                    handleVertically(baseX, baseY, ship, checkShipNode);
                    handleVertically(baseX, baseY, ship, addShipNode);
                    break;
                default:
                    console.log(`:: ERROR: Invalid direction: ${direction} ::`);
                    return;
            }
        } catch (error) {
            return error;
        }

        return null;
    }

    // Used by the UI to determine if the placement would be successful
    const verifyPlacement = (baseX, baseY, direction) => {
        try {
            switch(direction) {
                case 'H':
                    handleHorizontally(baseX, baseY, ship, checkShipNode);
                    break;
                case 'V':
                    handleVertically(baseX, baseY, ship, checkShipNode);
                    break;
                default:
                    console.log(`:: ERROR: Invalid direction: ${direction} ::`);
                    return;
            }
        } catch (error) {
            return false;
        }

        return true;
    }

    const handleVertically = (startX, y, ship, func) => {
        for(let i = startX; i < startX + ship.getSize(); i++) {
            func(i, y, ship);
        }
    }
    
    const handleHorizontally = (x, startY, ship, func) => {
        for(let i = startY; i < startY + ship.getSize(); i++) {
            func(x, i, ship);
        } 
    }

    const addShipNode = (x, y, ship) => {
        gameboard[x][y] = {
            ship,
            wasHit: false,
        }
    }

    const checkShipNode = (x, y) => {
        if (!(x in gameboard && y in gameboard[x])) {
            throw {
                name: 'ArrayOutOfBounds',
                message: `gameboard[${x}][${y}] is not a valid location`
            }
        } else if (gameboard[x][y] !== null) {
            throw {
                name: 'Occupied',
                message: 'Spot is occupied',
            };
        }
    }

    const displayBoard = () => {
        for(let i = 0; i < gameboard.length; i++) {
            // line to print
            let line = '';

            for(let j = 0; j < gameboard[i].length; j++) {
                // current node, placeholder text
                const node = gameboard[i][j];
                let occupiedPlaceholder = '';

                // if node is empty, already hit, or else
                if (node === null) {
                    occupiedPlaceholder = ' ';
                } else if (node.wasHit) {
                    occupiedPlaceholder = 'x';
                } else {
                    occupiedPlaceholder = 'o';
                }

                line += occupiedPlaceholder + ' ';
            }
            console.log(line);
        }
    }

    const getShip = (x, y) => gameboard[x][y].ship;

    const receiveAttack = (x, y) => {
        const spot = gameboard[x][y];

        if (spot === null) {
            spot = {
                ship: null,
                wasHit: true,
            }
            return null;
        } 

        if (spot.wasHit ||
            spot.ship.isSunk()) {
            return false;
        }
        else {
            spot.ship.hit();
            spot.wasHit = true;
        }
    }

    return {
        receiveAttack, 
        placeShip,
        displayBoard,
        getShip,
    }
}

export default Gameboard;
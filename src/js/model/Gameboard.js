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

    // number of ships on user's board
    let shipsOnBoard = 0;

    // direction is either horizontal (H) or vertical (V),
    // returns error message, or null if
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
                    throw new Error('Invalid direction');
            }
        } catch (error) {
            return error;
        }

        shipsOnBoard++;
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

    // run handler for vertical movement
    const handleVertically = (startX, y, ship, handler) => {
        for(let i = startX; i < startX + ship.getSize(); i++) {
            handler(i, y, ship);
        }
    }
    
    // run handler for horizontal movement
    const handleHorizontally = (x, startY, ship, handler) => {
        for(let i = startY; i < startY + ship.getSize(); i++) {
            handler(x, i, ship);
        } 
    }

    // add ship node to board
    const addShipNode = (x, y, ship) => {
        gameboard[x][y] = {
            ship,
            wasHit: false,
        }
    }

    // check if the ship node is valid. Throws errors if it isn't
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

    // display board to console
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

    // get ship and unsunk boat count
    const getShip = (x, y) => gameboard[x][y].ship;
    const getUnsunkShipCount = () => shipsOnBoard;

    // receive attack on board for coordinates
    // returns null on empty spot, false on hit spot,
    // and true on successful hit
    const receiveAttack = (x, y) => {
        let spot = gameboard[x][y];

        // if spot is null (empty), replace with an object of an empty space noted
        // as hit
        if (spot === null) {
            gameboard[x][y] = {
                ship: null,
                wasHit: true,
            }
            return null;
        } 

        if(spot.wasHit) {
            return false;
        } 

        spot.wasHit = true;

        const ship = spot.ship;
        const wasDestroyed = ship.hit();

        if(wasDestroyed) {
            shipsOnBoard--;
        } 

        return true;
    }

    return {
        receiveAttack, 
        placeShip,
        displayBoard,
        getShip,
        getUnsunkShipCount
    }
}

export default Gameboard;
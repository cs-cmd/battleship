import Gameboard from "../src/Gameboard.js";
import Ship from "../src/Ship.js";

const gameboard = Gameboard();


function testPlaceShipHorizontal() {
    gameboard.placeShip(0, 0, 'H', 5);
}

function testPlaceShipVertical() {
    gameboard.placeShip(0, 8, 'V', 4);
}

function testPlaceHorizOccupied() {
    gameboard.placeShip(2, 7, 'H', 2);
}

function testPlaceVerticOccupied() {
    gameboard.placeShip(0, 2, 'V', 3);
}

function testArrayOOB() {
    const error = gameboard.placeShip(11, 15, 'H', 5);
    console.log(error.message);
}

function testHitSuccess() {
    const hitMarker = gameboard.receiveAttack(0, 2);
}

function testHitFailure() { 
    const hitMarker = gameboard.receiveAttack(11, 2);

    if (hitMarker === null) {
        console.log(':: testHitFailure PASSED ::');
    }
    console.log(hitMarker);
}

function testSunk() {
    const error = gameboard.placeShip(3, 2, 'H', 2);
    const firstHit = gameboard.receiveAttack(3, 2);
    const secondHit = gameboard.receiveAttack(3, 3);

    if (error !== null) {
        console.log(':: testSunk FAILED - Error ::')
        console.log(error);
        return;
    }
    else if(firstHit === null
        && secondHit === null) {
        console.log(':: testSunk FAILED - empty locations ::');
        return;
    }

    const ship = gameboard.getShip(3,2);

    if(ship.isSunk()) {
        console.log(':: testSunk PASSED ::');
    }
}

function runAll() {
    testPlaceShipHorizontal();
    testPlaceShipVertical();
    testPlaceHorizOccupied();
    testPlaceVerticOccupied();
    testArrayOOB();
    testHitSuccess();
    testSunk();
    gameboard.displayBoard();
}

export { runAll };
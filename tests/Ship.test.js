import Ship from "../src/Ship.js";

function testHitFunctionFalse() {
    const ship = Ship(3);
    const isSunk = ship.hit();

    if(!isSunk) {
        console.log(':: testHitFunctionFalse PASSED ::');
        return true;
    } else {
        console.error(':: testHitFunctionFalse FAILED ::');
        return false;
    }
}

function testHitFunctionTrue() {
    const ship = Ship(3);

    ship.hit();
    ship.hit();
    const isSunk = ship.hit();

    if(isSunk) {
        console.log(':: testHitFunctionTrue PASSED ::');
        return true;
    } else {
        console.error(':: testHitFunctionTrue FAILED ::');4
        return false;
    }
}

function testSunkFunction() {
    const ship = Ship(2);
    ship.hit();
    ship.hit();

    if(ship.isSunk()) {
        console.log(':: testSunkFunction PASSED ::');
    } else {
        console.log(':: testSunkFunction FAILED ::');
    }
}

function testSunkFunctionFalse() {
    const ship = Ship(2);
    ship.hit();

    let msg = '';
    if(!ship.isSunk()) {
        msg = 'PASSED';
    } else {
        msg = 'FAILED';
    }

    console.log(`:: testSunkFunctionFalse ${msg} ::`);
}

function runAll() {
    const tests = [
        testHitFunctionFalse,
        testHitFunctionTrue,
        testSunkFunction,
        testSunkFunctionFalse
    ];

    for (let i = 0; i < tests.length; i++) {
        tests[i]();
    }
}

export { runAll };

const Ship = (boatSize) => {
    const size = boatSize;
    let hits = 0;
    let isDestroyed = false;

    // places hit on ship. if the board isn't destroyed 
    // and the number of hits (incremented before use) is
    // the same as the board size, the boat is destroyed
    // returns boat status
    const hit = (x, y) => {
        if (!isDestroyed && size === ++hits) {
            isDestroyed = true;
        }

        return isDestroyed;
    }

    const isSunk = () => isDestroyed;
    const getSize = () => size;

    return {
        hit,
        isSunk,
        getSize,
    }
}

export default Ship;
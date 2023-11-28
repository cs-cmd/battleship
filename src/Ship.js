const Ship = (boatSize) => {
    const size = boatSize;
    let hits = 0;
    let isDestroyed = false;

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
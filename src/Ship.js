const Ship = (boatSize) => {
    const size = boatSize;
    let hits = 0;
    let isDestroyed = false;

    const hit = () => {
        if (!isDestroyed && size === ++hits) {
            isDestroyed = true;
        }

        return isDestroyed;
    }

    const isSunk = () => isDestroyed;

    return {
        hit,
        isSunk,
    }
}

export default Ship;
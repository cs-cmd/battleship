const Ship = (boatSize) => {
    const size = boatSize;
    const hits = 0;
    const isDestroyed = false;

    const applyDamage = () => {
        hits++;

        if (size === hits) {
            isDestroyed = true
        }
    }

    const getStatus = () => isDestroyed;

    return {
        applyDamage,
        getStatus,
    }
}

export default Ship;
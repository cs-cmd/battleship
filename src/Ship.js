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

    return {
        applyDamage,
    }
}

export default Ship;
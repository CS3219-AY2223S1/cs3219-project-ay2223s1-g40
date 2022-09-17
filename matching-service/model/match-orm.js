import { createMatch, destroyMatch, getAvailableMatch } from './repository.js';

// need to separate orm functions from repository to decouple business logic from persistence
export async function ormCreateMatch(hostPlayer, difficulty) {
    try {
        await createMatch({ hostPlayer, difficulty });
        return true;
    } catch (err) {
        console.log(err);
            // 'ERROR: Could not create new match');
        return { err };
    }
}

export async function ormGetAvailableMatch(difficulty) {
    try {
        const availableMatch = await getAvailableMatch(difficulty);
        return availableMatch;
    } catch (err) {
        console.log('ERROR: Could not load available match');
        return { err };
    }
}

export async function ormDestroyMatch(hostPlayer) {
    try {
        await destroyMatch(hostPlayer);
        console.log('Match successfully deleted')
    } catch (err) {
        console.log('ERROR: Could not destroy this match');
    }
}

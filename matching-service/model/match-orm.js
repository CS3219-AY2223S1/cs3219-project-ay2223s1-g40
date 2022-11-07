import { createMatch, destroyMatch, getAvailableMatch } from './repository.js';

// need to separate orm functions from repository to decouple business logic from persistence
export async function ormCreateMatch(hostPlayer, hostSocket, difficulty) {
    try {
        await createMatch({ hostPlayer, hostSocket, difficulty });
        return true;
    } catch (err) {
        console.log(err);
            // 'ERROR: Could not create new match');
        return { err };
    }
}

export async function ormGetAvailableMatch(userId, difficulty) {
    try {
        const availableMatch = await getAvailableMatch(userId, difficulty);
        return availableMatch;
    } catch (err) {
        console.log('ERROR: Could not load available match');
        return { err };
    }
}

export async function ormDestroyMatch(hostSocket) {
    try {
        await destroyMatch(hostSocket);
        console.log('Match successfully deleted')
    } catch (err) {
        console.log('ERROR: Could not destroy this match');
    }
}

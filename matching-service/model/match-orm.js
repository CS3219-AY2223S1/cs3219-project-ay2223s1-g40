import { createMatch, getAvailableMatch } from './repository.js';

// need to separate orm functions from repository to decouple business logic from persistence
export async function ormCreateMatch(hostPlayer) {
    try {
        const newMatch = await createMatch({ hostPlayer });
        newMatch.save();
        return true;
    } catch (err) {
        console.log('ERROR: Could not create new match');
        return { err };
    }
}

export async function ormGetAvailableMatch() {
    try {
        const availableMatch = await getAvailableMatch();
        return availableMatch;
    } catch (err) {
        console.log('ERROR: Could not load available match');
        return { err };
    }
}

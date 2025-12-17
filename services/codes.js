import Building from '../models/building.model.js';
import Dispatcher from '../models/dispatcher.model.js';

export const createCode = async (buildingId, dispatcherId, rawCodeData, type = 'access') => {
    const dispatcher = await Dispatcher.findById(dispatcherId).catch(err => {
        throw new Error('Failed to get dispatcher to create code');
    });

    const initialVotes = Math.floor(dispatcher.trust_score / 20);

    const typeField = type === 'access' ? 'access_codes' : 'locker_codes';

    const newCode = {
        code: rawCodeData.code,
        notes: rawCodeData.notes ?? '',
        created_by: dispatcherId,
        upvotes: initialVotes,
        total_votes: initialVotes,
        trust_score: 100,
    }

    const building = await Building.findByIdAndUpdate(buildingId, { $push: { [typeField]: newCode } }, { new: true }).catch(err => {
        throw new Error('Failed to create code');
    });

    return building;
}

export const voteOnCode = async (buildingId, codeId, type, isUpvote) => {
    const building = await Building.findById(buildingId).catch(err => {
        throw new Error('Failed to get building to vote on code');
    });

    let code = building[type].id(codeId);

    if(!code) {
        throw new Error('Code not found');
    }
    
    //? Updating code status
    if(isUpvote) {
        code.upvotes++;
        code.total_votes++;
    } else {
        code.downvotes++;
        code.total_votes++;
    }

    if(code.total_votes >= 0) {
        code.trust_score = Math.round((code.upvotes / code.total_votes) * 100);
    }

    //? Updating Dispatcher trust score
    let dispatcher = await Dispatcher.findById(code.created_by).catch(err => {
        throw new Error('Failed to get dispatcher to update trust score');
    });

    if(dispatcher) {
        if(isUpvote) {
            dispatcher.score += 1;
            dispatcher.total_score += 1;
        } else {
            dispatcher.score -= 3;
            dispatcher.total_score += 3;
        }

        if(dispatcher.total_score >= 0) {
            dispatcher.trust_score = Math.max(0, Math.min(100, Math.round((dispatcher.score / dispatcher.total_score) * 100)));
        } else {
            dispatcher.trust_score = 0;
        }

        await dispatcher.save().catch(err => {
            throw new Error('Failed to update dispatcher trust score');
        });
    }

    //? Delete if trust under 35%
    if(code.trust_score < 35 && code.total_votes >= 10) {
        await code.deleteOne().catch(err => {
            throw new Error('Failed to delete code');
        });
        console.log(`code #{code.code} deleted because of low trust score, uploaded by ${dispatcher.name}`)
    }

    await building.save().catch(err => {
        throw new Error('Failed to save building');
    });

    return building;
}
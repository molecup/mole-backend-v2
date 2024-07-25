'use strict';

/**
 * updateGroupRelation service
 */

const updateGroupTournamentRelation = async (tournamentId, groupId) => {
    await strapi.entityService.update('api::group-phase.group-phase', groupId, {
        data: {
            tournament: tournamentId
        }
    });
}

module.exports = ({strapi}) => ({
    async updateGroupRelation(entityId, oldGroupIds = []) {
        const newGroupIds = await this.getGroupIds(entityId);
        console.log(newGroupIds, oldGroupIds);
        const toBeAdded = newGroupIds.filter((x) => !oldGroupIds.includes(x));
        const toBeRemoved = oldGroupIds.filter((x) => !newGroupIds.includes(x));
        console.log("to be added: ", toBeAdded, " to be removed: ", toBeRemoved);
        const addToGroupPromises = toBeAdded.map((groupId) => updateGroupTournamentRelation(entityId, groupId));
        const removeFromGroupPromises = toBeRemoved.map((groupId) => updateGroupTournamentRelation(null, groupId));
        await Promise.all(addToGroupPromises + removeFromGroupPromises);
    },

    async getGroupIds(entityId) {
        const entity = await strapi.entityService.findOne('api::tournament.tournament', entityId, {
            fields: [],
            populate: { 
                editions: { 
                    populate: {group_phases: true}
                }
            },
          });
        return entity.editions.flatMap((edition) => edition.group_phases).map((group) => group.id)
    }
});

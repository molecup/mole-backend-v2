'use strict';

/**
 * relations service
 */

module.exports = ({strapi}) => ({
    async getPhaseIds(entityId){
        const entity = await strapi.entityService.findOne("api::match.match", entityId, {
            fields: [],
            populate: {
                group_phase: {
                    fields: []
                },
                knock_out_phase: {
                    fields: []
                }
            }
        });
        return ({
            group_phase_id : entity.group_phase?.id,
            knock_out_phase_id: entity.knock_out_phase?.id,
        });
    },

    async updatePhaseRelations(entityId, otherIds = {}){
        async function updateRelations(ids){
            if (ids.group_phase_id){
                await strapi.service("api::group-phase.ranking").updateRanking(ids.group_phase_id);
            }
        
            if (ids.knock_out_phase_id){
                await strapi.service("api::knock-out-phase.relations").updateMatches(ids.knock_out_phase_id);
            }
        }
        const ids = await this.getPhaseIds(entityId);
        await Promise.all([updateRelations(ids), updateRelations(otherIds)])
    },

});

module.exports = {
    async afterUpdate(event){
        const {result} = event;
        await strapi.service("api::match.result").updateScore(result.id);
        await strapi.service("api::match.relations").updatePhaseRelations(result.id, event.state);
    },

    async afterCreate(event){
        const {result} = event;
        await strapi.service("api::match.result").updateScore(result.id);
        await strapi.service("api::match.relations").updatePhaseRelations(result.id);

    },

    async beforeUpdate(event){
        const {params} = event;
        /* add old phase ids to event state */
        const phaseIds = await strapi.service("api::match.relations").getPhaseIds(params.where.id);
        event.state = {
            ...event.state,
            ...phaseIds
        };
    }
}
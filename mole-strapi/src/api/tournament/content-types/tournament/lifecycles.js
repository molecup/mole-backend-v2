module.exports = {

    async beforeUpdate(event){
        const {params} = event;
        /*
        const entity = await strapi.query('api::tournament.tournament').findOne({ where: { id: params.where.id },
            populate: { editions: { populate: {group_phases : true} } }, });
            console.log(entity.editions[0]);
            console.log(params.populate.editions)
            console.log(strapi.requestContext.get());*/
        const groupIds = await strapi.service('api::tournament.relations').getGroupIds(params.where.id);
        event.state = {oldGroupdIds: groupIds }
    },

    async afterUpdate(event) {
        const {params, state} = event;
        //console.log(state);
        await strapi.service('api::tournament.relations').updateGroupRelation(params.where.id);
    },

    async afterCreate(event) {
        const {params} = event;
        await strapi.service('api::tournament.relations').updateGroupRelation(params.where.id);
    },

    

}
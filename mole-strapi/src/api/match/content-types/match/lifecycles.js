module.exports = {
    async afterUpdate(event){
        const {result} = event;
        await strapi.service("api::match.result").updateScore(result.id);
    },

    async afterCreate(event){
        const {result} = event;
        await strapi.service("api::match.result").updateScore(result.id);
    },
}
module.exports = {
    async afterUpdate(event){
        const {result} = event;
        strapi.service("api::match.result").updateScore(result.id);
    },

    async afterCreate(event){
        const {result} = event;
        strapi.service("api::match.result").updateScore(result.id);
    },
}
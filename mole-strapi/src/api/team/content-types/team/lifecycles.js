module.exports = {
    async afterCreate(event){
        const {result} = event;
        console.log(result);
        await strapi.service("api::team.editions").createDefaultEdition(result.id);
    }
}
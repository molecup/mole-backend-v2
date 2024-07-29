
module.exports = {

    async afterCreate(event){
        const {result} = event;
        strapi.service("api::tournament.editions").createDefaultEdition(result.id);
    }
    

}

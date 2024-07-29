'use strict';

/**
 * editions service
 */

module.exports = ({strapi}) => ({
    async createDefaultEdition(entityId, suffix = "default"){
        const tournament = await strapi.entityService.findOne("api::tournament.tournament", entityId, {
            fields: ["name"]
        });

        const newEdition = await strapi.entityService.create("api::tournament-edition.tournament-edition", {
            data: {
                private_name: tournament.name + " " + suffix,
                tournament: {
                    set: [{id: entityId}]
                },
                year: new Date().getFullYear(),
                title: tournament.name,

            }
        });

        await strapi.entityService.update("api::tournament.tournament", entityId, {
            data: {
                main_edition: {
                    set: [{id: newEdition.id}]
                }
            }
        })

    }
});
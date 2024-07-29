'use strict';

/**
 * editions service
 */

module.exports = ({strapi}) => ({
    async createDefaultEdition(entityId, suffix = "default"){
        const team = await strapi.entityService.findOne("api::team.team", entityId, {
            fields: ["name"]
        });

        const newEdition = await strapi.entityService.create("api::team-edition.team-edition", {
            data: {
                private_name: team.name + " " + suffix,
                team: {
                    set: [{id: entityId}]
                },
                year: new Date().getFullYear()

            }
        });

        await strapi.entityService.update("api::team.team", entityId, {
            data: {
                main_edition: {
                    set: [{id: newEdition.id}]
                }
            }
        })

    }
});

'use strict';

/**
 * relations service
 */

/**
* Get match ids corresponding to the two teams ids passed as params
* @param {any} teamIdA
* @param {any} teamIdB
* @param {any[]} matches
*/
function getMatchIds(teamIdA, teamIdB, matches){
    return matches.filter((/** @type {{ home_team: { id: number; }; away_team: { id: number; }; }} */ match) => {
        return (match.home_team.id === teamIdA && match.away_team.id === teamIdB) || (match.home_team.id === teamIdB && match.away_team.id === teamIdA)
    })
    .map((/** @type {{ id: any; }} */ match) => match.id);
}

/**
 * @param {import("@strapi/types/dist/types/core/entity").ID} entityId
 * @param {{ [x: string]: any; matches: any; }} kop
 * @param {string} roundName
 */
async function connectStageMatch(entityId, kop, roundName){
    const round = kop[roundName];
    if(Array.isArray(round)){
        const updateStagesQuery = round.map(stage => ({
            id: stage.id,
            matches: {
                set: getMatchIds(stage.team_a.id, stage.team_b.id, kop.matches)
            }
        }))
        await strapi.entityService.update("api::knock-out-phase.knock-out-phase", entityId, {
            data: {
                [roundName] : updateStagesQuery
            }
        });
    }
    else {
        await strapi.entityService.update("api::knock-out-phase.knock-out-phase", entityId, {
            data: {
                [roundName] : {
                    id: round.id,
                    matches: {
                        set: getMatchIds(round.team_a.id, round.team_b.id, kop.matches)
                    }
                }
                
            }
        });
    }
}

/*define rounds name */
const roundNames = ["round_of_16", "round_of_8", "semifinal", "final", "final_3_4"];

module.exports = ({strapi}) => ({
    /**
     * @param {any} entityId
     */
    async updateMatchRelations(entityId){
        /* define base query*/
        const query = {
            fields: [],
            populate: {
                matches: {
                    fields: [],
                    populate: {
                        home_team: {
                            fields: []
                        },
                        away_team: {
                            fields: []
                        },
                    }
                }
            }
        }
        /* add populate params for each round */
        for (var roundName of roundNames){
            query.populate[roundName] = {
                populate: {
                    team_a: {
                        fields: []
                    },
                    team_b: {
                        fields: []
                    },
                }
            }
        }
        const kop = await strapi.entityService.findOne("api::knock-out-phase.knock-out-phase", entityId, query);

        for(var roundName of roundNames){
            await connectStageMatch(entityId, kop, roundName)
        }
        
    },

});

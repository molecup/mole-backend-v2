'use strict';
const { errors } = require('@strapi/utils');

function compareObj(objA, objB, keyExtractors){
    for (const key of keyExtractors){
        if(key(objA) !== key(objB)){
            return key(objB) - key(objA);
        }
    }
}

/**
 * ranking service
 */

module.exports = ({strapi}) => ({
    /**
     * @param {number} entityId
     */
    async updateRanking(entityId){
        const group = await strapi.entityService.findOne("api::group-phase.group-phase", entityId, {
            fields: [],
            populate: {
                teams: {
                    fields: [],
                    populate: {
                        team: {
                            fields: []
                        }
                    }
                },
                matches: {
                    fields: ["home_score", "away_score", "home_penalties", "away_penalties", "penalties"],
                    populate: {
                        home_team: {
                            fields: [],
                        },
                        away_team: {
                            fields: [],
                        },
                        event_info: {
                            fields: ["status"]
                        }
                    }
                }
            }
        });

        const ranking = {};
        group.teams.forEach((element) => {
            ranking[element.team.id] = {
                id: element.id,
                pts: 0,
                wins: 0,
                draws: 0,
                losses: 0,
                goal_scored: 0,
                goal_taken: 0,
                played: 0,
            }
        });

        group.matches.filter(match => match.event_info.status === "finished" || match.event_info.status === "live")
                    .forEach(match => {
            const home = ranking[match.home_team.id];
            const away = ranking[match.away_team.id];
            if(!home || !away){
                //await strapi.entityService.delete('api::match.match', match.id);
                throw new errors.ApplicationError("Both teams of a match must be part of the group phase. Match id:" + match.id);
            }
            home.played ++;
            away.played ++;
            home.goal_scored += match.home_score;
            away.goal_taken += match.home_score;
            home.goal_taken += match.away_score;
            away.goal_scored += match.away_score;
            const winner = strapi.service("api::match.result").computeWinner(match);
            switch(winner){
                case "home":
                    home.wins ++;
                    home.pts += 3;
                    away.losses ++;
                    break;
                case "away":
                    away.wins ++;
                    away.pts += 3;
                    home.losses ++;
                    break;
                case "draw":
                    home.draws ++;
                    home.pts += 1;
                    away.draws ++;
                    away.pts += 1;
            }
        });


        const keyExtractors = [(obj) => obj.pts, (obj) => -obj.played, (obj) => obj.goal_scored-obj.goal_taken, (obj) => obj.goal_scored];
        const rankList = Object.values(ranking)
            //.map(key => ({teamId: key, ...ranking[key]}))
            .sort((a, b) => compareObj(a, b, keyExtractors))

        var rank = 1;
        for (var i = 0; i < rankList.length; i++) {
            // increase rank only if current score less than previous
            if (i > 0 && compareObj(rankList[i], rankList[i-1], keyExtractors)) {
            rank++;
            }
            rankList[i].rank = rank;
        }

        await strapi.entityService.update("api::group-phase.group-phase", entityId, {
            data: {
                teams: rankList
            }
        })
    }

});

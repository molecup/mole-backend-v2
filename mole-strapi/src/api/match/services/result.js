'use strict';
const { errors } = require('@strapi/utils');

/**
 * final service
 */



function mapTeamToScoreLabel(label){
    switch(label){
        case "home_team":
            return "home_score";
        case "away_team":
            return "away_score";
        default:
            throw new errors.ApplicationError("Team label in match goal events not valid. Found: " + label)
        
    }
}

function computeScoreFromEvents(match_events){
    const goalComponentName = 'match-event.goal';
    const score = {
        home_score: 0,
        away_score: 0,
    };

    match_events.forEach(event => {
        if(event.__component === goalComponentName){
            score[mapTeamToScoreLabel(event.team)]++;
        }
    });
    return score;
}

module.exports = ({strapi}) => ({
    async updateScore(entityId){
        const score = {
            home_score: 0,
            away_score: 0,
        };

        const match = await strapi.entityService.findOne("api::match.match", entityId, {
            fields: ["score_policy", "away_score_offset", "home_score_offset", "away_score", "home_score"],
            populate: {
                match_events: true,
                group_phase: true,
                knock_out_phase: true,
            }
        });
        
        // compute score
        if(["events_offset", "events_only"].includes(match.score_policy)){
            const eventsScore = computeScoreFromEvents(match.match_events);
            score["away_score"] += eventsScore["away_score"];
            score["home_score"] += eventsScore["home_score"];
        }

        if(["events_offset", "offset_only"].includes(match.score_policy)){
            score["away_score"] += match.away_score_offset;
            score["home_score"] += match.home_score_offset;
        }
        
        //update entity only if score is different (prevent infinite loop)
        if(match.home_score !== score.home_score || match.away_score !== score.away_score){
            await strapi.entityService.update("api::match.match", entityId, {
                data: {
                    ...score
                }
            });

            
        }

    },

    computeWinner(match){
        if(match.home_score > match.away_score){
            return "home";
        }
        if(match.home_score < match.away_score){
            return "away";
        }
        if(match.home_score === match.away_score){
            if(!match.penalties){
                return "draw";
            }
            if(match.home_penalties > match.away_penalties){
                return "home"
            }
            return "away"
        }
    }
    
});

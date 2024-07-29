import type { Schema, Attribute } from '@strapi/strapi';

export interface RelationsTournamentEdition extends Schema.Component {
  collectionName: 'components_relations_tournament_editions';
  info: {
    displayName: 'tournament edition';
    icon: 'calendar';
    description: '';
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    group_phases: Attribute.Relation<
      'relations.tournament-edition',
      'oneToMany',
      'api::group-phase.group-phase'
    >;
    knock_out_phase: Attribute.Relation<
      'relations.tournament-edition',
      'oneToOne',
      'api::knock-out-phase.knock-out-phase'
    >;
    teams: Attribute.Relation<
      'relations.tournament-edition',
      'oneToMany',
      'api::team.team'
    >;
  };
}

export interface RelationsTeamRank extends Schema.Component {
  collectionName: 'components_relations_team_ranks';
  info: {
    displayName: 'Team rank';
    icon: 'bulletList';
    description: '';
  };
  attributes: {
    team: Attribute.Relation<
      'relations.team-rank',
      'oneToOne',
      'api::team.team'
    >;
    points: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Attribute.DefaultTo<0>;
    wins: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Attribute.DefaultTo<0>;
    draws: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Attribute.DefaultTo<0>;
    losses: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Attribute.DefaultTo<0>;
    goal_scored: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Attribute.DefaultTo<0>;
    goal_taken: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Attribute.DefaultTo<0>;
    played: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Attribute.DefaultTo<0>;
  };
}

export interface RelationsKnockOutMatch extends Schema.Component {
  collectionName: 'components_relations_knock_out_matches';
  info: {
    displayName: 'knock out match';
    icon: 'crown';
  };
  attributes: {
    team_a: Attribute.Relation<
      'relations.knock-out-match',
      'oneToOne',
      'api::team.team'
    >;
    team_b: Attribute.Relation<
      'relations.knock-out-match',
      'oneToOne',
      'api::team.team'
    >;
    matches: Attribute.Relation<
      'relations.knock-out-match',
      'oneToMany',
      'api::match.match'
    >;
  };
}

export interface MatchEventGoal extends Schema.Component {
  collectionName: 'components_match_event_goals';
  info: {
    displayName: 'Goal';
    icon: 'check';
    description: '';
  };
  attributes: {
    penalty: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
    minute: Attribute.Integer & Attribute.DefaultTo<-1>;
    team: Attribute.Enumeration<['home_team', 'away_team']> &
      Attribute.Required;
  };
}

export interface MatchEventCard extends Schema.Component {
  collectionName: 'components_match_event_cards';
  info: {
    displayName: 'Card';
    icon: 'emotionUnhappy';
    description: '';
  };
  attributes: {
    card_type: Attribute.Enumeration<['yellow', 'red']> &
      Attribute.Required &
      Attribute.DefaultTo<'yellow'>;
    minute: Attribute.Integer & Attribute.DefaultTo<-1>;
    team: Attribute.Enumeration<['home_team', 'away_team']> &
      Attribute.Required;
  };
}

export interface CommonsEventInfo extends Schema.Component {
  collectionName: 'components_commons_event_infos';
  info: {
    displayName: 'Event info';
    icon: 'clock';
    description: '';
  };
  attributes: {
    datetime: Attribute.DateTime & Attribute.Required;
    cover: Attribute.Media<'images'>;
    registration_link: Attribute.String;
    event_registration: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
    status: Attribute.Enumeration<
      ['programmed', 'live', 'finished', 'delayed', 'cancelled']
    > &
      Attribute.Required &
      Attribute.DefaultTo<'programmed'>;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'relations.tournament-edition': RelationsTournamentEdition;
      'relations.team-rank': RelationsTeamRank;
      'relations.knock-out-match': RelationsKnockOutMatch;
      'match-event.goal': MatchEventGoal;
      'match-event.card': MatchEventCard;
      'commons.event-info': CommonsEventInfo;
    }
  }
}

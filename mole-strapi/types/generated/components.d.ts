import type { Schema, Attribute } from '@strapi/strapi';

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
      'api::team-edition.team-edition'
    >;
    pts: Attribute.Integer &
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
    rank: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    private_name: Attribute.String & Attribute.Private;
  };
}

export interface RelationsKnockOutMatch extends Schema.Component {
  collectionName: 'components_relations_knock_out_matches';
  info: {
    displayName: 'knock out match';
    icon: 'crown';
    description: '';
  };
  attributes: {
    team_a: Attribute.Relation<
      'relations.knock-out-match',
      'oneToOne',
      'api::team-edition.team-edition'
    >;
    team_b: Attribute.Relation<
      'relations.knock-out-match',
      'oneToOne',
      'api::team-edition.team-edition'
    >;
    matches: Attribute.Relation<
      'relations.knock-out-match',
      'oneToMany',
      'api::match.match'
    >;
    winner: Attribute.Enumeration<['none', 'team_a', 'team_b']> &
      Attribute.Required &
      Attribute.DefaultTo<'none'>;
    autocompute_winner: Attribute.Boolean &
      Attribute.Required &
      Attribute.Private &
      Attribute.DefaultTo<true>;
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
    player: Attribute.Relation<
      'match-event.goal',
      'oneToOne',
      'api::player.player'
    >;
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
    player: Attribute.Relation<
      'match-event.card',
      'oneToOne',
      'api::player.player'
    >;
  };
}

export interface CommonsSeo extends Schema.Component {
  collectionName: 'components_commons_seos';
  info: {
    displayName: 'SEO';
    icon: 'feather';
    description: '';
  };
  attributes: {
    keywords: Attribute.String;
    preventIndexing: Attribute.Boolean & Attribute.DefaultTo<false>;
    metaTitle: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 60;
      }>;
    metaDescription: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 155;
      }>;
    shareImage: Attribute.Media<'images'>;
    generateAutomatically: Attribute.Boolean & Attribute.DefaultTo<true>;
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
    registration_link: Attribute.String;
    event_registration: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
    status: Attribute.Enumeration<
      ['programmed', 'live', 'finished', 'delayed', 'cancelled']
    > &
      Attribute.Required &
      Attribute.DefaultTo<'programmed'>;
    stadium: Attribute.Relation<
      'commons.event-info',
      'oneToOne',
      'api::stadium.stadium'
    >;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'relations.team-rank': RelationsTeamRank;
      'relations.knock-out-match': RelationsKnockOutMatch;
      'match-event.goal': MatchEventGoal;
      'match-event.card': MatchEventCard;
      'commons.seo': CommonsSeo;
      'commons.event-info': CommonsEventInfo;
    }
  }
}

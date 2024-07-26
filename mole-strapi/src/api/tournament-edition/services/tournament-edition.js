'use strict';

/**
 * tournament-edition service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::tournament-edition.tournament-edition');

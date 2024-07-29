'use strict';

/**
 * team-edition service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::team-edition.team-edition');

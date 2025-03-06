'use strict';

/**
 * player-list service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::player-list.player-list');

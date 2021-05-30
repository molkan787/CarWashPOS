const { Model } = require('objection');
const Knex = require('knex');
const Config = require('../config');

module.exports = function (){
    // Initialize knex.
    const knex = Knex({
        client: 'mysql2',
        connection: Config.db,
    });

    // Give the knex object to objection.
    Model.knex(knex);

    console.log('MySQL: Connected');
}

const sequelize = require('../db')
const {DataTypes} = require('sequelize')

/**
 * Description placeholder
 * @date 5/24/2023 - 1:49:37 AM
 *
 * @type {*}
 */
const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING},
    password: {type: DataTypes.STRING},
    experience: {type: DataTypes.SMALLINT, defaultValue: 1},
    gold: {type: DataTypes.INTEGER, defaultValue: 0},
    score: {type: DataTypes.INTEGER, defaultValue: 0}
})

/**
 * Description placeholder
 * @date 5/24/2023 - 1:49:37 AM
 *
 * @type {*}
 */
const Level = sequelize.define('level', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    level_address: {type: DataTypes.STRING}
})


User.hasOne(Level)
Level.belongsTo(User)


module.exports = {
    User,
    Level
}
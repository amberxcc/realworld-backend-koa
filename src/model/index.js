const mongoose = require('mongoose')
const { MONGODB_HOST, MONGODB_PORT, COLLECTION, DB_TIMEOUT } = require('../config/config.default')
const User = require('./user')
const Article = require('./article')
const Comment = require('./comment')
const logger = require('../utils/logger')

const dbUrl = `mongodb://${MONGODB_HOST}:${MONGODB_PORT}/${COLLECTION}`

logger.info(`Try connect to mongodb (timeout in ${DB_TIMEOUT}ms): ${dbUrl}`)
mongoose.connect(dbUrl, { serverSelectionTimeoutMS: DB_TIMEOUT })
    .then(() => {
        logger.info(`Mongodb connected: ${dbUrl}`)
    }).catch(err => {
        logger.error(`Mongodb connect fail: ${dbUrl}`, err)
        process.exit(1)
    })


module.exports = {
    User,
    Article,
    Comment
}
module.exports = {
    // URL: `mongodb://localhost:27017/laundrypintar`,
    URL: `mongodb+srv://${process.env.DB_USER}:${
        process.env.DB_PASS
    }@cobalaundry-fqyyd.mongodb.net/test?retryWrites=true`,
}

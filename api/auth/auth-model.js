const db = require("../../data/dbConfig")

module.exports = {
    createUser
}

function getById(id) {
    return db("users").where("id", id).first()
}

async function createUser(userData) {
    return db("users").insert(userData)
        .then( ([id]) => getById(id))
}


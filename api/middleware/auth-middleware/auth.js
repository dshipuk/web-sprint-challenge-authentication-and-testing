const Auth = require("../../auth/auth-model")
const db = require("../../../data/dbConfig")

function validateBody(req, res, next) {
    const { username, password } = req.body

    if(!username || !username.trim() || !password) {
        res.status(400).json({ message: "username and password required" })
    } else {
        next()
    }
}

async function uniqueUsername(req, res, next) {
    const { username } = req.body;

    const checkIfExists = await db("users").where("username", username).first()

    if (checkIfExists) {
        res.status(400).json({ message: "username taken" })
    } else {
        next()
    }
}

async function usernameExists(req, res, next) {
    const { username } = req.body

    const checkIfExists= await db("users").where("username", username).first()
    
    if (checkIfExists) {
        req.storedUser = checkIfExists
        next()
    } else {
        res.status(400).json({ message: "username and password required" })
    }
}



module.exports = {
    validateBody,
    uniqueUsername,
    usernameExists,
}
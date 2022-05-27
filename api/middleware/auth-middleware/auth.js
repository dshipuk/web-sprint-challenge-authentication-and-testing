const db = require("../../../data/dbConfig")
const bcrypt = require("bcryptjs")

function validateRegister(req, res, next) {
    const { username, password } = req.body

    if (!username || !username.trim() || !password) {
        res.status(400).json({ message: "username and password required" })
    } else {
        const hash = bcrypt.hashSync(password, 8);
        req.hash = hash
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
        next()
    } else {
        res.status(400).json({ message: "username and password required" })
    }
}

async function usernameValid(req, res, next) {
    const { username } = req.body

    const checkIfExists= await db("users").where("username", username).first()
    
    if (checkIfExists) {
        req.storedUser = checkIfExists
        next()
    } else {
        res.status(400).json({ message: "invalid credentials" })
    }
}

function validateLogin(req, res, next) {
    const { username, password } = req.body

    if (!username || !username.trim() || !password) {
        res.status(400).json({ message: "username and password required" })
    } else {
        next()
    }
}



module.exports = {
    validateRegister,
    uniqueUsername,
    usernameExists,
    validateLogin,
    usernameValid
}
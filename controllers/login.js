const mysqlConnectionFactory = require('../database/MySQLConnection.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;
const login = async (req, res) => {
    try {
        const connection = await mysqlConnectionFactory.getConnection();

        const userName = req.body.username;
        const password = req.body.password;

        const onlyLettersPattern = /^[A-Za-z0-9]+$/;
        if (onlyLettersPattern.test(userName) && onlyLettersPattern.test(password)) {
            const [rows, fields] = await connection.query('SELECT UserId,pass from User where userName = ?', [userName]);
            if (rows.length == 0) {
                res.status(401).send({ message: 'Invalid Username or password.' })
            }
            else {
                const pass = rows[0].pass;
                if (await bcrypt.compare(password, pass)) {
                    const userId = rows[0].UserId;
                    const token = jwt.sign({ userId: userId }, SECRET, {
                        expiresIn: '6h',
                    });
                    res.status(200).send({ message: "Login Success!", token: token })
                }
                else
                    res.status(400).send({ message: "Invalid Username or password." })
            }

        }

        else
            return res.status(400).send({ message: "Invalid Character in Input form" })
    }
    catch (err) {
        res.status(500).send({ message: "Internal Server Error" })
    }

}

module.exports = login;
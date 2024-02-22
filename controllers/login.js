const mysqlConnectionFactory = require('../database/MySQLConnection.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const SECRET=process.env.SECRET;
const login = async (req, res) => {
    const connection = await mysqlConnectionFactory.getConnection();

    const userName = req.body.username;
    const password = req.body.password;
    
    const onlyLettersPattern = /^[A-Za-z0-9]+$/;
    if (onlyLettersPattern.test(userName) && onlyLettersPattern.test(password)) {
        connection.query('SELECT UserId,pass from User where userName = ?', [userName], async (err, result, connection) => {
            if (err) {
                console.log(err)
                res.status(500).send({ message: 'Error Occured' })
            }
            if (result.length == 0) {
                res.status(401).send({ message: 'Invalid Username or password.' })
            }
            else {
                const userId=result[0].UserId;
                const token = jwt.sign({ userId: userId },  SECRET, {
                    expiresIn: '6h',
                    });
                const pass = result[0].pass;
                if (await bcrypt.compare(password, pass)) {
                    res.status(200).send({ message: "Login Success!" , token: token})
                }
                else
                    res.status(400).send({ message: "Invalid Username or password." })
            }

        })
    }
    else
        return res.status(400).send({ message: "Invalid Character in Input form" })

}

module.exports = login;
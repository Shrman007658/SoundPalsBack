const mysqlConnectionFactory = require('../database/MySQLConnection.js')
const bcrypt = require('bcrypt')
const regUser = async (req, res) => {
    //User sends in username, first name , last name and password. 
    //First we check whether the username already exists. If it exists, then the request is returned with error. 
    //Otherwise, we hash it, and store it in db.
    try {
        const userName = req.body.username;
        const password = req.body.password;
        const firstName = req.body.firstname;
        const lastName = req.body.lastname;

        if (!(userName && password && firstName && lastName))
            res.status(500).send({ message: "Error while Querying DB" })
        const connection = await mysqlConnectionFactory.getConnection();

        //sanitize userInput and only allow SQL if the username is containing [A-Za-z]
        const onlyLettersPattern = /^[A-Za-z0-9]+$/;
        if (onlyLettersPattern.test(userName) && onlyLettersPattern.test(password)
            && onlyLettersPattern.test(firstName) && onlyLettersPattern.test(lastName)) {
            //Only if all are matching then register. Else return error. 
            //Check if userName already exists. if Yes return error. if flase then go ahead. 
            const [rows, fields] = await connection.query('SELECT userId from User where userName = ?', [userName]);
            if (rows.length > 0) {
                res.status(400).send({ message: "UserName Already Exists." })
            }
            else {
                //hash password with bcrypt
                const salt = await bcrypt.genSalt(11)
                const hashedPassword = await bcrypt.hash(password, salt)
                const [rows, fields] = await connection.query('INSERT into User (LastName,FirstName,userName,pass) values (?,?,?,?)', [lastName, firstName, userName, hashedPassword]);
                res.status(200).send({ message: "User Created" })
            }

        }
        else
            return res.status(400).send({ message: "Invalid Character in Input form" })
    }
    catch (err) {
        return res.status(500).send({ message: err })
    }
}

module.exports = regUser;
const MySQLConnection = require("../database/MySQLConnection");
const fs = require('fs')
const createSQLEntry = async (req, res, next) => {
    try {
        const pool = await MySQLConnection.getConnection();
        const conn = await pool.getConnection();
        const userId = req.userId;
        if(!req.file)
        res.status(401).send({message:"Invalid Audio file Type"});
        const fileName = req.file.originalname;
        try {
            console.log(userId, fileName);

            //Start transaction
            await conn.beginTransaction();
            await conn.execute('INSERT into Post(post,UserId) Values(?,?)', [fileName, userId]);
            await conn.commit();
            next();
        }
        catch (error) {
            console.error(error);
            fs.unlinkSync(`uploads/${fileName}`);
            await conn.rollback();
            res.status(500).send({ message: error });
        }
        finally {
            if (conn)
                await conn.release();
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }




}
module.exports = createSQLEntry;
const mysqlConnectionFactory = require("../database/MySQLConnection");
const mysql = require('mysql2/promise');
const paginatedHome = async (req, res, next) => {
    try {
        const page = req.query.page || 1;
        const pool=await mysqlConnectionFactory.getConnection();
        const pageSize = process.env.PAGE_SIZE;
        const offset = (page - 1) * pageSize;
        const [countResult, field] = await pool.execute("SELECT count(1) as countRecords from Post");
        const totalCountOfPosts = countResult[0].countRecords;
        console.log(pageSize,offset,totalCountOfPosts)
        const [results, fields] = await pool.query("SELECT * FROM Post ORDER BY create_dt DESC LIMIT ? OFFSET ?", [parseInt(pageSize), parseInt(offset)]);
        const fileList = results.map((postRecord, idx) =>
        ({
            id: idx + 1,
            postId: postRecord.PostID,
            fileName: postRecord.post,
            createdByUser: postRecord.UserId,
            createdTimestamp: postRecord.create_dt,
            path: `/uploads/${postRecord.post}`
        }));

        const response = {
            page: page,
            pageSize: pageSize,
            payload: fileList,
            totalPages: parseInt(Math.ceil(parseFloat(parseInt(totalCountOfPosts) / parseInt(pageSize))))
        }
        res.status(200).send(response);
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ message: err });
    }
}

module.exports = paginatedHome
const mysqlConnectionFactory = require("../database/MySQLConnection");
const fs = require('fs')
const getAudio = async (req,res,next) =>
{
    //This will basically accept a parameterId called audioId which will have the postID and we will return it as a file to the user. 
    try {        
        const pool=await mysqlConnectionFactory.getConnection();
        const postId = req.query.postId;
        const userId = req.userId;
        const [rows,fields] = await pool.execute("Select post from Post where PostID=?",[postId]);
        if(rows.length==0)
        res.status(400).send({message:"Audio not found."})
        const fileName=rows[0].post;
        const filePath=`uploads/${fileName}`
        res.setHeader('Content-Type', 'audio/*');
        const stream=fs.createReadStream(filePath,{ highWaterMark: 64 * 1024 });
        stream.pipe(res);
        stream.on('error', (err) => {
            console.error('Error streaming audio file:', err);
            res.status(500).send({message:"Error streaming audio file"});
          });
    } catch (error) {
        console.error(error)
        res.status(500).send({message:"Some error has occured"})
    }
}
module.exports=getAudio;
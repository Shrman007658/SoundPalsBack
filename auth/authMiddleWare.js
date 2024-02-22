const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;
const validateUser = (req,res,next)=>
{
    const token=req.header('Authorization').split(" ")[1];
    if(!token) return res.status(401).json({message:"User not Authorized"})

    try {
        const decoded = jwt.verify(token,SECRET);
        req.userId=decoded.userId;
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ message: 'Invalid token' });
    }
}

module.exports=validateUser;
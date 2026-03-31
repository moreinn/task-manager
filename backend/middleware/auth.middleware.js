import jwt from "jsonwebtoken";

const JWT_SECRET = "mysecretkey";

export const protectedRoute = (req, res, next) => {
    try{
        const token  = req.cookies.token;

        if(!token){
            return res.status(401).json({ error: "Not authorized"})
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        req.user = decoded

        next()
    }catch (error){
        return res.status(401).json({ error: "invalid token "})
    }
}

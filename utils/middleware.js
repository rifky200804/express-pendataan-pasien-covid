import jwt from "jsonwebtoken"
import response from "./response.js"
let middleware = {}
middleware.auth = (req,res,next) => {
    // bisa menggunakan req.headers/req.get
    const authorization = req.get("Authorization")
    if(!authorization) {
        return response.error(res,response.API_INVALID_TOKEN,response.HTTP_UNAUTHORIZED)
    }
    const token = authorization && authorization.split(" ")[1];

    try {
        const decoded = jwt.verify(token,process.env.TOKEN_SECRET)
        req.user = decoded
        next();
    } catch (error) {
        return response.error(res,response.API_INVALID_TOKEN,response.HTTP_UNAUTHORIZED)
    }
}

export default middleware
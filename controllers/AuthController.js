import response from "../utils/response.js"
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import { check, validationResult } from 'express-validator';
import Validation from '../validation/AuthValidation.js';

class AuthController {
    async login(req, res) {
        try {
            await Promise.all(Validation.loginValidation.map((validation) => validation.run(req)));
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const formattedErrors = errors.array().map((error) => ({
                [error.path]: error.msg
                }));
                return response.error(res,"Username And Password are required",response.HTTP_UNPROCESSABLE_ENTYTY,formattedErrors)
            }
            
            const { username, password } = req.body;


            const user = await User.findOne({
                where: { username: username },
            });

            if (!user) {
                return response.error(res,response.API_INVALID_LOGIN,response.HTTP_UNAUTHORIZED)
            }

            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return response.error(res,response.API_INVALID_LOGIN,response.HTTP_UNAUTHORIZED)
            }

            const payload = {
                id: user.id,
                username: user.username,
            };

            const secret = process.env.TOKEN_SECRET;
            const token = jwt.sign(payload, secret, { expiresIn: "24h" });

            let data = {
                token:token,
                username:payload.username
            }
            return response.success(res, data, response.API_LOGIN_SUCCESS, response.HTTP_OK);
        } catch (error) {
            console.error(error);
            return response.error(res, response.API_GENERAL_ERROR, response.HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @swagger
     *  /auth/register:
     *    post:
     *      summary: Register a new user
     *      tags: [Authentication]
     *      requestBody:
     *        required: true
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                username:
     *                  type: string
     *                  description: The username.
     *                email:
     *                  type: string
     *                  description: The email.
     *                password:
     *                  type: string
     *                  description: The password.
     *              example:
     *                username: raka
     *                email: raka@gmail.com
     *                password: secret123
     *      responses:
     *        '201':
     *          description: Successfully registered
     *          content:
     *            application/json:
     *              example:
     *                id: 1
     *                username: raka
     *                email: raka@gmail.com
     *        '400':
     *          description: Bad Request
     *        '422':
     *          description: Unprocessable Entity
     */
    async register(req,res){
        try {
            await Promise.all(Validation.registerValidation.map((validation) => validation.run(req)));
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const formattedErrors = errors.array().map((error) => ({
                  [error.path]: error.msg
                }));
                return response.error(res,"All Fields Are Required",response.HTTP_UNPROCESSABLE_ENTYTY,formattedErrors)
            }

            
            const { username, email, password } = req.body;

            let checkData = await User.findOne({where:{
                    [Op.or]: [
                        { email: email },
                        { username: username }
                    ]
                }
            })

            if (checkData != null){
                return response.error(res, "Request Email or NIM is available", response.HTTP_FAILED);
            }
    
            const hash = await bcrypt.hash(password, 10);
            const newUser = await User.create({
                username: username,
                email: email,
                password: hash,
            });
    
            return response.success(res,newUser,response.API_SAVE_SUCCESS,response.HTTP_SUCCESS_CREATED)
        } catch (error) {
          console.error("Error creating user:", error);
          response.error(res,"Internal Server Error",response.HTTP_INTERNAL_SERVER_ERROR)
        }
    }
}

let controller = new AuthController();

export default controller;

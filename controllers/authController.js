import { pool } from "../data/database.js";

// Security imports
import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';

const conn = pool;

/**
 * @description - Fuction to create the JWT token based on some inputs
 * @param user - The user object from database
 */
function signJWTToken(user){
    return JWT.sign({
        id: user.id, 
        role: user.role, 
        // firstName: user.first_nm, 
        // lastName: user.last_nm,
    }, process.env.JWT_SECRET, 
    {
        expiresIn: process.env.JWT_EXPIRES_IN
    }
)
}

export const registerUser = async (req, res, next) =>{
    const sqlQuery = `insert into users (email, password, first_name, last_name, role, last_login)
                        values(?,?,?,?,?,?)
    `

    const data = req.body;
    const vRole = 'USER';
    const vStatus = 'ACTV';
    const vDate = new Date();

    data.password = await bcrypt.hashSync(data.password);

    const [result] = await conn.query(sqlQuery, [data.email, data.password, data.first_nm, 
                                                data.last_nm, vRole, vDate]);

    if(result.insertId > 0){
        const token = signJWTToken({id: result.insertId, role: vRole,});

            res.status(201).json({
                satus: 'success',
                data: token,
                user: data
            });
    }else {
        res.status(400).json({
            status: 'error',
            message: 'Error during registration.'
        });
    }
};

export const loginUser = async (req, res, next) =>{
    const data = req.body;

    const [user] = await conn.query(`select * from users where email = ?`, [data.email]);
    if(!user.length){
        return res.status(404).json({
            status: 'error',
            message: 'User not found.'
        });
    };

    if(user[0].status == 'NACTV'){
        return res.status(200).json({
            status: 'error',
            message: 'User not active on the system.'
        });
    };

    if(!(await bcrypt.compare(data.password, user[0].password))){
        return res.status(200).json({
            status: 'error',
            message: 'Invalid user credintials'
        });
    };

    await conn.query(`update users set last_login = CURRENT_TIMESTAMP() WHERE ID = ?`, [user[0].id]);

    const token = signJWTToken(user[0]);

    user[0].password = undefined;

    res.status(200).json({
        status: 'success',
        data: {
            token,
            user: user[0],
        }
    });
};

export const protect = async (req, res, next)=>{
    const authorization = req.get('Authorization');
    console.log(`request object ${req.headers}`)
    console.log(`REQUEST AUTHORIZATION >> ${authorization}`);

    if(!authorization?.startsWith('Bearer')){
        return next(
            res.status(400).json({
                status: 'error',
                message: 'You must be logged in in order to access this feature.'
            })
        )
    };
    const token = authorization.split(' ')[1];

    try {
        console.log(`BEFORE JWT.VERIFY`);
        const decoded = JWT.verify(token, process.env.JWT_SECRET);
        console.log(`DECODED TOKEN: ${JSON.stringify(decoded)}`);

        const [user] = await conn.query(`SELECT * FROM users WHERE id = ? AND status = 'ACTV'`, [decoded.id]);

        if(!user.length){
            return next(
                res.status(404).json({
                    status: 'error',
                    message: 'This token is no longer valid or there is a validation error'
                })
            )
        };

        const data = user[0];
        data.password = undefined;
        req.user = data;
        next();

    } catch (error) {

        console.log(error.message);

        if(error.message == 'jwt expired'){
            return next(
                res.status(400).json({
                    status: 'error',
                    message: 'Token has expired'
                })
            );
        } else if(error.message == 'jwt malformed'){
            return next(
                res.status(400).json({
                    status: 'error',
                    message: 'Malformed token'
                })
            );
        } else if(error.message == 'invalid token'){
            return next(
                res.status(400).json({
                    status: 'error',
                    message: 'Token is invalid!!'
                })
            );
        }else {
            return next(
                res.status(400).json({
                    status: 'error',
                    message: 'Unknown Error'
                })
            );
        }

        // next();

    }
}

export const getAllUsers = async (req, res, next)=>{
    const data = req.body;
    const [users] = await conn.query(`SELECT * FROM users`);
    // todo error check
    const userData = users;

    userData.forEach(user =>{

        // console.log(`Each user >> ${JSON.stringify(user)}`)
        user.password = undefined;
    });

    res.status(200).json({
        status: 'success',
        data: {
            users: users
        }
    });

}

export const getThisUser = async (req, res, next)=>{
    const data = req.user;
    
    if(!data) return next();
    
    const [user] = await conn.query(`select * from users where id = ?`, [data.id]);

    if(!user.length) {
        return res.status(404).json({
            status: 'error',
            message: 'invalid request'
        });
    };

    user[0].password = undefined;
    res.status(200).json({
        status: 'success',
        data: {
            user: user[0]
        }
    });

}
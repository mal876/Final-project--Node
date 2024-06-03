import {pool} from "../data/database.js"

export const getAllDoctors = async (_req, res, _next)=>{
    let sqlQuery = `select * from all_doctors`;
    const [doctors] = await pool.query(sqlQuery);

    res.status(200).json({
        status: 'success',
        results: doctors.length,
        data: {doctors}
    })
}

export const createDoctor = async (req, res, _next)=>{
    let sqlQuery = `insert into all_doctors
                     (doctor_name, doctor_gender)
                     values(?,?)`
                     ;

    const [doctors] = await pool.query(sqlQuery, [req.body.doctor_name, req.body.doctor_gender]);
    
    res.status(200).json({
        status: 'success',
        results: doctors.length,
        recordID: doctors.insertId
    })

}


export const updateDoctor = async (_req, res, _next)=>{
    let sqlQuery = `update all_doctrs
                     set doctor_name = ?, set doctor_gender ?
                     values(?,?)`
                     ;

    const [doctors] = await pool.query(sqlQuery, [req.body.doctor_name, req.body.doctor_gender]);
    if(doctors.affectedRows <= 0){
        res.status(400).json({
            status: 'error',
            message: 'Update Denied'
        });
    }else{
        res.status(200).json({
            status: 'success',
            affectedRows: doctors.affectedRows
        });
    }

}


export const deleteDoctor = async (req, res, _next)=>{
    const id = req.params.id;
    let sqlQuery = `delete from all_doctors
                     where id = ?
                     `;
    
    const [doctors] = await pool.query(sqlQuery, [id]);
    if(doctors.affectedRows <= 0){
        res.status(400).json({
            status: 'error',
            message: 'Unable to complete termination'
        });
    }else{
        res.status(200).json({
            status: 'success',
            affectedRows: doctors.affectedRows
        })
    }
}


export const getDoctorByID = async (req, res, _next)=>{
    const id = req.params.id;
    let sqlQuery = `select * from all_doctors where id = ${id}`;
    const [doctors] = await pool.query(sqlQuery);
    if(doctors.length <= 0){
        res.status(404).json({
            status: 'error',
            message: 'File not found'
        })
    }else{
        res.status(200).json({
            status: 'success',
            results: doctors.length,
            data: {doctors: doctors[0]}
        })
    }
}
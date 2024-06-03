import {pool} from "../data/database.js"

export const getAllMedicine = async (_req, res, _next)=>{
    let sqlQuery = `select * from all_meds`;
    const [meds] = await pool.query(sqlQuery);

    res.status(200).json({
        status: 'success',
        results: meds.length,
        data: {meds}
    })
}

export const createMedicine = async (req, res, _next)=>{
    let sqlQuery = `insert into all_meds
                     (medicine_name)
                     values(?)`
                     ;

    const [meds] = await pool.query(sqlQuery, [req.body.medicine_name]);
    
    res.status(200).json({
        status: 'success',
        results: meds.length,
        recordID: meds.insertId
    })

}

export const updateMedicine = async (req, res, _next)=>{
    let sqlQuery = `update all_meds
                     set medicine_name = ?
                     values(?)`
                     ;

    const [meds] = await pool.query(sqlQuery, [req.body.medicine_name]);
    if(meds.affectedRows <= 0){
        res.status(400).json({
            status: 'error',
            message: 'Update Denied'
        });
    }else{
        res.status(200).json({
            status: 'success',
            affectedRows: meds.affectedRows
        });
    }

}



export const deleteMedicine = async (req, res, _next)=>{
    const id = req.params.id;
    let sqlQuery = `delete from all_meds
                     where id = ?
                     `;
    
    const [meds] = await pool.query(sqlQuery, [id]);
    if(meds.affectedRows <= 0){
        res.status(400).json({
            status: 'error',
            message: 'Unable to complete termination'
        });
    }else{
        res.status(200).json({
            status: 'success',
            affectedRows: meds.affectedRows
        })
    }
}



export const getMedicineByID = async (req, res, _next)=>{
    const id = req.params.id;
    let sqlQuery = `select * from all_meds where id = ${id}`;
    const [meds] = await pool.query(sqlQuery);
    if(meds.length <= 0){
        res.status(404).json({
            status: 'error',
            message: 'File not found'
        })
    }else{
        res.status(200).json({
            status: 'success',
            results: meds.length,
            data: {meds: meds[0]}
        })
    }
}
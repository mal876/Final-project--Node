import {pool} from "../data/database.js"

export const getAllRecords = async (_req, res, _next)=>{
    let sqlQuery = `select * from all_patients`;
    const [records] = await pool.query(sqlQuery);

    res.status(200).json({
        status: 'success',
        results: records.length,
        data: {records}
    })
}


export const createRecord = async (req, res, _next)=>{
    let sqlQuery = `insert into all_patients
                     (patient_name, patient_sex, attending_physician, last_visit, diagnosis, medicine, treatment_plan, next_visit)
                     Values(?,?,?,?,?,?,?,?)`
                     ;
    
    const [records] = await pool.query(sqlQuery, [req.body.patient_name, req.body.patient_sex, req.body.attending_physician, req.body.last_visit, req.body.diagnosis, req.body.medicine, req.body.treatment_plan, req.body.next_visit]);

    res.status(200).json({
        status: 'success',
        results: records.length,
        recordID: records.insertId
    })

}


export const updateRecord = async (req, res, _next)=>{
    const id = req.params.id;
    let sqlQuery = `update all_patients
                    set patient_name = ?, patient_sex = ?, attending_physician = ?, last_visit = ?, diagnosis = ?, medicine = ?, treatment_plan = ?, next_visit = ?
                     where id = ?
                     `;
    
    const [records] = await pool.query(sqlQuery, [req.body.patient_name, req.body.patient_sex, req.body.attending_physician, req.body.last_visit, req.body.diagnosis, req.body.medicine, req.body.treatment_plan, req.body.next_visit]);
    if(records.affectedRows <= 0){
        res.status(400).json({
            status: 'error',
            message: 'Update Denied'
        })
    }else{
        res.status(200).json({
            status: 'success',
            affectedRows: records.affectedRows
        })
    }
}


export const deleteRecord = async (req, res, _next)=>{
    const id = req.params.id;
    let sqlQuery = `delete from all_patients
                     where id = ?
                     `;
    
    const [records] = await pool.query(sqlQuery, [id]);
    if(records.affectedRows <= 0){
        res.status(400).json({
            status: 'error',
            message: 'Unable to complete termination'
        })
    }else{
        res.status(200).json({
            status: 'success',
            affectedRows: records.affectedRows
        })
    }
}



export const getRecordByID = async (req, res, _next)=>{
    const id = req.params.id;
    let sqlQuery = `select * from all_patients where id = ${id}`;
    const [records] = await pool.query(sqlQuery);
    if(records.length <= 0){
        res.status(404).json({
            status: 'error',
            message: 'File not found'
        })
    }else{
        res.status(200).json({
            status: 'success',
            results: records.length,
            data: {records: records[0]}
        })
    }
}
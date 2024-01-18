import Patient from "../models/Patient.js";
import Status from "../models/Status.js";
import { Op } from "sequelize";
import { validationResult } from 'express-validator';
import Validation from '../validation/PatientValidation.js';
import response from "../utils/response.js";

class PatientController{
   
    async index(req,res){
        try {
            let pageLimit =  10;
            let pageNumber =  1;
            if (req.query.page != undefined){
                if(req.query.page["limit"]){
                    pageLimit = parseInt(req.query.page["limit"])
                }
                if(req.query.page["number"]){
                    pageNumber = parseInt(req.query.page["number"])
                }
            }
            let filter = {}
            
            filter.limit = pageLimit;
            filter.offset = (pageNumber - 1) * pageLimit;

            let where = {}

            let whereStatus = null
            if(req.query.filter != undefined){

                if(req.query.filter["name"] != '' && req.query.filter["name"] != undefined) {
                    where.name = {
                        [Op.like]: '%' + req.query.filter["name"] + '%'
                    }
                }
        
                if(req.query.filter["address"] != ''&& req.query.filter["address"].trim() != undefined) {
                    where.address = {
                        [Op.like]: '%' + req.query.filter["address"] + '%'
                    }
                }

                if (req.query.filter["status"] != '' && req.query.filter["status"] != undefined) {
                    whereStatus =  {status:{[Op.like]: `%${req.query.filter["status"]}%`}}
                }
        
                if (Object.keys(where).length > 0){
                    filter.where = where
                }
            }
            let includeJoin = {
                model: Status,
                as: 'statusInfo',
                attributes: ['status', 'inDateAt', 'outDateAt']
            }

            if (whereStatus != null) {
                includeJoin.where = whereStatus
            }
            console.log(includeJoin)

            filter.include = [includeJoin];
            let sortBy = "id"
            let orderBy = "DESC"

            if(req.query.order != undefined && req.query.order != ''){
                let filterOrder = req.query.order.toLowerCase()
                if(!['asc','desc'].includes(filterOrder)){
                    return response.error(res,"Order is asc or desc",response.HTTP_FAILED)
                }else{
                    orderBy = req.query.order
                }
            }
            let order 
            if(req.query.sort != undefined && req.query.sort != ''){
                let filterSort = req.query.sort.toLowerCase()
                // console.log(filterSort)
                if (!['tanggal_masuk', 'tanggal_keluar', 'address'].includes(filterSort)) {
                    return response.error(res,"Sort can only be tanggal_masuk, tanggal_keluar and address",response.HTTP_FAILED)
                }else{
                    switch (filterSort) {
                        case "tanggal_masuk":
                            order = ['statusInfo','inDateAt',orderBy]
                            break;
                        case "tanggal_keluar":
                            order = ['statusInfo','outDateAt',orderBy]
                            break;
                        case "address":
                            order = ["address",orderBy]
                            break;
                        default:
                            order = ["id",orderBy]
                            break;
                    }
                }
            }

            
            filter.order = [order]
            console.log(filter)
            const { count } = await Patient.findAndCountAll(filter);
            
            if (count < 1) {
                return response.error(res,"Data Not Found",response.HTTP_FAILED)
            }
            let page = {}
            page.pageLimit = pageLimit
            page.pageNumber = pageNumber
            page.TotalData = count
            page.TotalPage = Math.ceil(count / (filter.limit || 1));

            
            // console.log(filter)
            let patients = await Patient.findAll(filter)
            // console.log(patients)
            
            return response.successWithPaging(res,patients,page,response.API_MESSAGE_DEFAULT)
        } catch (error) {
            console.error(error)
            return response.error(res,response.API_GENERAL_ERROR,response.HTTP_FAILED)
        }
    }

    async create(req, res) {
        try {
          await Promise.all(Validation.createValidation.map((validation) => validation.run(req)));
          const errors = validationResult(req);
    
          if (!errors.isEmpty()) {
            const formattedErrors = errors.array().map((error) => ({
              [error.path]: error.msg
            }));
            return response.error(res, response.API_SAVE_FAILED, response.HTTP_UNPROCESSABLE_ENTYTY, formattedErrors);
          }
    
          const { name, phone, address, status, inDateAt, outDateAt } = req.body;
    
          const newStatus = await Status.create({
            status: status,
            inDateAt: inDateAt,
            outDateAt: outDateAt
          });
    
          const newPatient = await Patient.create({
            name: name,
            phone: phone,
            address: address,
            statusId: newStatus.id
          });
    
          return response.success(res, newPatient, response.API_SAVE_SUCCESS, response.HTTP_SUCCESS_CREATED);
        } catch (error) {
          console.error("Error creating patient:", error);
          return response.error(res, response.API_GENERAL_ERROR, response.HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    async detail(req,res){
        try {
            let patientId = req.params.id
            const patientDetails = await Patient.findByPk(patientId, {
                include: [
                {
                    model: Status,
                    as: 'statusInfo',
                    attributes: ['status', 'inDateAt', 'outDateAt']
                }
                ]
            });
            
            if (!patientDetails) {
                return response.error(res, "Patient Not Found", response.HTTP_NOT_FOUND);
            }
            
            return response.success(res, patientDetails, response.API_MESSAGE_DEFAULT);
        } catch (error) {
            console.error(error)
            return response.error(res, response.API_GENERAL_ERROR, response.HTTP_INTERNAL_SERVER_ERROR); 
        }       
    }

    async update(req,res){

        try {
            let patientId = req.params.id
            await Promise.all(Validation.updateValidation.map((validation) => validation.run(req)));
            const errors = validationResult(req);
    
            if (!errors.isEmpty()) {
            const formattedErrors = errors.array().map((error) => ({
                [error.path]: error.msg
            }));
            return response.error(res, response.API_UPDATE_FAILED, response.HTTP_UNPROCESSABLE_ENTYTY, formattedErrors);
            }
            
    
            const { name, phone, address, status, inDateAt, outDateAt } = req.body;

            if(!name && !phone && !address && !status && !inDateAt && !outDateAt) {
                return response.error(res, "There must be 1 column updated", response.HTTP_UNPROCESSABLE_ENTYTY);
            }

            let findPatient = await Patient.findByPk(patientId)

            if (findPatient == null) {
            return response.error(res, "Patient Not Found", response.HTTP_NOT_FOUND, formattedErrors);
            }

            let findStatus = await Status.findByPk(findPatient.id)

            let dataStatus = {
                status: status || findStatus.status,
                inDateAt: inDateAt || findStatus.inDateAt,
                outDateAt: outDateAt || findStatus.outDateAt
            }

            await findStatus.update(dataStatus)

            let dataPatient = {
                name: name || findPatient.name,
                phone: phone || findPatient.phone,
                address: address || findPatient.address,
            }

            await findPatient.update(dataPatient)

            response.success(res,[],response.API_UPDATE_SUCCESS,response.HTTP_OK)
        } catch (error) {
            console.error(error)
            return response.error(res, response.API_GENERAL_ERROR, response.HTTP_INTERNAL_SERVER_ERROR); 
        }
    }
    
    async delete(req,res){
        try {
            let patientId = req.params.id
            let patient = await Patient.findByPk(patientId)
            if (patient == null) {
                return response.error(res, "Patient Not Found", response.HTTP_NOT_FOUND);
            }
            let statusPatient = await Status.findByPk(patient.statusId)
            await patient.destroy()
            await statusPatient.destroy()

            response.success(res,[],response.API_DELETE_SUCCESS,response.HTTP_OK)

        } catch (error) {
            console.error(error)
            return response.error(res, response.API_GENERAL_ERROR, response.HTTP_INTERNAL_SERVER_ERROR); 
        }
    }

}

let controller = new PatientController()

export default controller
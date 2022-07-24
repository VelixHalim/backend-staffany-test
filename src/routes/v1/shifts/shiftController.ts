import { Request, ResponseToolkit } from "@hapi/hapi";
import * as shiftUsecase from "../../../usecases/shiftUsecase";
import * as publishUsecase from "../../../usecases/publishUsecase";
import { errorHandler } from "../../../shared/functions/error";
import {
  ICreateShift,
  IErrorResponse,
  ISuccessResponse,
  IUpdateShift,
} from "../../../shared/interfaces";
import moduleLogger from "../../../shared/functions/logger";
import moment from "moment";

const logger = moduleLogger("shiftController");

const checkPublishOrNot = async (body , h: ResponseToolkit) =>{
  
  let date= new Date(body.date) 
  let d =date.getDay()
  let start = date.getDate() - d+(d==0?-6:1)
  let end = start+6
  let monday = new Date(date.setDate(start))
  let sunday = new Date(date.setDate(end))
  let startDate = moment(monday).format("YYYY-MM-DD")
  let endDate = moment(sunday).format("YYYY-MM-DD")
  
  const filter ={where:{startDate:`${startDate}`, endDate:`${endDate}`}} 
  const checkpublish = await publishUsecase.find(filter)
  
  return checkpublish
}

export const find = async (req: Request, h: ResponseToolkit) => {
  logger.info("Find shifts");
  try {
    const filter = req.query;
    // console.log(filter)
    const data = await shiftUsecase.find(filter);
    const res: ISuccessResponse = {
      statusCode: 200,
      message: "Get shift successful",
      results: data,
    };
    return res;
  } catch (error) {
    logger.error(error.message)
    return errorHandler(h, error);
  }
};

export const findById = async (req: Request, h: ResponseToolkit) => {
  logger.info("Find shift by id");
  try {
    const id = req.params.id;
    const data = await shiftUsecase.findById(id);
    const res: ISuccessResponse = {
      statusCode: 200,
      message: "Get shift successful",
      results: data,
    };
    return res;
  } catch (error) {
    logger.error(error.message)
    return errorHandler(h, error);
  }
};

export const create = async (req: Request, h: ResponseToolkit) => {
  logger.info("Create shift");
  try {
    const body = req.payload as ICreateShift;
    
    // let date= new Date(body.date) 
    // let d =date.getDay()
    // let start = date.getDate() - d+(d==0?-6:1)
    // let end = start+6
    // let monday = new Date(date.setDate(start))
    // let sunday = new Date(date.setDate(end))
    // let startDate = moment(monday).format("YYYY-MM-DD")
    // let endDate = moment(sunday).format("YYYY-MM-DD")
    
    // const filter ={where:{startDate:`${startDate}`, endDate:`${endDate}`}} 
    // const checkpublish = await publishUsecase.find(filter)
    
    // if(checkpublish.length>0){
    //   let errorData={
    //     status: 300,
    //     error:"shift has been published",
    //     message:"Cannot create shift, shift has been published"   
    //   }
    //   logger.error(errorData.message)
    //   return errorHandler(h,errorData)
    // }
    let checkpublish = await checkPublishOrNot(body, h)
    if(checkpublish.length>0){
      let errorData={
        status: 300,
        error:"shift has been published",
        message:"Cannot create shift, shift has been published"   
      }
      logger.error(errorData.message)
      return errorHandler(h,errorData)
    }
    const data = await shiftUsecase.create(body);
    const res: ISuccessResponse = {
      statusCode: 200,
      message: "Create shift successful",
      results: data,
    };
    if(data===undefined){
      let errorData={
        status: 300,
        error:"start time / end time Clash",
        message:"Cannot create shift, clash with other shift"   
      }
      logger.error(errorData.message)
      return errorHandler(h,errorData)
    }else{
      return res
    }
  } catch (error) {
    logger.error(error.message)
    return errorHandler(h, error);
  }
};

export const updateById = async (req: Request, h: ResponseToolkit) => {
  logger.info("Update shift by id");
  try {
    const id = req.params.id;
    const body = req.payload as IUpdateShift;
    
    let checkpublish = await checkPublishOrNot(body, h)
    if(checkpublish.length>0){
      let errorData={
        status: 300,
        error:"shift has been published",
        message:"Cannot update shift, shift has been published"   
      }
      logger.error(errorData.message)
      return errorHandler(h,errorData)
    }
    const data = await shiftUsecase.updateById(id, body);
    const res: ISuccessResponse = {
      statusCode: 200,
      message: "Update shift successful",
      results: data,
    };
    if(data===undefined){
      let errorData={
        status: 300,
        error:"start time / end time Clash",
        message:"Cannot create shift, clash with other shift"   
      }
      logger.error(errorData.message)
      return errorHandler(h,errorData)
    }else{
      return res
    }    
  } catch (error) {
    logger.error(error.message)
    return errorHandler(h, error);
  }
};

export const deleteById = async (req: Request, h: ResponseToolkit) => {
  logger.info("Delete shift by id");
  try {
    const id = req.params.id;
    const startDate = req.query.startDate
    const endDate = req.query.endDate

    const filter ={where:{startDate:`${startDate}`, endDate:`${endDate}`}} 
    const checkpublish = await publishUsecase.find(filter)
    if(checkpublish.length>0){
      let errorData={
        status: 300,
        error:"shift has been published",
        message:"Cannot delete shift, shift has been published"   
      }
      logger.error(errorData.message)
      return errorHandler(h,errorData)
    }
    const data = await shiftUsecase.deleteById(id);
    const res: ISuccessResponse = {
      statusCode: 200,
      message: "Delete shift successful",
      results: data,
    };
    return res;
  } catch (error) {
    logger.error(error.message)
    return errorHandler(h, error);
  }
};

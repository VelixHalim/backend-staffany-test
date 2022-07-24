import {
  getRepository,
  FindManyOptions,
  FindOneOptions,
  FindConditions,
  DeleteResult,
  MoreThanOrEqual,
  Raw,
  Between,
  createQueryBuilder,
  LessThanOrEqual,
  Equal,
} from "typeorm";
import moduleLogger from "../../../shared/functions/logger";
import Shift from "../entity/shift";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { format } from "date-fns";
import moment from "moment";
import { array } from "joi";

const logger = moduleLogger("shiftRepository");

export const find = async (opts?: FindManyOptions<Shift>): Promise<Shift[]> => {
  logger.info("Find");
  const repository = getRepository(Shift);
  let dates = opts.order[0]
  let starttime = opts.order[1]
  console.log(opts)
  let startdate = opts.cache[0]
  let enddate = opts.cache[1]
  const data = await repository.find({ date:Raw((alias)=>`${alias} >= '${startdate}' and ${alias} <= '${enddate}' order by ${alias} ${dates}, "startTime" ${starttime}`)});
  return data;
};

export const findById = async (
  id: string,
  opts?: FindOneOptions<Shift>
): Promise<Shift> => {
  logger.info("Find by id");
  const repository = getRepository(Shift);
  const data = await repository.findOne(id, opts);
  return data;
};

export const findOne = async (
  where?: FindConditions<Shift>,
  opts?: FindOneOptions<Shift>
): Promise<Shift> => {
  logger.info("Find one");
  const repository = getRepository(Shift);
  const data = await repository.findOne(where, opts);
  return data;
};

export const create = async (payload: Shift): Promise<Shift> => {
  logger.info("Create");
  const repository = getRepository(Shift);
  let convertdate =moment(payload.date).format("YYYY-MM-DD")
  
  const check = await repository.find({date:`${convertdate}`,startTime:Raw((alias)=>`((${alias} > '${payload.startTime}' and ${alias} <= '${payload.endTime}') or ("endTime" >= '${payload.startTime}' and "endTime" < '${payload.endTime}') or(${alias} <= '${payload.startTime}' and "endTime" >= '${payload.endTime}'))`)})
  if(check.length>0){
    return 
  }
  const newdata = await repository.save(payload);

  return newdata;
};

export const updateById = async (
  id: string,
  payload: QueryDeepPartialEntity<Shift>
): Promise<Shift> => {
  logger.info("Update by id");
  const repository = getRepository(Shift);
  //change name with same all data
  const checkname = await repository.find({id:`${id}`,startTime:Equal(`${payload.startTime}`),endTime:Equal(`${payload.endTime}`)})
  if(checkname.length==1){
    await repository.update(id, payload);
    return findById(id);
  }
  let convertdate = moment(`${payload.date}`).format('YYYY-MM-DD')

  //check there no clash
  const check = await repository.find({date:`${convertdate}`,startTime:Raw((alias)=>`((${alias} > '${payload.startTime}' and ${alias} <= '${payload.endTime}') or ("endTime" >= '${payload.startTime}' and "endTime" < '${payload.endTime}') or(${alias} <= '${payload.startTime}' and "endTime" >= '${payload.endTime}'))`)})
  if(check.length>1){
    return
  }else{
    await repository.update(id, payload);
    return findById(id);
  }
};

export const deleteById = async (
  id: string | string[]
): Promise<DeleteResult> => {
  logger.info("Delete by id");
  const repository = getRepository(Shift);
  return await repository.delete(id);
};

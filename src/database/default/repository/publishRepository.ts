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
  import Publish from "../entity/publish";
  
  import moment from "moment";
  
  const logger = moduleLogger("shiftRepository");
  
  export const find = async (opts?: FindManyOptions<Publish>): Promise<Publish[]> => {
    logger.info("Find");
    const repository = getRepository(Publish);
    const data = await repository.find(opts);
    return data;
  };
  
  export const create = async (payload: Publish): Promise<Publish> => {
    logger.info("Create");
    const repository = getRepository(Publish);
    console.log(payload)

    const newdata = await repository.save(payload);
  
    return newdata;
  };
  
import * as publishRepository from "../database/default/repository/publishRepository";
import { FindManyOptions, FindOneOptions } from "typeorm";
import Publish from "../database/default/entity/publish";
import { ICreatePublish } from "../shared/interfaces";

export const find = async (opts: FindManyOptions<Publish>): Promise<Publish[]> => {
  return publishRepository.find(opts);
};

export const create = async (payload: ICreatePublish): Promise<Publish> => {
  const publish= new Publish();
  publish.startDate = payload.startDate;
  publish.endDate = payload.endDate;
  publish.isPublish = payload.isPublish;

  return publishRepository.create(publish);
};

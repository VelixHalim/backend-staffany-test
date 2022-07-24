import { Request, ResponseToolkit } from "@hapi/hapi";
import * as publishUsecase from "../../../usecases/publishUsecase";
import { errorHandler } from "../../../shared/functions/error";
import {
  ICreatePublish,
  ISuccessResponse
} from "../../../shared/interfaces";
import moduleLogger from "../../../shared/functions/logger";

const logger = moduleLogger("publishController");

export const find = async (req: Request, h: ResponseToolkit) => {
  logger.info("Find isPublish");
  try {
    const filter = req.query;
    console.log(filter)
    const data = await publishUsecase.find(filter);
    const res: ISuccessResponse = {
      statusCode: 200,
      message: "Get publish successful",
      results: data,
    };
    return res;
  } catch (error) {
    logger.error(error.message)
    return errorHandler(h, error);
  }
};

export const create = async (req: Request, h: ResponseToolkit) => {
  logger.info("Create publish");
  try {
    const body = req.payload as ICreatePublish;
    const data = await publishUsecase.create(body);
    const res: ISuccessResponse = {
      statusCode: 200,
      message: "publish successful",
      results: data,
    };
    return res
  } catch (error) {
    logger.error(error.message)
    return errorHandler(h, error);
  }
};

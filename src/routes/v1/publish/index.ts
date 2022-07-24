import { Server } from '@hapi/hapi';
import * as publishController from './publishController';
import { createPublishDto } from '../../../shared/dtos';

//get publish data
export default function (server: Server, basePath: string) {
  server.route({
    method: "GET",
    path: basePath,
    handler: publishController.find,
    options: {
      description: 'Get publish with filter',
      notes: 'Get ispublish or not.',
      tags: ['api', 'publish']
    }
  });
  
  // post publish data
  server.route({
    method: "POST",
    path: basePath,
    handler: publishController.create,
    options: {
      description: 'Create Publish',
      notes: 'Create Publish',
      tags: ['api', 'publish'],
      validate: {
        payload: createPublishDto
      },
    }
  });

}
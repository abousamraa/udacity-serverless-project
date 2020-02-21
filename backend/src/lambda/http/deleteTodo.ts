import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { ItemAccess } from '../../dataAccess/accessLayer'
import { createLogger } from '../../utils/logger'


const todoAccess = new ItemAccess()

const logger = createLogger('deleteItem')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  logger.info('deleted todo id', {'todo': todoId})
  
  await todoAccess.deleteItem(todoId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: ''
  }

}


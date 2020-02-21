import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'

import 'source-map-support/register'

import { ItemAccess } from '../../dataAccess/accessLayer'
import { createLogger } from '../../utils/logger'

const logger = createLogger('updateToDo')

const todoAccess = new ItemAccess()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  const validTodoId = await todoAccess.isItemExists(todoId)  
  if (!validTodoId){
    logger.error('not valid', {'validTodoId': todoId})
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: 'Todo item does not exist'
    }
  }
  
  await todoAccess.updateItem(todoId, updatedTodo)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: ''
  }
}


import * as uuid from 'uuid'
import { TodoItem } from '../models/TodoItem'
import { parseUserId } from '../auth/utils'
import { ItemAccess } from '../dataAccess/accessLayer'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'

const itemAccess = new ItemAccess()

export async function createTodoItem(
  newTodoItem: CreateTodoRequest,
  authorization: string
): Promise<TodoItem> {
  
  const newItemId = uuid.v4()
  var userId = 'none'

  const split = authorization.split(' ')
  if (split.length > 1){
    const jwtToken = split[1]
    userId = parseUserId(jwtToken)
  }
  
  

  const item: TodoItem = {
    todoId: newItemId,
    userId: userId,
    createdAt: new Date().toISOString(),
    done: false,
    ...newTodoItem
  }
  
  return await itemAccess.createItem(item)
  

}

export async function getAllTodosLogic(
  authorization: string
): Promise<TodoItem[]>{
  
  var userId = 'none'  
  const split = authorization.split(' ')
  if (split.length > 1){
    const jwtToken = split[1]
    userId = parseUserId(jwtToken)
  }

   const items = await itemAccess.getAllItems(userId)
   
   return items

}

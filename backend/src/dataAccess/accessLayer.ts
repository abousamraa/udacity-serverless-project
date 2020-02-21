import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const XAWS = AWSXRay.captureAWS(AWS)

import { TodoItem } from '../models/TodoItem'

export class ItemAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly tableName = process.env.TODOS_TABLE,
    private readonly indexName = process.env.TODOS_USR_INDX
    ) {
  }

  
  async getAllItems(userId: string): Promise<TodoItem[]> {

    const result = await this.docClient.query({
      TableName : this.tableName,
      IndexName : this.indexName,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
          ':userId': userId
      }
    }).promise()
    const todoItems = result.Items

    return todoItems as TodoItem[]

  }

  
  async createItem(item: TodoItem): Promise<TodoItem> {
    await this.docClient.put({
      TableName: this.tableName,
      Item: item
    }).promise()

    return item
  }
  

  async isItemExists (itemId: string){
    const result = await this.docClient.query({
      TableName : this.tableName,
      KeyConditionExpression: 'todoId = :todoId',
      ExpressionAttributeValues: {
          ':todoId': itemId
      }
    }).promise()
  
    return (result.Count >0)
  }
  
  async updateItem(itemId: string, updatedItem: UpdateTodoRequest): Promise<UpdateTodoRequest>{
    await this.docClient.update({
        TableName: this.tableName,
        Key:{
          "todoId": itemId
        },
        UpdateExpression: "set #nm = :todoName, dueDate = :dueDate, done = :done",
        ExpressionAttributeValues: {
          ":todoName": updatedItem.name,
          ':dueDate': updatedItem.dueDate,
          ":done": updatedItem.done   
        },
        ExpressionAttributeNames: {
          "#nm": "name"
        },
        ReturnValues: "UPDATED_NEW"
    }).promise()
  
    return updatedItem
  }

  async addAttachmentUrl(itemId: string, attachmentUrl: string){
    await this.docClient.update({
      TableName: this.tableName,
      Key:{
        "todoId": itemId
      },
      UpdateExpression: "set attachmentUrl = :attachmentUrl",
      ExpressionAttributeValues: {
          ":attachmentUrl": attachmentUrl
      },
      ReturnValues: "UPDATED_NEW"
    }).promise()
  }
  
  async deleteItem(itemId: string){
    await this.docClient.delete({
      TableName: this.tableName,
      Key:{
        "todoId": itemId
      }
    }).promise()
  }
  
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}



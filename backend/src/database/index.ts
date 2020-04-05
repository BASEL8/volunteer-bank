import { MongoClient } from 'mongodb'
import { Database, HelpRequest, User, Group } from '../lib/types'

const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/test?retryWrites=true&w=majority`;

export const connectDatabase = async (): Promise<Database> => {
  const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  const db = client.db(process.env.NODE_ENV === 'development' ? "test" : "main")
  return {
    helpRequests: db.collection<HelpRequest>('helpRequests'),
    users: db.collection<User>('users'),
    groups: db.collection<Group>('groups')
  }
}
import {Ottoman} from 'ottoman'
import {HiltonQuizApplication} from '../application'
const {RangeScan} = require('couchbase/dist/rangeScan')

export const clearDb = async (app: HiltonQuizApplication) => {
  const ottoman: Ottoman = await app.get('ottoman')
  await clearCollection(ottoman, 'Guest')
  await clearCollection(ottoman, 'Employee')
}

export const clearCollection = async (ottoman: Ottoman, collectionName: string) => {
  const collection = ottoman.cluster.bucket('default').scope('_default').collection(collectionName)
  const result = await collection.scan(new RangeScan())
  await Promise.all(
    result.map(item => collection.remove(item.id))
  )
}

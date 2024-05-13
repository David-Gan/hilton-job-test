import {Ottoman} from 'ottoman'
const {RangeScan} = require('couchbase/dist/rangeScan')

export const clearCollection = async (ottoman: Ottoman, collectionName: string) => {
  const collection = ottoman.cluster.bucket('default').scope('_default').collection(collectionName)
  const result = await collection.scan(new RangeScan())
  await Promise.all(
    result.map(item => collection.remove(item.id))
  )
}

import * as db from './db-schema.json'

export default Reflect.ownKeys(db).map(k => k.toString()).join(', ')

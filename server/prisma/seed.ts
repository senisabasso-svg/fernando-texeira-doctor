import 'dotenv/config'
import { ensureSeed } from '../src/seedRuntime.js'

ensureSeed()
  .then(() => {
    console.log('Seed OK')
    process.exit(0)
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })


import fs from 'fs';

export default defineEventHandler(async (event) => {
  return {
    api: JSON.parse(fs.readFileSync('lang/fr.json', 'utf8')),
  }
})

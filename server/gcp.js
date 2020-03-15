import {Storage} from '@google-cloud/storage'

const gcs = new Storage({
    projectId: 'proud-shoreline-246507',
    keyFilename: './server/8b75a0ce0c13.json'
})

const bucket = gcs.bucket('pickcel');

export default bucket
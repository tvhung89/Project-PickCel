import express from 'express'
import path from 'path'
import fs from 'fs'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compress from 'compression'
import helmet from 'helmet'
import cors from 'cors'
import multer from 'multer'

import config from '../config/config'
import moment from 'moment'
import 'moment-timezone'

moment.tz.setDefault(config.timezone)
import bucket from './gcp'

import userRoute from './routes/user.routes'
import registerRoute from './routes/register.routes'
import registerServerRoute from './routes/registerServer.routes'
import displayRoute from './routes/display.routes'
import tagRoute from './routes/tag.routes'
import assetRoute from './routes/asset.routes'
import compositionRoute from './routes/composition.routes'
import scheduleRoute from './routes/schedule.routes'
import scheduleCompositionRoute from './routes/scheduleComposition.routes'
import templateRoute from './routes/template.routes'
import zoneAssetRoute from './routes/zoneAsset.routes'
import appRoutes from './routes/app.routes'
import previewRoutes from './routes/preview.routes'
import generalRoutes from './routes/general.routes'
import settingRoutes from './routes/setting.routes'
import logsRoutes from './routes/logs.routes'

import userService from './services/user'

//comment out before building for production
import devBundle from './devBundle'

const CURRENT_WORKING_DIR = process.cwd()
const {getVideoDurationInSeconds} = require('get-video-duration')
const app = express()

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, path.join(CURRENT_WORKING_DIR, '/uploads'))
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + '.' + file.originalname.split('.')[1])
    }
})

const upload = multer({storage: storage}).array('assets', 12);

//comment out before building for production
devBundle.compile(app)

app.set('view engine', 'ejs')

// parse body params and attache them to req.body
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())
app.use(compress())
// secure apps by setting various HTTP headers
app.use(helmet())
// enable CORS - Cross Origin Resource Sharing
app.use(cors())

app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR, 'dist')))

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Headers", "*");
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    next();
})

const apiMiddleware = (req, res, next) => {
    const contentType = req.headers['content-type']
    const method = req.method !== 'GET'
    if (method && (!contentType || contentType.indexOf('application/json') !== 0)) {
        return res.sendStatus(400)
    }

    next()
}

const authenticationMiddleware = (req, res, next) => {
    const token = req.cookies[config.access_token_key]
    const xSiteKey = req.cookies[config.x_site_token_key]

    if (token && xSiteKey) {
        userService.verifyToken({
            email: xSiteKey
        }, token, true).then(() => {
            next()
        }).catch(() => {
            return res.sendStatus(400)
        })
    } else return res.sendStatus(400)
}

const registerAuthenticationMiddleware = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'];

    if (token) {
        if (token.startsWith('Bearer ')) {
            // Remove Bearer from string
            token = token.slice(7, token.length);
        }

        const jwt = require('jsonwebtoken');
        jwt.verify(token, config.secret, function (err, decoded) {
            if (err) {
                return res.sendStatus(400)
            } else {
                if (decoded.access_token_key === config.access_token_key) {
                    next();
                } else {
                    return res.sendStatus(400)
                }
            }
        });
    } else {
        return res.sendStatus(400)
    }
}

app.use(config.api_address, registerRoute)
app.use(config.api_address, registerAuthenticationMiddleware, registerServerRoute)
app.use(config.api_address, registerAuthenticationMiddleware, generalRoutes)

// mount routes
app.use('/api/user', apiMiddleware, userRoute)
app.use('/api/display', [apiMiddleware, authenticationMiddleware], displayRoute)
app.use('/api/tag', [apiMiddleware, authenticationMiddleware], tagRoute)
app.use('/api/asset', [apiMiddleware, authenticationMiddleware], assetRoute)
app.use('/api/composition', [apiMiddleware, authenticationMiddleware], compositionRoute)
app.use('/api/schedule', [apiMiddleware, authenticationMiddleware], scheduleRoute)
app.use('/api/schedule-composition', [apiMiddleware, authenticationMiddleware], scheduleCompositionRoute)
app.use('/api/template', [apiMiddleware, authenticationMiddleware], templateRoute)
app.use('/api/zone-asset', [apiMiddleware, authenticationMiddleware], zoneAssetRoute)
app.use('/api/app', [apiMiddleware, authenticationMiddleware], appRoutes)
app.use('/api/logs', [apiMiddleware, authenticationMiddleware], logsRoutes)
app.use('/api/setting', [apiMiddleware, authenticationMiddleware], settingRoutes)
app.use('/preview', [apiMiddleware, authenticationMiddleware], previewRoutes)

import assetService from './services/assets'

app.post('/api/upload', function (req, res) {
    upload(req, res, function (err) {
        try {
            let fileInfo = req.files
            let type_media = 0
            const regPatternImage = new RegExp('image\/')
            const regPatternVideo = new RegExp('video\/')

            if (fileInfo && fileInfo.length > 0) {
                fileInfo = fileInfo[0]
                if (regPatternImage.test(fileInfo.mimetype)) {  
                    type_media = 0
                    var sizeOf = require('image-size');
                    var dimensions = sizeOf(fileInfo.path);

                    let asset = {
                        name: `${fileInfo.originalname.split('.')[0]}`,
                        type: type_media,
                        size: parseInt(fileInfo.size),
                        dimension: `${dimensions.width}*${dimensions.height}`,
                        content: `${config.mediaUrl}/${fileInfo.filename}`,
                        user_id: req.body.user_id,
                    }

                    assetService.addAsset(asset).then(response => {
                        return res.json(response)
                    }).catch(e => res.json(e))
                } else {
                    if (regPatternVideo.test(fileInfo.mimetype)) {
                        type_media = 1
                        const stream = fs.createReadStream(fileInfo.path)

                        Promise.resolve(getVideoDurationInSeconds(stream)).then(media_duration => {
                            let asset = {
                                name: `${fileInfo.originalname.split('.')[0]}`,
                                type: type_media,
                                size: parseInt(fileInfo.size),
                                content: `${config.mediaUrl}/${fileInfo.filename}`,
                                user_id: req.body.user_id,
                                duration: parseInt(media_duration, 10)
                            }

                            assetService.addAsset(asset).then(response => {
                                return res.json(response)
                            }).catch(e => res.json(e))
                        })
                    }
                }
            } else {
                return res.json({
                    success: false,
                    error: "Something wrong!"
                })
            }
        } catch (e) {
            return res.json({
                success: false,
                error: "Can't upload assets!"
            });
        }
    });
});

app.get('*', (req, res) => {
    res.status(200).sendFile(path.join(CURRENT_WORKING_DIR, 'client/index.html'));
})

export default app
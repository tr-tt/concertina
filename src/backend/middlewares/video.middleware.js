import {httpCodes} from '../defines/constants.js'
import {resolve} from 'node:path'
import fsp from 'node:fs/promises'
import log from '../winston/winston.configuration.js'

const checkUrl = (request, response, next) =>
{
    if(
        !request.url.startsWith('/api/video') ||
        !request.query.video ||
        !request.query.video.match(/^[a-z0-9-_]+\.(mp4|mov)$/i) ||
        !request.headers.range
    )
    {
        return response
            .status(httpCodes.BAD_REQUEST)
            .json({message: 'BAD REQUEST'})
    }
    else
    {
        return next()
    }
}

const getVideoStat = async (request, response, next) =>
{
    request._video_path = resolve('videos', request.query.video)

    try
    {
        request._video_stat = await fsp.stat(request._video_path)

        return next()
    }
    catch(exception)
    {
        log.error(exception.message, {file: 'video.middleware.js', function: 'getVideoStat'})

        return response
            .status(httpCodes.NOT_FOUND)
            .json({message: `Video ${request.query.video} not found`})
    }
}

export {checkUrl, getVideoStat}
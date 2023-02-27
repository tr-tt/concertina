import {extname} from 'node:path'
import fs from 'node:fs'

const getApiVideo = (request, response) =>
{
    const _video_extention = extname(request._video_path).replace('.', '')
    const _range = request.headers.range
    const _parts = _range.replace('bytes=', '').split('-')
    const _start = parseInt(_parts[0], 10)
    const _end = _parts[1] ? parseInt(_parts[1], 10) : request._video_stat.size - 1
    const header =
    {
        'Content-Type': `video/${_video_extention}`,
        'Content-Range': `bytes ${_start}-${_end}/${request._video_stat.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': _end - _start + 1
    }
    const file = fs.createReadStream(request._video_path, {start: _start, end: _end})

    response.writeHead(206, header)
    
    file.pipe(response)
}

export {getApiVideo}
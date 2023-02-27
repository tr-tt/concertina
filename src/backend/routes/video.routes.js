import {checkUrl, getVideoStat} from '../middlewares/video.middleware.js'
import {getApiVideo} from '../controllers/video.controller.js'


const routes = (app) =>
{
    app.get(
        '/api/video',
        [
            checkUrl,
            getVideoStat
        ],
        getApiVideo
    )
}

export default routes
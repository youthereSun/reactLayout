import Request from './index'

export function getChartByType(callback) {
    return  Request.post({
        url: '/handler/biHandler/echartGroup',
        callback
    });
}

export function viewChartById (data, callback) {
    return  Request.post({
        url: '/handler/biHandler/echartGet',
        data,
        callback
    });
}

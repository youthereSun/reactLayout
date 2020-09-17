import axios from 'axios'
import { BASE_URL } from './base.url';


axios.defaults.timeout = 500000;
axios.defaults.baseURL = BASE_URL;

class Request {

    send= function (options) {
        axios(options)
            .then(response => {
                options.callback({
                    type: "success",
                    message: '请求成功',
                    data: response.data
                })
            })
            .catch(error => {
                options.callback({
                    type: "error",
                    message: '请求数据发生错误'
                })

            });
    }

    get= function (config) {
        return this.send(
            Object.assign({}, config, { method:'GET' })
        );
    }

    post= function (config) {
        return this.send(
            Object.assign({}, config, { method:'POST' })
        );
    }


    put = function(config) {
        this.config = config;
        return this.send(
            Object.assign({}, config, { method: "PUT" })
        );
    };
}

export default new Request();






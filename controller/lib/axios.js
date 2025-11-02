const axios = require("axios");
const MY_TOKEN = "8570831257:AAE6ib6FIbbHXk71Km6pfq1-k7e1H1PFcDI"

const BASE_URL = `https://api.telegram.org/bot${MY_TOKEN}`

function getAxiosInstance(){
    return{
        get(method, params){
            return axios.get(`/${method}`, {
                baseURL: BASE_URL,
                params,
            });
        },
        post(method, data){
            return axios({
                method: "post",
                baseURL: BASE_URL,
                url: `/${method}`,
                data,
            });
        },
    };
}

module.exports = { axiosInstance: getAxiosInstance()}
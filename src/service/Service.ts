import * as fs from "fs";
import axios from "axios";

export class Service {

    baseConfig: BaseConfigSchema = {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json"
        },
        "data": {},
        "requestUrl": "http://192.168.8.188:8088/whms/ajax/",
        "baseUrl": "http://192.168.8.188:8088/",
        "projectUrl": "http://192.168.8.188:8088/whms/workhour/list/"
    };

    constructor(config: BaseConfigSchema) {
        this.baseConfig = config;
    }

    async saveToLocal(path: string, fileName: string, data: Object): Promise<any | void>  {

        return new Promise(async (resolve, reject) => {
            try {
                if (!fs.existsSync(path))
                    await fs.mkdirSync(path, { recursive: true });
                    

                await fs.writeFileSync(path + fileName, JSON.stringify(data, null, 4), {encoding: 'utf8'});
                resolve('Write file successfully!');
            } catch (error) {
                reject(error);
            }
        });

    }

    async get(method: string, data: any): Promise<any> {
        console.log(this.baseConfig)
        const res = await axios.get(this.baseConfig.requestUrl + method, {
            headers: {'Content-Type': 'application/json', },
            data: data
        });

        return res.data;
    }

    async post(method: string, data: any): Promise<any> {
        const res = await axios.post(this.baseConfig.requestUrl + method, JSON.stringify(data), {
            headers: {'Content-Type': 'application/json',}, 
        });

        return res;
    }

    mfind(list: any[], callback: Function): any {
        if (!list.length) return undefined;

        return list.find(element => callback(element));
    }
}
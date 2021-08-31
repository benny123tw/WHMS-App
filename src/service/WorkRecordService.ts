import {Service} from "./Service";

export class WorkRecordService extends Service {

    private section: string[] = [
        "00:00~01:00", "01:00~02:00", "02:00~03:00", "03:00~04:00", "04:00~05:00",
        "05:00~06:00", "06:00~07:00", "07:00~08:00", "08:00~09:00", "09:00~10:00",
        "10:00~11:00", "11:00~12:00", "13:30~14:30", "14:30~15:30",
        "15:30~16:30", "16:30~17:30", "17:30~18:30", "19:00~20:00",
        "20:00~21:00", "21:00~22:00", "22:00~23:00", "23:00~24:00"
    ];

    constructor(config: BaseConfigSchema) {
        super(config);
    }

    generateWorkReocrd(mWorkRecord: LilWorkRecord): WorkRecord[] {
        return this.allDayWorkRecord(mWorkRecord);
    }

    async addWorkRecord(workRecordList: WorkRecord[]) {
        if (workRecordList.length !== 22) 
            throw new Error(`Wrong work hour list length: ${workRecordList.length}`);

        await this.save(workRecordList);
    }

    async getWorkRecord(workRecordEmployeeId: number, workRecordCreateDate: Date) {
        const data = await super.get('getWorkRecord', {"workRecordEmployeeId":workRecordEmployeeId,"workRecordCreateDate":workRecordCreateDate.getTime()})
        
        const filename = workRecordCreateDate.getDate() + 
                        '-' + workRecordCreateDate.getMonth() + 
                        '-' + workRecordCreateDate.getFullYear() +
                        '.json';

        const writeRes = await super.saveToLocal(`${process.cwd()}/data/Employee/`, filename, data);
        console.log(writeRes);

        return data;
    }

    async save(workRecordList: WorkRecord[]) {
        const {id} = workRecordList[0].employee;
        const {createDate} = workRecordList[0];

        const workRecordCreateDate = new Date(createDate);

        const filename = workRecordCreateDate.getFullYear() + 
                        '-' + (workRecordCreateDate.getMonth()+1) + 
                        '-' + workRecordCreateDate.getDate() +
                        '.json';

        await super.saveToLocal(`${process.cwd()}/data/Employee/${id}/`, filename, workRecordList);    
        
        const postData = {
            workRecordList: workRecordList
        }
        const res = await this.post('addWorkRecord', postData);
        console.log(filename + ' :  '+ 'Status: ' + res.status);
    }

    private allDayWorkRecord(mWorkRecord: LilWorkRecord): WorkRecord[] {
        let serial = 1;
        const workRecordList: WorkRecord[] = [];

        for (let i=0; i<this.section.length; i++) {
            const workRecord: WorkRecord = {
                employee: mWorkRecord.employee,
                createDate: mWorkRecord.createDate,
                serial: serial++,
                section: this.section[i],
                projectId: '',
                content: '',
            }
            if (i <= 16 && i >= 9) {
                workRecord.projectId = mWorkRecord.projectId;
                workRecord.content = mWorkRecord.content;
            }
            
            workRecordList.push(workRecord);
        }

        return workRecordList;
    }
}
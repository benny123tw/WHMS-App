import {Service} from "./Service";

export class ProjectService extends Service {

    private projects: Project[] = [];
    
    constructor(config: BaseConfigSchema) {
        super(config);
        this.getProjects();
    }

    async getProjects() {
        const data = await super.get('getProjects', {});

        // const writeRes = await super.saveToLocal(`${process.cwd()}/data/`, 'projects.json', data);
        // console.log(writeRes);

        return data;
    }

    async getAvalibleProjects() {
        const data = await super.get('getAvalibleProjects', {});

        const writeRes = await super.saveToLocal(`${process.cwd()}/data/`, 'avalibleProject.json', data);
        console.log(writeRes);
        
        return data;
    }

    find(callback: Function) {
        super.mfind(this.projects, callback);
        if (!this.projects.length) return undefined;

        return this.projects.find(project => callback(project))
    }

}
import {Service} from "./Service";

export class EmployeeService extends Service {

    private employees: Employee[] = [];

    constructor(config: BaseConfigSchema) {
        super(config);
        this.getEmployees();
    }

    async getEmployees(): Promise<Employee[]> {
        const data = await this.get('getEmployees', {employeeShowDisabled: false});
        
        const sortList: Array<Employee> = data;
        sortList.sort((a,b) => a.id - b.id);

        // await this.saveToLocal(`${process.cwd()}/data/`, 'employees.json', sortList);
        this.employees = sortList;

        return sortList;
    }

    async addEmployee(employee: Employee) {
        // addEmployee
    }

    find(callback: Function) {
        super.mfind(this.employees, callback);
        
        if (!this.employees.length) return undefined;

        return this.employees.find(employee => callback(employee));
    }

}
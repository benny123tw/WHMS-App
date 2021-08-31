export interface ConfigSchema {
    employeeAccount: string;
    projectCode: string;
    content: string;
    dateStart: string;
    dateEnd: string;
    passHoliday: boolean;
    exclude?: string[];
}
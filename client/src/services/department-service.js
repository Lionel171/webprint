import HttpService from "./htttp.service";

class DepartmentService {
    // authEndpoint = process.env.API_URL;
    addDepartment = async (payload) => {
        const addDepartmentEndpoint = `api/department/add`;
        return await HttpService.post(addDepartmentEndpoint, payload);
    }
    getDepartments = async () => {
        const getDepartmentsEndpoint = `api/department`;
        return await HttpService.get(getDepartmentsEndpoint);
    }

    deleteDepartment = async (id) => {
        const deleteDepartmentEndpoint = `api/department/${id}`;
        return await HttpService.delete(deleteDepartmentEndpoint);
    } 
    editDepartment = async (payload) =>{
        const editDepartmentEndpoint = `api/department`;
        return await HttpService.put(editDepartmentEndpoint, payload);

    } 
}

export default new DepartmentService();
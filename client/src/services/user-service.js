import HttpService from "./htttp.service";

class UserService {
    // authEndpoint = process.env.API_URL;

    getUserList = async () => {
        const getUserListEndpoint = 'api/users/list';
        return await HttpService.get(getUserListEndpoint);
    };

    getUser = async () => {
        const getCurrentUserEndpoint = 'api/users/current';
        return await HttpService.get(getCurrentUserEndpoint);
    };

    pendingUser = async () => {
        const getPendingUsersEndpoint = 'api/users/pending';
        return await HttpService.get(getPendingUsersEndpoint);
    }

    permitUser = async (payload) => {
        const getCurrentUserEndpoint = 'api/users/permitUser';
        return await HttpService.post(getCurrentUserEndpoint, payload);
    };

    getCustomerList = async () => {
        const getCustomerListEndpoint = 'api/users/customerList';
        return await HttpService.get(getCustomerListEndpoint);
    }

    getUserById = async (id) => {
        const getCustomerListEndpoint = `api/users/${id}/user`;
        return await HttpService.get(getCustomerListEndpoint);
    }

    updateUser = async (payload) => {

        const getCustomerListEndpoint = `api/users`;
        return await HttpService.put(getCustomerListEndpoint, payload);
    }
    deleteUser = async (user_id) => {
        const deleteUserEndpoint = `api/users/${user_id}`;
        return await HttpService.delete(deleteUserEndpoint);
    }
    //Home
    //Today's Customers
    getTodayCustomers = async () => {
        const getTodayCustomersEndpoint = 'api/users/today';
        return await HttpService.get(getTodayCustomersEndpoint);
    }
    //Week Customers
    getWeekCustomers = async () => {
        const getWeekCustomersEndpoint = 'api/users/last-week';
        return await HttpService.get(getWeekCustomersEndpoint);
    }

    // get staffs by id
    getStaffsById = async (payload) => {
        const getStaffsByIdEndpoint = "api/users/staff-by-id";
        return await HttpService.getWithParams(getStaffsByIdEndpoint, payload)
    }

    // get staff by service
    getStaffByService = async (payload) => {
        const getStaffByServiceEndpoint = 'api/users/staff-service';
        return await HttpService.post(getStaffByServiceEndpoint, payload)
    }
    //Email
    sendEmail = async (payload) => {
        const sendEmailToClients = `api/users/sendEmail`;
        return await HttpService.post(sendEmailToClients, payload);
    }
}

export default new UserService();
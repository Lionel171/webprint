import htttpService from "./htttp.service";
import HttpService from "./htttp.service";

class OrderService {
  // authEndpoint = process.env.API_URL;
  getOrders = async () => {
    const getOrdersEndpoint = `api/orders/total`;
    return await HttpService.get(getOrdersEndpoint);
  };


  getOrderList = async (payload) => {
    const getUserListEndpoint = `api/orders/list`;
    return await HttpService.getWithParams(getUserListEndpoint, payload);
  };

  getOrderListByUserId = async (payload, user_id) => {
    const getCurrentUserEndpoint = `api/orders/current/${user_id}`;
    return await HttpService.get(getCurrentUserEndpoint, payload);
  };

  getOderListByApprove = async (payload) => {
    const getUserListEndpoint = 'api/orders/approve';
    return await HttpService.getWithParams(getUserListEndpoint, payload)
  }
  getOderListByComplete = async (payload) => {
    const getUserListEndpoint = 'api/orders/complete';
    return await HttpService.getWithParams(getUserListEndpoint, payload)
  }

  saveOrder = async (payload) => {
    const getCurrentUserEndpoint = "api/orders/save-order";
    return await HttpService.post(getCurrentUserEndpoint, payload);
  };

  saveOrderPrice = async (payload) => {
    const getCurrentUserEndpoint = "api/orders/save-order-price";
    return await HttpService.post(getCurrentUserEndpoint, payload);
  };

  getOrderDetailList = async (order_id) => {
    const getOrderDetailListEndpoint = `api/order-details/list?order_id=${order_id}`;
    return await HttpService.get(getOrderDetailListEndpoint);
  };

  getOrderById = async (order_id) => {
    const getOrderEndpoint = `api/orders?order_id=${order_id}`;
    return await HttpService.get(getOrderEndpoint);
  };

  updateStatus = async (payload) => {
    const getOrderEndpoint = `api/orders/update-status`;
    return await HttpService.put(getOrderEndpoint, payload);
  };

  deleteOrder = async (order_id) => {
    const deleteOrderEndpoint = `api/orders/${order_id}`;
    return await HttpService.delete(deleteOrderEndpoint);
  };

  //Home 
  getTodayOrders = async () => {
    const getTodayOrdersEndpoint = `api/orders/today`;
    return await HttpService.get(getTodayOrdersEndpoint);
  }
  getMonthlyOrders = async () => {
    const ggetMonthlyOrdersEndpoint = `api/orders/monthly`;
    return await HttpService.get(ggetMonthlyOrdersEndpoint);
  }

  getTodayMoney = async () => {
    const getTodayMoneyEndpoint = `api/orders/today/price`;
    return await HttpService.get(getTodayMoneyEndpoint);
  }
  getTotalMoney = async () => {
    const getTotalMoneyEndpoint = `api/orders/totalprice`;
    return await HttpService.get(getTotalMoneyEndpoint);
  }

  getMonthlyMoney = async () => {
    const getMonthlyMoneyEndpoint = `api/orders/monthly/price`;
    return await HttpService.get(getMonthlyMoneyEndpoint);
  }

  //invoice email

  sendInvoiceEmail = async (order_id) => {
    const sendInvoiceEmail = `api/orders/send-invoice-email?order_id=${order_id}`;
    return await HttpService.get(sendInvoiceEmail);
  };
}

export default new OrderService();
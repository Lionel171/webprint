import htttpService from "./htttp.service";
import HttpService from "./htttp.service";

class OrderService {
  // authEndpoint = process.env.API_URL;
  getOrders = async () => {
    const getOrdersEndpoint = `api/orders/total`;
    return await HttpService.get(getOrdersEndpoint);
  };


  getOrderList = async (payload) => {
    const getOrderListEndpoint = `api/orders/list`;
    return await HttpService.getWithParams(getOrderListEndpoint, payload);
  };
  getOrderInvoices = async (payload) => {
    const getOrderInvoicesEndpoint = 'api/orders/invoices';
    return await HttpService.getWithParams(getOrderInvoicesEndpoint, payload)
  }

  getOrderListByUserId = async (payload, user_id) => {
    const getCurrentUserEndpoint = `api/orders/current/${user_id}`;
    return await HttpService.getWithParams(getCurrentUserEndpoint, payload);
  };

  getOderListByApprove = async (payload) => {
    const getOderListByApproveEndpoint = 'api/orders/approve';
    return await HttpService.getWithParams(getOderListByApproveEndpoint, payload);
  }
  //get order list for artwork manager
  getOderListForArtManager = async (payload, user) => {
    const getOderListForArtManagerEndpoint = "api/orders/for-artmanager";
    return await HttpService.getWithParams(getOderListForArtManagerEndpoint, payload);
  }
  //get order list for artwork staff

  getOderListForArtStaff = async (payload, user_id) => {
    const getOderListForArtStaffEndpoint = `api/orders/artwork-dept/${user_id}`;
    return await HttpService.getWithParams(getOderListForArtStaffEndpoint, payload);
  }
  //get order list for production manager
  getOderListForProManager = async (payload) => {
    const getOderListForProManagerEndpoint = "api/orders/for-promanager";
    return await HttpService.getWithParams(getOderListForProManagerEndpoint, payload);
  }
  getOderListByPending = async (payload) => {
    const getOderListByPendingEndpoint = 'api/orders/pending';
    return await HttpService.getWithParams(getOderListByPendingEndpoint, payload);
  }
  getOderListForProStaff = async (payload, user_id) => {
    const getOderListByCompleteEndpoint = `api/orders/for-prostaff/${user_id}`;
    return await HttpService.getWithParams(getOderListByCompleteEndpoint, payload);
  }
  //complete order tab
  getCompleteOrderList = async (payload) => {
    const getCompleteOrderListEndpoint = 'api/orders/complete-order';
    return await HttpService.getWithParams(getCompleteOrderListEndpoint, payload);
  }
  getCompleteOrderListForCustomer = async (payload, user_id) => {
    const getCompleteOrderListForCustomerEndpoint = `api/orders/complete-order-customer/${user_id}`;
    return await HttpService.getWithParams(getCompleteOrderListForCustomerEndpoint, payload);
  }

  getPaidByUser = async (user_id) => {
    const getPaidByUserEndpoint = `api/orders/paid/${user_id}`;
    return await HttpService.get(getPaidByUserEndpoint);
  }
  saveOrder = async (payload) => {
    const saveOrderrEndpoint = "api/orders/save-order";
    return await HttpService.post(saveOrderrEndpoint, payload);
  };
  uploadFile = async (payload) => {
    const uploadFileEndpoint = "api/orders/file-upload";
    return await HttpService.post(uploadFileEndpoint, payload)
  }

  updateImage = async (payload) => {
    const updateImageEndpoint = "api/orders/img-update";
    return await HttpService.post(updateImageEndpoint, payload);
  };

  assignStaff = async (payload) => {
    const assignStaffEndpoint = "api/orders/assign-staff";
    return await HttpService.post(assignStaffEndpoint, payload);
  };
  releaseStaff = async (payload) => {
    const releaseStaffEndpoint = "api/orders/release-staff";
    return await HttpService.post(releaseStaffEndpoint, payload);
  };

  saveOrderPrice = async (payload) => {
    const saveOrderPriceEndpoint = "api/orders/save-order-price";
    return await HttpService.post(saveOrderPriceEndpoint, payload);
  };
  setHold = async (payload) => {
    const setholdEndpoint = "api/orders/hold";
    return await HttpService.post(setholdEndpoint, payload);
  }

  sendToCustomerMsg = async (payload) => {
    const sendToCustomerMsgEndpoint = "api/orders/customer-comment";
    return await HttpService.post(sendToCustomerMsgEndpoint, payload);
  }

  getMsg = async (id) => {
    const getMesEndpoint = `api/orders/get-message?user_id=${id}`;
    return await HttpService.get(getMesEndpoint);
  }

  isViewMsg = async (payload) => {
    const isViewMsgEndpoint = 'api/orders/isview-message';
    return await HttpService.post(isViewMsgEndpoint, payload);
  }
  getOrderDetailList = async (order_id) => {
    const getOrderDetailListEndpoint = `api/order-details/list?order_id=${order_id}`;
    return await HttpService.get(getOrderDetailListEndpoint);
  };

  getOrderById = async (order_id) => {
    const getOrderEndpoint = `api/orders?order_id=${order_id}`;
    return await HttpService.get(getOrderEndpoint);
  };

  updateOrder = async (payload) => {
    const updateOrderEndpoint = 'api/orders/update';
    return await HttpService.post(updateOrderEndpoint, payload)
  }

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
  staffLogon = async (payload) => {
    const staffLogonEndpoint = "api/orders/staff-logon";
    return await HttpService.post(staffLogonEndpoint, payload);
  }
  ApproveDesign = async (payload) => {
    const ApproveDesignEndpint = 'api/orders/approve-design';
    return await HttpService.post(ApproveDesignEndpint, payload);
  }


  //invoice email

  sendInvoiceEmail = async (order_id) => {
    const sendInvoiceEmail = `api/orders/send-invoice-email?order_id=${order_id}`;
    return await HttpService.get(sendInvoiceEmail);
  };
}

export default new OrderService();
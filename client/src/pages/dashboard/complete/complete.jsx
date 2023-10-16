
import Content from '@/pages/dashboard/orders/components/content';
import { useEffect, useState } from "react";
import OrderService from "@/services/order-service";
import UserService from "@/services/user-service";
import ConfirmModal from "@/components/common/comfirmModal";
import DepartmentService from "@/services/department-service"



export function Complete() {
  const [search, setSearch] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [filterItem, setFilterItem] = useState([]);
  const [isConfirm, setIsConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [orders, setOrders] = useState([]);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(1);
  const [loadingData, setLoadingData] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [user, setUser] = useState('');
  const [role, setRole] = useState('');
  const [isDelete, setIsDelete] = useState(false);
  const [isNextPage, setIsNextPage] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [deptId, setDeptId] = useState([]);

  const editItem = id => {
  };



  async function getCurrentUser() {

    const temp_departments = [{ id: 0, name: "" }];
    const res = await DepartmentService.getDepartments();

    res.department.forEach((dep, index) => {
      temp_departments[index + 1] = { id: index + 1, name: dep.name };
    });
    setDepartments(temp_departments);


    const response = await UserService.getUser();
    setUser(response.user)
    const temp_index = []
    response.user.department.map((dept, index) => {

      const temp_dept = temp_departments.find((dep) => dep.name === dept);
      temp_index.push(temp_dept.id);
    })

    setDeptId(temp_index);


  }

  useEffect(() => {
    setRole(localStorage.getItem('role'))
    getCurrentUser();

  }, [])

  const deleteComfirm = props => {
    setSelectedOrderId(props.id);
    setConfirmMessage("Once deleted this process can not be undone");
    setIsConfirm(true);
  };
  const setFilter = value => {
  };

  const handleClose = () => {
    setIsConfirm(false);
  }
  const controlAction = async () => {
    const response = await OrderService.deleteOrder(selectedOrderId);
    if (response.state) {
      if (isDelete) {
        setIsDelete(false);
      } else {
        setIsDelete(true);
      }

    }
    setIsConfirm(false);
  }
  const onPageChange = (page) => {
    setCurrentPage(page);
    setIsNextPage(isNextPage ? false : true)
  };
  const setSearchTxt = (value) => {
    setSearch(value);
    fetchData(value);
  }
  useEffect(() => {
    if (user._id !== undefined) {
      fetchData('');
    }
  }, [user._id]);

  useEffect(() => {
    if (user._id !== undefined) {
      fetchData('');
    }
  }, [isDelete, isNextPage]);
  async function fetchData(search) {
    const query = {
      page: currentPage - 1,
      perPage: perPage,
      search: search,
    };

    const noraml_query = {
      ...query,
      userId: user._id
    }
 

    if (localStorage.getItem('role').includes("admin") || localStorage.getItem('role').includes('Sales Manager')) {
      setLoadingData(true);
      const response = await OrderService.getCompleteOrderList(query);
      setOrders(response.docs);
      setTotalPages(response.totalPages);
      setTotal(response.totalDocs);
      setCurrentPage(response.page);
      setLoadingData(false);
    } else if (localStorage.getItem('role').includes("normal")) {
      setLoadingData(true);
      const response = await OrderService.getCompleteOrderListForCustomer(query, user._id);
      setOrders(response.docs);
      setTotalPages(response.totalPages);
      setTotal(response.totalDocs);
      setCurrentPage(response.page);
      setLoadingData(false);
    }
  }

  return (
    <div className=" flex flex-col gap-5">
      <div>
        {/* <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Users Table
          </Typography>
        </CardHeader> */}
        <div className="mt-5">
          <Content
            loadingData={loadingData}
            currentPage={currentPage}
            totalPages={totalPages}
            total={total}
            perPage={perPage}
            onPageChange={onPageChange}
            orders={orders}
            editFunction={editItem}
            deleteFunction={deleteComfirm}
            searchTxt={search}
            setSearchTxt={setSearchTxt}
            setFilter={setFilter}
            filterItems={filterItem}
            selectedFilter={filterValue}
          />
        </div>
      </div>
      <ConfirmModal
        open={isConfirm}
        deleteItem={controlAction}
        handleClose={handleClose}
        message={confirmMessage}
      />
    </div>
  );
}

export default Complete;


import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { authorsTableData, projectsTableData } from "@/data";
import ConfirmModal from "@/components/common/comfirmModal";
import Content from './components/content';
import { useEffect, useState } from "react";
import UserService from "@/services/user-service"

export function Customers() {
  const [searchTxt, setSearchTxt] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [filterItem, setFilterItem] = useState([]);
  const [users, setUsers] = useState([]);
  const [isDelete, setIsDelete] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [isConfirm, setIsConfirm] = useState(false);
  const editItem = id => {
  };

  const deleteComfirm = props => {
    setSelectedUserId(props.id);
    setConfirmMessage("Once deleted this process can not be undone");
    setIsConfirm(true);
  };
  const setFilter = value => {
  };
  const controlAction = async () => {
    const response = await UserService.deleteUser(selectedUserId);

    if (response.state) {
      if (isDelete) {
        setIsDelete(false);
      } else {
        setIsDelete(true);
      }
    }
    setIsConfirm(false);
  }
  const handleClose = () => {
    setIsConfirm(false);
  }

  useEffect(() => {
    async function fetchData() {
      const response = await UserService.getUserList();
      setUsers(response.entities);
    }
    fetchData();
  }, [isDelete])

  return (
    <div className=" flex flex-col gap-5">
      <div>
        {/* <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Users Table
          </Typography>
        </CardHeader> */}
        <div className='mt-5'>
          <Content
            users={users}
            editFunction={editItem}
            deleteFunction={deleteComfirm}
            searchTxt={searchTxt}
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

export default Customers;

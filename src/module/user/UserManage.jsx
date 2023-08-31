import DashboardHeading from "module/dashboard/DashboardHeading";
import React, { useEffect, useState } from "react";
import UserTable from "./UserTable";
import { Button } from "components/button";
import { debounce } from "lodash";
import { useAuth } from "contexts/auth-context";
import { userRole } from "utils/constants";

const UserManage = () => {
  const [filter, setFilter] = useState("");
  const handleInputFilter = debounce((e) => {
    setFilter(e.target.value);
  }, 500);

  useEffect(() => {
    document.title = "Mokey blogging - User";
  }, []);
  const { userInfo } = useAuth();
  if (Number(userInfo.role) !== userRole.ADMIN) return null;
  return (
    <div>
      <DashboardHeading
        title="Users"
        desc="Manage your user"
      ></DashboardHeading>
      <div className="flex flex-col justify-end mb-10">
        <input
          type="text"
          placeholder="Search username ..."
          className="px-5 py-4 mb-10 border border-gray-300 rounded-lg"
          onChange={handleInputFilter}
        />
        <Button kind="ghost" className="ml-auto" to="/manage/add-user">
          Add new user
        </Button>
      </div>
      <UserTable filter={filter}></UserTable>
    </div>
  );
};

export default UserManage;

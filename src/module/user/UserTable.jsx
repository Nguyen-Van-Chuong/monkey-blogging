import { ActionDelete, ActionEdit } from "components/action";
import { Button } from "components/button";
import { LabelStatus } from "components/label";
import { Table } from "components/table";
import { db } from "firebase-app/firebase-config";
import { deleteUser } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { userRole, userStatus } from "utils/constants";
const USER_PER_PAGE = 1;
const UserTable = ({ filter }) => {
  const [userList, setUserList] = useState([]);

  const [lastDoc, setlastDoc] = useState();
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    const colRef = collection(db, "users");
    onSnapshot(colRef, (snapshot) => {
      const result = [];
      snapshot.forEach((doc) => {
        result.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setUserList(result);
    });
  }, []);
  useEffect(() => {
    async function fetchData() {
      const colRef = collection(db, "users");
      const newRef = filter
        ? query(
            colRef,
            where("username", ">=", filter),
            where("username", "<=", filter + "utf8")
          )
        : query(colRef, limit(USER_PER_PAGE));

      const documentSnapshots = await getDocs(newRef);
      const lastVisible =
        documentSnapshots.docs[documentSnapshots.docs.length - 1];
      setlastDoc(lastVisible);
      onSnapshot(colRef, (snapshot) => {
        setTotal(snapshot.size);
      });
      onSnapshot(newRef, (snapshot) => {
        let results = [];

        snapshot.forEach((doc) => {
          results.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setUserList(results);
      });
    }
    fetchData();
  }, [filter]);
  const renderLabelStatus = (status) => {
    switch (status) {
      case userStatus.ACTIVE:
        return <LabelStatus type="success">Active</LabelStatus>;
        break;
      case userStatus.PENDING:
        return <LabelStatus type="warning">Pending</LabelStatus>;
        break;
      case userStatus.BAN:
        return <LabelStatus type="danger">Rejected</LabelStatus>;
        break;

      default:
        break;
    }
  };
  const handleDeleteUser = (user) => {
    const colRef = doc(db, "users", user.id);

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteDoc(colRef);
        await deleteUser(user);

        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  };
  const renderRoleLabel = (status) => {
    switch (status) {
      case userRole.ADMIN:
        return "Admin";
      case userRole.MOD:
        return "Moderator";
      case userRole.USER:
        return "User";
      default:
        break;
    }
  };
  const renderUserItem = (user) => {
    return (
      <tr key={user.id}>
        <td title={user.id}>{user.id.slice(0, 5) + "..."}</td>
        <td className="whitespace-nowrap">
          <div className="flex items-center gap-x-3">
            <img
              src={user?.avatar}
              alt=""
              className="flex-shrink-0 object-cover w-10 h-10 rounded-md"
            />
            <div className="flex-1">
              <h3>{user?.fullname}</h3>
              <time className="text-sm text-gray-300">
                {new Date(user?.createdAt?.seconds * 1000).toLocaleDateString()}
              </time>
            </div>
          </div>
        </td>
        <td>{user?.username}</td>
        <td>{user?.email.slice(0, 5) + "..."}</td>
        <td>{renderLabelStatus(Number(user?.status))}</td>
        <td>{renderRoleLabel(Number(user?.role))}</td>
        <td>
          <div className="flex items-center gap-x-3">
            <ActionEdit
              onClick={() => navigate(`/manage/update-user?id=${user.id}`)}
            ></ActionEdit>
            <ActionDelete onClick={() => handleDeleteUser(user)}></ActionDelete>
          </div>
        </td>
      </tr>
    );
  };

  const handleLoadMoreUser = async () => {
    const next = query(
      collection(db, "users"),
      startAfter(lastDoc),
      limit(USER_PER_PAGE)
    );
    const documentSnapshots = await getDocs(next);
    const lastVisible =
      documentSnapshots.docs[documentSnapshots.docs.length - 1];
    setlastDoc(lastVisible);

    onSnapshot(next, (snapshot) => {
      let results = [];

      snapshot.forEach((doc) => {
        results.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setUserList([...userList, ...results]);
    });
  };
  return (
    <>
      <Table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Info</th>
            <th>UserName</th>
            <th>Email address</th>
            <th>Status</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {userList.length > 0 && userList.map((user) => renderUserItem(user))}
        </tbody>
      </Table>
      {total > userList.length && (
        <Button className="mx-auto" onClick={handleLoadMoreUser}>
          Load more
        </Button>
      )}
    </>
  );
};

export default UserTable;

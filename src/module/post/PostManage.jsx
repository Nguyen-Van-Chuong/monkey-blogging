import { ActionDelete, ActionEdit, ActionView } from "components/action";
import { Pagination } from "components/pagination";
import { Table } from "components/table";
import { db } from "firebase-app/firebase-config";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useEffect } from "react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
const POST_PER_PAGE = 10;
const PostManage = () => {
  const [postList, setPostList] = useState([]);
  console.log("🚀 --> PostManage --> postList:", postList);
  const [filter, setFilter] = useState("");
  const [lastDoc, setlastDoc] = useState();
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Mokey blogging - Post";
  }, []);
  useEffect(() => {
    async function fetchData() {
      const colRef = collection(db, "posts");
      const newRef = filter
        ? query(
            colRef,
            where("name", ">=", filter),
            where("name", "<=", filter + "utf8")
          )
        : query(colRef, limit(POST_PER_PAGE));

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
        setPostList(results);
      });
    }
    fetchData();
  }, [filter]);

  async function handleDeletePost(id) {
    const docRef = doc(db, "posts", id);
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
        await deleteDoc(docRef);
        Swal.fire("Deleted!", "Your post has been deleted.", "success");
      }
    });
  }

  return (
    <div>
      <h1 className="dashboard-heading">Manage post</h1>
      <div className="flex justify-end mb-10">
        <div className="w-full max-w-[300px]">
          <input
            type="text"
            className="w-full p-4 border border-gray-300 border-solid rounded-lg"
            placeholder="Search post..."
          />
        </div>
      </div>
      <Table>
        <thead>
          <tr>
            <th></th>
            <th>Id</th>
            <th>Post</th>
            <th>Category</th>
            <th>Author</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {postList.length >= 0 &&
            postList.map((post) => {
              const date = post?.createdAt?.seconds
                ? new Date(post?.createdAt?.seconds * 1000)
                : new Date();
              const formatDate = new Date(date).toLocaleDateString("vi-VI");
              return (
                <tr key={post.id}>
                  <td></td>
                  <td>{post.id.slice(0, 5) + "..."}</td>
                  <td>
                    <div className="flex items-center gap-x-3">
                      <img
                        src={post.image}
                        alt={post.image_name}
                        className="w-[66px] h-[55px] rounded object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{post?.title}</h3>
                        <time className="text-sm text-gray-500">
                          Date: {formatDate}
                        </time>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="text-gray-500">{post.category?.name}</span>
                  </td>
                  <td>
                    <span className="text-gray-500">{post.user?.fullname}</span>
                  </td>
                  <td>
                    <div className="flex items-center text-gray-500 gap-x-3">
                      <ActionView
                        onClick={() => navigate(`/${post.slug}`)}
                      ></ActionView>
                      <ActionEdit></ActionEdit>
                      <ActionDelete
                        onClick={() => handleDeletePost(post.id)}
                      ></ActionDelete>
                    </div>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>
      <div className="mt-10">
        <Pagination></Pagination>
      </div>
    </div>
  );
};

export default PostManage;

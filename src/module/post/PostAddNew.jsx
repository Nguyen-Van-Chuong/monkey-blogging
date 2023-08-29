import { Button } from "components/button";
import { db } from "firebase-app/firebase-config";
import { Dropdown } from "components/dropdown";
import { Field } from "components/field";
import { Input } from "components/input";
import { Label } from "components/label";
import { postStatus } from "utils/constants";
import { Radio } from "components/checkbox";
import { toast } from "react-toastify";
import { useAuth } from "contexts/auth-context";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import ImageUpload from "components/image/ImageUpload";
import React, { useState } from "react";
import slugify from "slugify";
import styled from "styled-components";
import Toggle from "toggle/Toggle";
import useFirebaseImage from "hooks/useFirebaseImage";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
const PostAddNewStyles = styled.div``;

const PostAddNew = () => {
  const { userInfo } = useAuth();

  const { control, watch, setValue, handleSubmit, getValues, reset } = useForm({
    mode: "onChange",
    defaultValues: {
      title: "",
      slug: "",
      status: 2,
      category: {},
      user: {},
      hot: false,
      image: "",
    },
  });
  const watchStatus = watch("status");
  // const watchCategory = watch("category");
  const watchHot = watch("hot");
  // USEHOOK
  const {
    handleDeleteImage,
    handleSelectImage,
    image,
    progress,
    handleResetUpload,
  } = useFirebaseImage(setValue, getValues);
  const [categories, setCategories] = useState([]);
  const [selectCategory, setSelectCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({});

  const addPostHandler = async (values) => {
    setLoading(true);
    try {
      const cloneValues = { ...values };
      cloneValues.slug = slugify(values.slug || values.title, { lower: true });
      cloneValues.status = Number(values.status);
      const colRef = collection(db, "posts");
      await addDoc(colRef, {
        ...cloneValues,
        image,
        createdAt: serverTimestamp(),
      });
      toast.success("Create new post successfully");
      reset({
        title: "",
        slug: "",
        status: 2,
        category: {},
        hot: false,
        image: "",
        user: {},
      });
      handleResetUpload();
      setSelectCategory({});
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  // Useeffect
  useEffect(() => {
    async function getData() {
      const colRef = collection(db, "categories");
      const q = query(colRef, where("status", "==", 1));
      const querySnapshot = await getDocs(q);
      const result = [];

      querySnapshot.forEach((doc) => {
        result.push({ id: doc.id, ...doc.data() });
      });
      setCategories(result);
    }
    getData();
  }, []);
  useEffect(() => {
    async function fetchUserData() {
      if (!userInfo.email) return;
      const q = query(
        collection(db, "users"),
        where("email", "==", userInfo.email)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        console.log(doc.data());
        setValue("user", {
          id: doc.id,
          ...doc.data(),
        });
      });
    }
    fetchUserData();
  }, [userInfo.email]);
  useEffect(() => {
    document.title = "Mokey blogging - add new post";
  }, []);
  const handleClickOption = async (item) => {
    const colRef = doc(db, "categories", item.id);
    const docData = await getDoc(colRef);
    setValue("category", {
      id: docData.id,
      ...docData.data(),
    });

    setSelectCategory(item);
  };
  return (
    <PostAddNewStyles>
      <h1 className="dashboard-heading">Add new post</h1>
      <form onSubmit={handleSubmit(addPostHandler)}>
        <div className="grid grid-cols-2 mb-10 gap-x-10">
          <Field>
            <Label>Title</Label>
            <Input
              control={control}
              placeholder="Enter your title"
              name="title"
            ></Input>
          </Field>
          <Field>
            <Label>Slug</Label>
            <Input
              control={control}
              placeholder="Enter your slug"
              name="slug"
            ></Input>
          </Field>
        </div>
        <div className="grid grid-cols-2 mb-10 gap-x-10">
          <Field>
            <Label>Image</Label>
            <ImageUpload
              handleDeleteImage={handleDeleteImage}
              onChange={handleSelectImage}
              className="h-[250px]"
              progress={progress}
              image={image}
            ></ImageUpload>
          </Field>
          <Field>
            <Label>Categories</Label>
            <Dropdown>
              <Dropdown.Select
                placeholder={`${selectCategory.name || "Select category"}`}
              >
                select
              </Dropdown.Select>
              <Dropdown.List>
                {categories.length > 0 &&
                  categories.map((item) => (
                    <Dropdown.Option
                      key={item.id}
                      onClick={() => handleClickOption(item)}
                    >
                      {item.name}
                    </Dropdown.Option>
                  ))}
              </Dropdown.List>
            </Dropdown>
            {selectCategory?.name && (
              <span className="inline-block p-4 text-sm font-medium text-green-500 rounded-lg bg-green-50">
                {selectCategory.name}
              </span>
            )}
          </Field>
          <Field>
            <Label>Author</Label>
            <Input control={control} placeholder="Find the author"></Input>
          </Field>
        </div>
        <div className="grid grid-cols-2 mb-10 gap-x-10">
          <Field>
            <Label>Feature post</Label>
            <Toggle
              on={watchHot === true}
              onClick={() => setValue("hot", !watchHot)}
            ></Toggle>
          </Field>
          <Field>
            <Label>Status</Label>
            <div className="flex items-center gap-x-5">
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === postStatus.APPROVED}
                onClick={() => setValue("status", "approved")}
                value={postStatus.APPROVED}
              >
                Approved
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === postStatus.PENDING}
                onClick={() => setValue("status", "pending")}
                value={postStatus.PENDING}
              >
                Pending
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === postStatus.REJECTED}
                onClick={() => setValue("status", "reject")}
                value={postStatus.REJECTED}
              >
                Reject
              </Radio>
            </div>
          </Field>
        </div>
        <Button
          type="submit"
          className="mx-auto w-[250px]"
          isLoading={loading}
          disablede={loading}
        >
          Add new post
        </Button>
      </form>
    </PostAddNewStyles>
  );
};

export default PostAddNew;

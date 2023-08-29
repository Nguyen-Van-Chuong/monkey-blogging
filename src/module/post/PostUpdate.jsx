import { Button } from "components/button";
import { db } from "firebase-app/firebase-config";
import { Dropdown } from "components/dropdown";
import { Field } from "components/field";
import { Input } from "components/input";
import { Label } from "components/label";
import { postStatus } from "utils/constants";
import { Radio } from "components/checkbox";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import DashboardHeading from "module/dashboard/DashboardHeading";
import ImageUpload from "components/image/ImageUpload";
import React from "react";
import Toggle from "toggle/Toggle";
import useFirebaseImage from "hooks/useFirebaseImage";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

const PostUpdate = () => {
  const { handleSubmit, control, setValue, getValues, watch, reset } = useForm({
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
  const [params] = useSearchParams();
  const postId = params.get("id");
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectCategory, setSelectCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const watchStatus = watch("status");
  const watchHot = watch("hot");
  const imageUrl = getValues("image");
  const imageName = getValues("image_name");
  const deletePostImage = async () => {
    const colRef = doc(db, "posts", postId);
    await updateDoc(colRef, {
      avatar: "",
    });
  };
  // USEFFECT
  useEffect(() => {
    if (!postId) return;
    async function fetchData() {
      const colRef = doc(db, "posts", postId);
      const singleDoc = await getDoc(colRef);
      if (singleDoc) {
        reset(singleDoc.data());
        setSelectCategory(singleDoc.data()?.category || "");
      }
    }
    fetchData();
  }, [postId, reset]);
  useEffect(() => {
    async function getcategoriesData() {
      const colRef = collection(db, "categories");
      const q = query(colRef, where("status", "==", 1));
      const querySnapshot = await getDocs(q);
      const result = [];

      querySnapshot.forEach((doc) => {
        result.push({ id: doc.id, ...doc.data() });
      });
      setCategories(result);
    }
    getcategoriesData();
  }, []);
  // USEHOOK
  const {
    handleDeleteImage,
    handleSelectImage,
    image,
    progress,
    handleResetUpload,
  } = useFirebaseImage(setValue, getValues, imageName, deletePostImage);
  const updatePostHandler = (values) => {
    console.log(values);
  };
  const handleClickOption = async (item) => {
    const colRef = doc(db, "categories", item.id);
    const docData = await getDoc(colRef);
    setValue("category", {
      id: docData.id,
      ...docData.data(),
    });

    setSelectCategory(item);
  };
  if (!postId) return;
  return (
    <div>
      <DashboardHeading
        title="Update post"
        desc="Update post content"
      ></DashboardHeading>
      <form onSubmit={handleSubmit(updatePostHandler)}>
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
              image={imageUrl}
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
              on={watchHot}
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
    </div>
  );
};

export default PostUpdate;

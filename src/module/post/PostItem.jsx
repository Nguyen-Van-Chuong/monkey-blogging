import React from "react";
import styled from "styled-components";
import PostCategory from "./PostCategory";
import PostTitle from "./PostTitle";
import PostMeta from "./PostMeta";
import PostImage from "./PostImage";
import slugify from "slugify";
const PostItemStyles = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  .post {
    &-image {
      height: 202px;
      margin-bottom: 20px;
      display: block;
      width: 100%;
      border-radius: 16px;
    }

    &-category {
      margin-bottom: 16px;
    }

    &-title {
      margin-bottom: 12px;
    }
  }
`;

const PostItem = ({ data }) => {
  if (!data) return null;
  const date = data?.createdAt?.seconds
    ? new Date(data?.createdAt?.seconds * 1000)
    : new Date();
  const formatDate = new Date(date).toLocaleDateString("vi-VI");
  const { category, user } = data;
  return (
    <PostItemStyles>
      <PostImage url={data.image} to={`/${data.slug}`}></PostImage>
      <PostCategory to={data.category?.slug}>
        {data?.category?.name}
      </PostCategory>
      <PostTitle size="normal" to={data.slug}>
        {data.title}
      </PostTitle>
      <PostMeta
        to={slugify(user?.username || "", { lower: true })}
        authorName={user?.fullname}
        date={formatDate}
      ></PostMeta>
    </PostItemStyles>
  );
};

export default PostItem;

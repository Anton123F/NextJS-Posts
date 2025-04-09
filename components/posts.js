'use client'

import { formatDate } from '@/lib/format';
import LikeButton from './like-icon';
import {togglePostLikeStatus} from "@/actions/post";
import {useOptimistic} from 'react';
import Image from "next/image";

function imageLoader(config) {
  console.log(config)
  const [urlStart, urlEnd] = config.src.split('upload/');
  const transformation = `w_200,q_${config.quality}`
  return `${urlStart}upload/${transformation}/${urlEnd}`
}

function Post({ post, action }) {
  return (
    <article className="post">
      <div className="post-image">
        <Image loader={imageLoader} width={200} height={120} src={post.image} alt={post.title} quality={80} />
      </div>
      <div className="post-content">
        <header>
          <div>
            <h2>{post.title}</h2>
            <p>
              Shared by {post.userFirstName} on{' '}
              <time dateTime={post.createdAt}>
                {formatDate(post.createdAt)}
              </time>
            </p>
          </div>
          <div>
            <form action={action.bind(null, post.id)} className={post.isLiked? 'liked': ''}>
              <LikeButton />
            </form>
          </div>
        </header>
        <p>{post.content}</p>
      </div>
    </article>
  );
}

export default function Posts({ posts }) {
  if (!posts || posts.length === 0) {
    return <p>There are no posts yet. Maybe start sharing some?</p>;
  }

  const [optimisticPosts, addOptimistic] = useOptimistic(posts, (prevPost, updatedPostId) => {
    const updatedPostIndex = prevPost.findIndex(post => post.id === updatedPostId)

    if (updatedPostId === -1) {
      return prevPost;
    }

    const updatedPost = {...prevPost[updatedPostIndex]};
    updatedPost.likes = updatedPost.likes + (updatedPost.isLiked? -1: 1);
    updatedPost.isLiked = !updatedPost.isLiked;
    const newPosts = [...prevPost];
    newPosts[updatedPostIndex] = updatedPost;
    return newPosts;

  })

  async function updatePost(postId) {
    addOptimistic(postId);
    await togglePostLikeStatus(postId);
  }

  return (
    <ul className="posts">
      {optimisticPosts.map((post) => (
        <li key={post.id}>
          <Post post={post} action={updatePost} />
        </li>
      ))}
    </ul>
  );
}

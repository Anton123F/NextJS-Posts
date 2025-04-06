
"use server"
import {storePost, updatePostLikeStatus} from "@/lib/posts";
import {redirect} from "next/navigation";
import {uploadImage} from "@/lib/cloudinary";
import {revalidatePath} from "next/cache";

export async function createPost(prevState, formData) {
  const title = formData.get('title');
  const image = formData.get('image');
  const content = formData.get('content');

  const errors = [];

  if (!title || title.trim().length === 0) {
    errors.push('title is required!')
  }

  if (!image || image.size === 0) {
    errors.push('Image is required!')
  }

  if (!content || content.trim().length === 0) {
    errors.push('content is required!');
  }

  if (errors.length > 0) {
    return {errors}
  }

  let imageUrl= null;

  try {
    imageUrl = await uploadImage(image);
  } catch (e) {
    throw new Error('Image upload failed, post was not created.')
  }

  await storePost({
    imageUrl,
    title,
    content,
    userId: 1
  })

  revalidatePath('/', 'layout');
  redirect('/feed');
}

export async function togglePostLikeStatus(postId) {
  await updatePostLikeStatus(postId, 2);
  revalidatePath('/', 'layout');
}
'use client'


import {useFormStatus} from "react-dom";

export default function FormSubmit() {
  const status = useFormStatus();

  if (status.pending) {
    return <p>Post creating...</p>
  }

  return <>
    <button type="reset">Reset</button>
    <button>Create Post</button>
  </>
}
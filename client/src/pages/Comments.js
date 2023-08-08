import { useState } from "react";
import styles from "./Comments.module.css";

function Comments({ comments, postId, setComments, dataHandlers }) {
  const { addData, editData, deleteData } = dataHandlers;
  const [newComment, setNewComment] = useState(false);
  const [isEdit, setIsEdit] = useState(-1);

  const addComment = async (postId) => {
    let name = document.getElementById("commentName").value;
    let email = document.getElementById("commentEmail").value;
    let body = document.getElementById("commentBody").value;
    if (!name || !email || !body) {
      alert("One or more fields are missing!");
      return;
    }

    const url = "http://localhost:3000/comments";
    const comment = {
      postId: postId,
      name: name,
      email: email,
      body: body,
    };

    addData(url, comment, setComments);
    setNewComment(false);
  };

  const editComment = async (commentId) => {
    let name = document.getElementById("updatedCName").value;
    let email = document.getElementById("updatedCEmail").value;
    let body = document.getElementById("updatedCBody").value;

    if (!name || !email || !body) {
      alert("One or more fields are missing!");
      return;
    }

    const url = `http://localhost:3000/comments/${commentId}`;
    const comment = {
      postId: postId,
      id: commentId,
      name: name,
      email: email,
      body: body,
    };
    editData(url, comment, setComments);
    setIsEdit(-1);
  };

  const deleteComment = async (commentId) => {
    const url = `http://localhost:3000/comments/${commentId}`;
    deleteData(url, commentId, setComments);
  };

  return (
    <div className={styles.comments}>
      {comments.map((comment) => (
        <div>
          {isEdit === comment.id ? (
            <section className={styles["edit-comment"]}>
              <input id="updatedCName" defaultValue={comment.name} />
              <input id="updatedCEmail" defaultValue={comment.email} />
              <textarea id="updatedCBody" defaultValue={comment.body} />
              <button onClick={() => editComment(comment.id)}>Save</button>
            </section>
          ) : (
            <section className={styles["single-comment"]}>
              <h5>{`${comment.id}. ${comment.name}`}</h5>
              <h6>{comment.email}</h6>
              <p>{comment.body}</p>
              <button onClick={() => setIsEdit(comment.id)}>Edit</button>
              <button onClick={() => deleteComment(comment.id)}>Delete</button>
            </section>
          )}
        </div>
      ))}
      {!newComment && (
        <button
          className={styles["add-comment"]}
          onClick={() => setNewComment(true)}
        >
          Add Comment
        </button>
      )}
      {newComment && (
        <div className={styles["new-comment"]}>
          <textarea id="commentName" placeholder="name"></textarea>
          <textarea id="commentEmail" placeholder="email"></textarea>
          <textarea id="commentBody" placeholder="body"></textarea>
          <button onClick={() => addComment(postId)}>Submit</button>
        </div>
      )}
    </div>
  );
}

export default Comments;

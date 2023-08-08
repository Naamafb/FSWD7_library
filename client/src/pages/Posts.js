import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useRef } from "react";

import styles from "./Posts.module.css";
import Comments from "./Comments";

function Posts() {
  const [posts, setPosts] = useState([]);
  const [commentsPost, setCommentsPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [isEdit, setIsEdit] = useState(-1);

  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    let savedPosts = localStorage.getItem("posts");
    if (!savedPosts) {
      const url = `http://localhost:3000/posts?userId=${user.id}&_sort=id`;
      getData(url, setPosts);
      localStorage.setItem("posts", JSON.stringify(posts));
    } else {
      setPosts(JSON.parse(savedPosts));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("posts", JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    if (commentsPost) {
      localStorage.setItem(`comments${commentsPost}`, JSON.stringify(comments));
    }
  }, [comments]);

  useEffect(() => {
    let savedComments = localStorage.getItem(`comments${commentsPost}`);
    if (!savedComments) {
      const url = `http://localhost:3000/comments?postId=${commentsPost}&_sort=id`;
      getData(url, setComments);
      if (commentsPost) {
        localStorage.setItem(
          `comments${commentsPost}`,
          JSON.stringify(comments)
        );
      }
    } else {
      setComments(JSON.parse(savedComments));
    }
  }, [commentsPost]);

  const getData = async (url, setData) => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => {
        console.error("Error fetching data:", error);
        navigate("/error");
      });
  };

  const addData = async (url, data, setData) => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    try {
      const response = await fetch(url, requestOptions);
      if (response.status === 200) {
        const newData = await response.json();
        setData((prevData) => [...prevData, newData]);
      }
    } catch (error) {
      console.error("Error adding new data:", error);
      navigate("/error");
    }
  };

  const editData = async (url, data, setData) => {
    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    try {
      const response = await fetch(url, requestOptions);
      if (response.status === 200) {
        const updatedRecord = await response.json();
        setData((prevData) => {
          return prevData.map((record) => {
            if (record.id === updatedRecord.id) {
              return updatedRecord;
            }
            return record;
          });
        });
      }
    } catch (error) {
      console.error("Error updating data:", error);
      navigate("/error");
    }
  };

  const deleteData = async (url, recordId, setData) => {
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await fetch(url, requestOptions);
      if (response.ok) {
        setData((prevData) => {
          return prevData.filter((record) => record.id !== recordId);
        });
      }
    } catch (error) {
      console.error("Error deleting data:", error);
      navigate("/error");
    }
  };

  const handleComments = async (postId) => {
    if (commentsPost === postId) {
      setCommentsPost(null);
      setComments([]);
    } else {
      setCommentsPost(postId);
    }

    scrollRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const addPost = async () => {
    let title = document.getElementById("title").value;
    let body = document.getElementById("body").value;
    if (!title || !body) {
      alert("Title or body are empty");
      return;
    }

    const url = "http://localhost:3000/posts";
    const post = {
      userId: user.id,
      title: title,
      body: body,
    };
    await addData(url, post, setPosts);
    alert("Added successfully!");
  };

  const editPost = async (postId) => {
    let title = document.getElementById("updatedTitle").value;
    let body = document.getElementById("updatedBody").value;
    if (!title || !body) {
      alert("Title or body are empty");
      return;
    }

    const url = `http://localhost:3000/posts/${postId}`;
    const post = {
      id: postId,
      userId: user.id,
      title: title,
      body: body,
    };
    editData(url, post, setPosts);
    setIsEdit(-1);
  };

  const deletePost = async (postId) => {
    const url = `http://localhost:3000/posts/${postId}`;
    deleteData(url, postId, setPosts);
  };

  return (
    <section className={styles.posts} ref={scrollRef}>
      <div className={styles["new-post"]}>
        <textarea id="title" placeholder="Title"></textarea>
        <textarea id="body" placeholder="Body"></textarea>
        <button onClick={addPost}>Add Post</button>
      </div>
      <div className={styles["grid-container"]}>
        {posts.map((post) => (
          <div
            className={`${styles["post-card"]} ${
              commentsPost === post.id ? styles.singleColumn : ""
            }`}
            key={post.id}
          >
            <div>
              {isEdit === post.id ? (
                <div className={styles["edit-post"]}>
                  <section className={styles["edit-input"]}>
                    <input id="updatedTitle" defaultValue={post.title} />
                    <textarea id="updatedBody" defaultValue={post.body} />
                  </section>
                  <button onClick={() => editPost(post.id)}>Save</button>
                </div>
              ) : (
                <div>
                  <h5>{`${post.id}. ${post.title}`}</h5>
                  <p>{post.body}</p>
                </div>
              )}
            </div>

            <div className={styles["post-btns"]}>
              <button onClick={() => setIsEdit(post.id)}>Edit</button>
              <button onClick={() => deletePost(post.id)}>Delete</button>
              <button
                className={styles["comments-btn"]}
                onClick={() => handleComments(post.id)}
              >
                {commentsPost === post.id
                  ? "Hide Comments"
                  : "Display Comments"}
              </button>
            </div>
            {commentsPost === post.id && (
              <Comments
                comments={comments}
                postId={post.id}
                setComments={setComments}
                dataHandlers={{ addData, editData, deleteData }}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default Posts;

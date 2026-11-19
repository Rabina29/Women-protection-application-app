

import { useState, useEffect } from "react";

function Community() {
  const [postText, setPostText] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState("Loading posts...");

  // Load posts from MongoDB
  useEffect(() => {
    fetch("http://localhost:5000/api/posts")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Could not load posts");
        }
        return response.json();
      })
      .then((data) => {
        setPosts(data.posts);
        setMessage("");
      })
      .catch(() => {
        setMessage("Could not load posts. Check backend server.");
      });
  }, []);

  // Save new post to MongoDB
  const createPost = async () => {
    if (!postText.trim()) {
      alert("Please write something!");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/posts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: postText,
            anonymous: anonymous,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Post could not be saved.");
        return;
      }

      setPosts((previousPosts) => [
        data.post,
        ...previousPosts,
      ]);

      setPostText("");
      setAnonymous(false);
      setMessage("Post saved successfully in MongoDB!");
    } catch (error) {
      setMessage("Could not connect to backend server.");
    }
  };

  // Like a post (temporary)
  const likePost = (id) => {
    setPosts((previousPosts) =>
      previousPosts.map((post) =>
        post._id === id
          ? { ...post, likes: post.likes + 1 }
          : post
      )
    );
  };

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "30px auto",
        padding: "20px",
        fontFamily: "Arial",
      }}
    >
      <h1>SafeConnect Community</h1>
      <p>Share Your Experience, Support Each Other.</p>

      <div
        style={{
          background: "#f1f5ef",
          padding: "20px",
          borderRadius: "12px",
        }}
      >
        <h3>Create a Post</h3>

        <textarea
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          placeholder="What's happening? Share your experience..."
          style={{
            width: "100%",
            height: "100px",
            padding: "10px",
            boxSizing: "border-box",
          }}
        />

        <p>
          <input
            type="checkbox"
            checked={anonymous}
            onChange={(e) => setAnonymous(e.target.checked)}
          />
          {" "}Post Anonymously
        </p>

        <button onClick={createPost}>
          Create Post
        </button>
      </div>

      {message && <p>{message}</p>}

      <h2>Community Feed</h2>

      {posts.length === 0 && !message && (
        <p>No posts yet. Be the first to share!</p>
      )}

      {posts.map((post) => (
        <div
          key={post._id}
          style={{
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "15px",
            marginTop: "15px",
          }}
        >
          <h4>
            {post.anonymous
              ? "Anonymous User"
              : "Community Member"}
          </h4>

          <p>{post.text}</p>

          <button onClick={() => likePost(post._id)}>
            Like ({post.likes})
          </button>
        </div>
      ))}
    </div>
  );
}

export default Community;

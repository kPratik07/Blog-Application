// src/pages/Blogs.jsx
import { useState, useEffect } from "react";
import { blogService } from "../services/blog.service";
import "./Blogs.css";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newBlog, setNewBlog] = useState({ title: "", description: "" });
  const [editingBlog, setEditingBlog] = useState(null);
  const [editValues, setEditValues] = useState({ title: "", description: "" });

  const handleCreateBlog = async (e) => {
    e.preventDefault();

    const result = await blogService.createBlog(newBlog);

    if (result.success) {
      const created = result.data || {
        _id: Date.now().toString(),
        title: newBlog.title,
        description: newBlog.description,
        author: "You",
        date: new Date().toISOString().split("T")[0],
      };
      setBlogs([...blogs, created]);
      setNewBlog({ title: "", description: "" });
      setShowCreateForm(false);
    } else {
      alert(result.error || "Failed to create blog");
    }
  };

  const handleDeleteBlog = async (blogId) => {
    const result = await blogService.deleteBlog(blogId);

    if (result.success) {
      setBlogs((prev) =>
        prev.filter((blog) => blog._id !== blogId && blog.id !== blogId)
      );
    } else {
      alert(result.error || "Failed to delete blog");
    }
  };

  const fetchBlogs = async () => {
    const result = await blogService.getBlogs();

    if (result.success) {
      setBlogs(result.data);
    } else {
      console.error(result.error || "Failed to fetch blogs");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const startEdit = (blog) => {
    setEditingBlog(blog);
    setEditValues({ title: blog.title, description: blog.description });
  };

  const cancelEdit = () => {
    setEditingBlog(null);
    setEditValues({ title: "", description: "" });
  };

  const submitEdit = async (e) => {
    e.preventDefault();

    const result = await blogService.updateBlog(editingBlog._id, editValues);

    if (result.success) {
      setBlogs((prev) =>
        prev.map((b) =>
          b._id === editingBlog._id ? result.data || { ...b, ...editValues } : b
        )
      );
      cancelEdit();
    } else {
      alert(result.error || "Failed to update blog");
    }
  };

  return (
    <div className="blogs-container">
      <div className={`blogs-header ${blogs.length > 0 ? "has-button" : ""}`}>
        <h2 className="blogs-title">
          {blogs.length === 0
            ? "Welcome to Your Blog Dashboard! 🎉"
            : "All Blogs"}
        </h2>
        {blogs.length > 0 && (
          <button
            className="add-blog-btn"
            onClick={() => setShowCreateForm(true)}
          >
            + Add New Blog
          </button>
        )}
      </div>

      {showCreateForm && (
        <div className="create-blog-modal">
          <div className="modal-content">
            <h3>Create New Blog</h3>
            <form onSubmit={handleCreateBlog}>
              <input
                type="text"
                placeholder="Blog Title"
                value={newBlog.title}
                onChange={(e) =>
                  setNewBlog({ ...newBlog, title: e.target.value })
                }
                required
              />
              <textarea
                placeholder="Blog Description"
                value={newBlog.description}
                onChange={(e) =>
                  setNewBlog({ ...newBlog, description: e.target.value })
                }
                rows="4"
                required
              />
              <div className="modal-actions">
                <button type="submit" className="create-btn">
                  Create Blog
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {blogs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">✨</div>
          <h3>Ready to Share Your Story?</h3>
          <p>
            Your creative journey starts here! Create your first blog post and
            let your voice be heard. Share your thoughts, experiences, and
            insights with the world.
          </p>
          <div className="empty-cta">
            <button
              className="start-blogging-btn"
              onClick={() => setShowCreateForm(true)}
            >
              Start Writing Your First Blog
            </button>
          </div>
        </div>
      ) : (
        <div className="blogs-grid">
          {blogs.map((blog) => (
            <div className="blog-card" key={blog._id || blog.id}>
              <h3>{blog.title}</h3>
              <p className="blog-content">{blog.description}</p>
              <p className="blog-meta">
                ✍️ {blog.author || blog.author_email || "You"} | 📅{" "}
                {blog.date ||
                  new Date(blog.createdAt).toISOString().split("T")[0]}
              </p>
              <div className="blog-actions">
                <button className="edit-btn" onClick={() => startEdit(blog)}>
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteBlog(blog._id || blog.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Edit modal */}
      {editingBlog && (
        <div className="create-blog-modal">
          <div className="modal-content">
            <h3>Edit Blog</h3>
            <form onSubmit={submitEdit}>
              <input
                type="text"
                placeholder="Blog Title"
                value={editValues.title}
                onChange={(e) =>
                  setEditValues({ ...editValues, title: e.target.value })
                }
                required
              />
              <textarea
                placeholder="Blog Description"
                value={editValues.description}
                onChange={(e) =>
                  setEditValues({ ...editValues, description: e.target.value })
                }
                rows="4"
                required
              />
              <div className="modal-actions">
                <button type="submit" className="create-btn">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={cancelEdit}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

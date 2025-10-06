const express = require("express");
const { Blogmodel } = require("../models/Blog.model");
const jwt = require("jsonwebtoken");
const { Usermodel } = require("../models/User.model");

const blogRouter = express.Router();

blogRouter.get("/", async (req, res) => {
  try {
    const userId = req.userId;
    const user = await Usermodel.findOne({ _id: userId });
    if (!user) return res.status(404).send({ message: "User not found" });
    const author_email = user.email;
    const blogs = await Blogmodel.find({ author_email });
    res.send({ blogs: blogs });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error fetching blogs" });
  }
});

blogRouter.post("/create", async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.userId;
    const user = await Usermodel.findOne({ _id: userId });
    if (!user) return res.status(404).send({ message: "User not found" });
    const author_email = user.email;
    const created = await Blogmodel.create({
      title,
      description,
      author_email,
    });
    res.status(201).send({ message: "Blog created", blog: created });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error creating blog" });
  }
});

blogRouter.patch("/edit/:blogID", async (req, res) => {
  try {
    const blogID = req.params.blogID;
    const payload = req.body;

    const userId = req.userId;
    const user = await Usermodel.findOne({ _id: userId });
    if (!user) return res.status(404).send({ message: "User not found" });
    const user_email = user.email;
    const blog = await Blogmodel.findOne({ _id: blogID });
    if (!blog) return res.status(404).send({ message: "Blog not found" });
    const author_email = blog.author_email;
    if (user_email !== author_email) {
      return res
        .status(403)
        .send({ message: "You are not authorized to do this operation" });
    } else {
      const updated = await Blogmodel.findByIdAndUpdate(blogID, payload, {
        new: true,
      });
      return res.send({ message: "Blog updated", blog: updated });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error updating blog" });
  }
});

blogRouter.delete("/delete/:blogID", async (req, res) => {
  try {
    const blogID = req.params.blogID;

    const userId = req.userId;
    const user = await Usermodel.findOne({ _id: userId });
    if (!user) return res.status(404).send({ message: "User not found" });
    const user_email = user.email;

    const blog = await Blogmodel.findOne({ _id: blogID });
    if (!blog) return res.status(404).send({ message: "Blog not found" });
    const author_email = blog.author_email;

    if (user_email !== author_email) {
      return res
        .status(403)
        .send({ message: "You are not authorized to do this operation" });
    } else {
      await Blogmodel.findByIdAndDelete(blogID);
      return res.send({ message: "Blog deleted" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error deleting blog" });
  }
});

module.exports = { blogRouter };

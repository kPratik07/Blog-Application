const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    author_email: { type: String, required: true },
  },
  { timestamps: true }
);

const Blogmodel = mongoose.model("blog", BlogSchema);

module.exports = { Blogmodel };

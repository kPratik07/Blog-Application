// Blog Service
import { apiClient } from "./api.client";
import { API_CONFIG } from "../config/api.config";

class BlogService {
  // Get all blogs
  async getBlogs() {
    try {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.BLOGS);
      return { success: true, data: response.blogs || [] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Create new blog
  async createBlog(blogData) {
    try {
      const response = await apiClient.post(
        API_CONFIG.ENDPOINTS.BLOG_CREATE,
        blogData
      );
      return { success: true, data: response.blog };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Update blog
  async updateBlog(blogId, blogData) {
    try {
      const response = await apiClient.patch(
        API_CONFIG.ENDPOINTS.BLOG_EDIT(blogId),
        blogData
      );
      return { success: true, data: response.blog };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Delete blog
  async deleteBlog(blogId) {
    try {
      const response = await apiClient.delete(
        API_CONFIG.ENDPOINTS.BLOG_DELETE(blogId)
      );
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

// Export singleton instance
export const blogService = new BlogService();

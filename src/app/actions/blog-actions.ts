'use server';

export async function deleteBlog(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/blogs/${slug}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (data.success) {
      return { success: true, message: 'Blog deleted successfully' };
    } else {
      return { success: false, error: data.error || 'Failed to delete blog' };
    }
  } catch (error) {
    console.error('Error deleting blog:', error);
    return { success: false, error: 'Failed to delete blog' };
  }
}
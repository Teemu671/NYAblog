const API_BASE = "http://cat0s.com:3001";

function escapeHtml(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function getPostId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('postId');
}

async function loadPost() {
  const postId = getPostId();
  const titleElement = document.getElementById('post-title');
  const authorElement = document.getElementById('post-author');
  const metaElement = document.getElementById('post-meta');
  const bodyElement = document.getElementById('post-body');

  if (!postId) {
    titleElement.textContent = 'Post not found';
    bodyElement.innerHTML = '<p>No post ID was provided.</p>';
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/blog/id/${postId}`);
    if (!response.ok) throw new Error(response.statusText);
    const posts = await response.json();
    const post = Array.isArray(posts) ? posts[0] : posts;

    if (!post || !post.post_id) {
      titleElement.textContent = 'Post not found';
      bodyElement.innerHTML = '<p>The requested post does not exist.</p>';
      return;
    }

    const title = post.text ? post.text.trim().split('\n')[0].slice(0, 80) : `Post #${post.post_id}`;
    const author = post.author_name || post.author_id || 'Author';
    const date = formatDate(post.created_at);
    const tag = post.tag ? escapeHtml(post.tag) : 'Blog';
    const content = escapeHtml(post.text || '');

    titleElement.textContent = title;
    authorElement.textContent = author;
    metaElement.textContent = `${tag} • ${date}`;
    bodyElement.innerHTML = `<p>${content.replace(/\n/g, '<br>')}</p>`;
  } catch (error) {
    titleElement.textContent = 'Error loading post';
    bodyElement.innerHTML = `<p>${escapeHtml(error.message)}</p>`;
  }
}

document.addEventListener('DOMContentLoaded', loadPost);

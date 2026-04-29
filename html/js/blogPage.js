const API_BASE = "https://cat0s.com:3001";

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

    const imageRes = await fetch("https://cat0s.com:3001/cdn/image/"+ post.image_id);
                    
    const image = await imageRes.json();
    console.log(image)

    banner.style.backgroundImage = `url(https://cat0s.com/cdn/${image.filename})`
    banner.style.backgroundRepeat = 'no-repeat'
    banner.style.backgroundSize = 'contain, cover'
    banner.style.backgroundPosition = 'center'


    const title = post.title ? post.title.trim().split('\n')[0].slice(0, 80) : `Post #${post.post_id}`;
    const author = post.author_name || post.author_id || 'Author';
    const date = formatDate(post.created_at);
    const tag = post.tag ? escapeHtml(post.tag) : 'Blog';

    titleElement.textContent = title;
    authorElement.textContent = author;
    metaElement.textContent = `${tag} • ${date}`;
    bodyElement.innerHTML = post.text || '';
  } catch (error) {
    titleElement.textContent = 'Error loading post';
    bodyElement.innerHTML = `<p>${escapeHtml(error.message)}</p>`;
  }
}

document.addEventListener('DOMContentLoaded', loadPost);

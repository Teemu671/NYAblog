const API_BASE = "https://cat0s.com:3001";
const POSTS_ENDPOINT = `${API_BASE}/blog/all/`;
const USERS_ENDPOINT = `${API_BASE}/user/uid/`;

function escapeHtml(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatPostTitle(text, id) {
  if (!text) return `Post #${id}`;
  const rawTitle = text.trim().split('\n')[0].slice(0, 80);
  return rawTitle.length ? rawTitle : `Post #${id}`;
}

function formatPostSnippet(text) {
  if (!text) return '';
  const snippet = text.trim().replace(/\s+/g, ' ').slice(0, 120);
  return snippet.length < text.length ? snippet + '…' : snippet;
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

function createPostCard(post) {
  const user = loadUser(post.author_id)
  
  const title = escapeHtml(formatPostTitle(post.text, post.post_id));
  const snippet = escapeHtml(formatPostSnippet(post.text));
  const tag = escapeHtml(post.tag || 'Blog');
  const date = escapeHtml(formatDate(post.created_at));
  const author = escapeHtml( user || 'Unknown');
  const postId = post.post_id;

  const wrapper = document.createElement('div');
  wrapper.className = 'card-wrapper';
  wrapper.innerHTML = `
    <a class="card" href="/blogPage?postId=${postId}">
      <img src="https://placehold.co/600x400/EEE/31343C" class="card-img-top" alt="${tag}">
      <div class="card-body">
        <span class="post-tag">${tag}</span>
        <h5 class="txtcolor">${title}</h5>
        <p class="txtcolor">${snippet}</p>
        <div class="post-meta">${author} ${date}</div>
      </div>
    </a>
  `;
  return wrapper;
}

async function loadPosts() {
  const container = document.getElementById('post-grid');
  if (!container) return;

  try {
    const response = await fetch(POSTS_ENDPOINT);
    if (!response.ok) throw new Error(response.statusText);
    const posts = await response.json();

    if (!Array.isArray(posts) || posts.length === 0) {
      container.innerHTML = '<div class="empty-state">No posts found.</div>';
      return;
    }

    container.innerHTML = '';
    posts.forEach(post => container.appendChild(createPostCard(post)));
  } catch (error) {
    container.innerHTML = `<div class="empty-state">Unable to load posts: ${escapeHtml(error.message)}</div>`;
  }
}

async function loadUser(uid) {
  try {
    const response = await fetch(USERS_ENDPOINT+uid);
    if (!response.ok) throw new Error(response.statusText);
    const user = await response.json();

    if (user.length === 0) {
      alert("user not found");
      return;
    }

    return user;
    
  } catch (error) {
 
  }
}

document.addEventListener('DOMContentLoaded', loadPosts);

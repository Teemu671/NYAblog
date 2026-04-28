const API_BASE = "https://cat0s.com:3001";
const POSTS_ENDPOINT = `${API_BASE}/blog/all/`;
const USERS_ENDPOINT = `${API_BASE}/user/uid/`;
const IMAGE_ENDPOINT = `${API_BASE}/cdn/image/`;


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
  const plain = text.replace(/<[^>]*>/g, '').trim().replace(/\s+/g, ' ');
  return plain.length > 120 ? plain.slice(0, 120) + '…' : plain;
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

function createPostCard(post, user, image) {
  
  const title = escapeHtml(formatPostTitle(post.text, post.post_id));
  const tag = escapeHtml(post.tag || 'Blog');
  const date = escapeHtml(formatDate(post.created_at));
  const author = escapeHtml( user.display_name || 'Unknown');
  const postId = post.post_id;

  const wrapper = document.createElement('div');
  wrapper.className = 'card-wrapper';
  wrapper.innerHTML = `
    <a class="card" href="/blogPage?postId=${postId}">
      <img src="${ post.image_id ? 'https://cat0s.com/cdn/'+image.filename : 'https://placehold.co/400'}" class="card-img-top" alt="${tag}">
      <div class="card-body">
        <span class="post-tag">${tag}</span>
        <h5 class="txtcolor">${title}</h5>
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
    posts.forEach(post => 
      {
        const image = loadImage(post.image_id)
        const user = loadUser(post.author_id)
        Promise.all([user,image]).then((values)=>{
          
            if (post.image_id != null) {
              return container.appendChild(createPostCard(post, values[0], values[1]))
            } else {
              return container.appendChild(createPostCard(post, values[0], null))
            }
          })
        });
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
};
async function loadImage(id) {
  try {
    const response = await fetch(IMAGE_ENDPOINT+id);
    if (!response.ok) throw new Error(response.statusText);
    const image = await response.json();

    if (image.length === 0) {
      alert("image not found");
      return;
    }

    return image;
    
  } catch (error) {
 
  }
}

document.addEventListener('DOMContentLoaded', loadPosts);

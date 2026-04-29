const API_BASE = "https://cat0s.com:3001";

function escapeHtml(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}


        // `<div class="blog-text">
        //     <div class="post-meta">${author} • ${date}</div>
        // </div>`
        async function loadComments(postId) {
            
            const grid = document.getElementById('my-post-grid');
            const res = await fetch(`${API_BASE}/blog/comments/${postId}`);
            const comments = await res.json();
            

            if (!posts.length) {
            grid.innerHTML = '<p style="padding:1rem;">No comments yet.</p>';
            return;
            }

            grid.innerHTML = '';
            posts.forEach(async (post) => {
              
              const title = escapeHtml(post.title || `Post #${post.post_id}`);
              const wrapper = document.createElement('div');
              wrapper.className = 'card-wrapper';
              wrapper.innerHTML = `
                  <a class="card" href="/blogPage?postId=${post.post_id}">
                  <img src="${post.image_id
                      ? `https://cat0s.com/cdn/${image.filename}`
                      : 'https://cat0s.com/cdn/placeholder.png'}" class="card-img-top">
                  <div class="card-body">
                      <span class="post-tag">${escapeHtml(post.tag || 'Blog')}</span>
                      <h5 class="txtcolor">${title}</h5>
                  </div>
                  </a>`;
              grid.appendChild(wrapper);
            });
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
  const banner = $('.blog-banner')[0];
  const commentsContainer = document.getElementById('comments-container')
  const avatarElement = document.getElementById('post-avatar')
  const authorElement = document.getElementById('post-author');
  const titleElement = document.getElementById('post-title');
  const metaElement = document.getElementById('post-meta');
  const bodyElement = document.getElementById('post-body');

  if (!postId) {
    titleElement.textContent = 'Post not found';
    bodyElement.innerHTML = '<p>No post ID was provided.</p>';
    return;
  }

  try {
    const postRes = await fetch(`${API_BASE}/blog/id/${postId}`);
    if (!postRes.ok) throw new Error(postRes.statusText);
    const posts = await postRes.json();
    const post = Array.isArray(posts) ? posts[0] : posts;

    

    if (!post || !post.post_id) {
      titleElement.textContent = 'Post not found';
      bodyElement.innerHTML = '<p>The requested post does not exist.</p>';
      return;
    }

    const userRes = await fetch(`${API_BASE}/user/uid/${post.author_id}`);
    if (!userRes.ok) throw new Error(userRes.statusText);
    const user = await userRes.json();

    const imageRes = await fetch("https://cat0s.com:3001/cdn/image/"+ post.image_id);
      
    const image = await imageRes.json();
    

    banner.style.backgroundImage = `url(${post.image_id ? `https://cat0s.com/cdn/${image.filename}` : 'https://cat0s.com/cdn/placeholder.png'})`
    banner.style.backgroundRepeat = 'no-repeat'
    banner.style.backgroundSize = 'contain, cover'
    banner.style.backgroundPosition = 'center'

    
    const title = post.title ? post.title.trim().split('\n')[0].slice(0, 80) : `Post #${post.post_id}`;
    const author = escapeHtml( user.display_name || 'Unknown');
    const date = formatDate(post.updated_at);
    const tag = post.tag ? escapeHtml(post.tag) : 'Blog';
    
    const avatarRes = await fetch("https://cat0s.com:3001/cdn/image/"+ user.avatar_id);
      
    const avatar = await avatarRes.json();

    avatarElement.src = `https://cat0s.com/cdn/${avatar.filename}`
    authorElement.textContent = author
    authorElement.href = 'https://cat0s.com/profile?uid='+post.author_id
    titleElement.textContent = title;
    metaElement.textContent = `${tag} • ${date}`;
    bodyElement.innerHTML = post.text || '';
  } catch (error) {
    titleElement.textContent = 'Error loading post';
    bodyElement.innerHTML = `<p>${escapeHtml(error.message)}</p>`;
  }
}

document.addEventListener('DOMContentLoaded', loadPost);

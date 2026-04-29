const API_BASE = "https://cat0s.com:3001";

function escapeHtml(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

$(document).ready(function() {
    $('#editor').summernote({
        placeholder: 'Write your comment...',
        height: 300
    });
    $('#sidebar-toggle').click(function() {
        $('.sidebar').toggle();
    });

    $('#post-form').on('submit', async function(event) {
        event.preventDefault();

        
        const text = $('#editor').summernote('code');
        const storedUser = sessionStorage.getItem('user');
        const user = storedUser ? JSON.parse(storedUser) : null;
        const token = user?.token;

        if (!token) {
            alert('You must be logged in to publish a comment.');
            return;
        }

        try {
            const response = await fetch('https://cat0s.com:3001/blog/comment/'+postId, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ message: text, image: uploadedImageId })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || response.statusText);
            }

            alert('Post published successfully.');
            window.location.href = '/';
        } catch (error) {
            alert('Failed to publish post: ' + error.message);
        }
    });
    let uploadedImageId = null;

    $('#upload-btn').click(async function () {
        const file = $('#image-input')[0].files[0];
        const banner = $('.blog-banner')[0];
        if (!file) { alert('Pick an image first.'); return; }

        const storedUser = sessionStorage.getItem('user');
        const token = storedUser ? JSON.parse(storedUser)?.token : null;
        if (!token) { alert('You must be logged in.'); return; }

        const formData = new FormData();
        formData.append('sampleFile', file);

        try {
            const uploadRes = await fetch('https://cat0s.com:3001/cdn/upload', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            const upload = await uploadRes.json();
            uploadedImageId = upload.image_id;

            const imageRes = await fetch("https://cat0s.com:3001/cdn/image/"+ upload.image_id);
            
            const image = await imageRes.json();

            banner.style.backgroundImage = `url(https://cat0s.com/cdn/${image.filename})`
            banner.style.backgroundRepeat = 'no-repeat'
            banner.style.backgroundSize = 'contain, cover'
            banner.style.backgroundPosition = 'center'
            
            $('#upload-status').text(' Image uploaded');
        } catch (err) {
            alert('Upload failed: ' + err.message);
        }
    });
});


const postId = getPostId();

    


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

    const res = await fetch(`${API_BASE}/blog/comments/${post.postId}`);
    const comments = await res.json();
    

    if (!comments.length) {
    commentsContainer.innerHTML = '<p style="padding:1rem;">No comments yet.</p>';
    return;
    }

    commentsContainer.innerHTML = '';
    comments.forEach(async (post) => {
      
      const wrapper = document.createElement('div');
      wrapper.className = 'card-wrapper';

//       `<div class="blog-text">
//           
//       </div>`

      wrapper.innerHTML = `
          <div class="blog-text">
          <img src="${post.image_id
              ? `https://cat0s.com/cdn/${image.filename}`
              : 'https://cat0s.com/cdn/placeholder.png'}" class="profile-pic">
          <div class="card-body">
              <div class="post-meta">${author_id} • ${date}</div>
          </div>
          </div>`;
      commentsContainer.appendChild(wrapper);
    });


  } catch (error) {
    titleElement.textContent = 'Error loading post';
    bodyElement.innerHTML = `<p>${escapeHtml(error.message)}</p>`;
  }
}

document.addEventListener('DOMContentLoaded', loadPost);

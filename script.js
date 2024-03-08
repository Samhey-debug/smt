document.addEventListener('DOMContentLoaded', function() {

  showLoadingScreen();

  loadPosts();

});

function showLoadingScreen() {

  document.getElementById('loading-screen').style.display = 'flex';

}

function hideLoadingScreen() {

  document.getElementById('loading-screen').style.display = 'none';

}

function submitPost() {

  showLoadingScreen(); // Show loading screen when submitting a post

  var username = document.getElementById('username').value.trim();

  var profilePicInput = document.getElementById('profile-pic');

  var postText = document.getElementById('post-text').value.trim();

  

  if (username === '' || postText === '') {

    hideLoadingScreen(); // Hide loading screen if validation fails

    alert('Please enter your username and some text for the post.');

    return;

  }

  

  var profilePic = '';

  if (profilePicInput.files.length > 0) {

    var reader = new FileReader();

    reader.onload = function(event) {

      profilePic = event.target.result;

      savePostAndDisplay(username, profilePic, postText);

    };

    reader.readAsDataURL(profilePicInput.files[0]);

  } else {

    savePostAndDisplay(username, profilePic, postText);

  }

}

function savePostAndDisplay(username, profilePic, postText) {

  var post = {

    id: Date.now(),

    username: username,

    profilePic: profilePic,

    text: postText,

    likes: 0,

    liked: false

  };

  

  savePost(post);

  displayPost(post);

  document.getElementById('post-text').value = ''; // Clear textarea after posting

  hideLoadingScreen(); // Hide loading screen after posting

}

function displayPost(post) {

  var postElement = document.createElement('div');

  postElement.classList.add('post');

  postElement.innerHTML = `

    <div class="post-header">

      <img src="${post.profilePic}" alt="Profile Picture" class="profile-pic">

      <span class="username">${post.username}</span>

    </div>

    <p class="post-text">${post.text}</p>

    <div class="post-footer">

      <button class="like-btn" onclick="likePost(${post.id})">${post.likes} Likes</button>

      <button onclick="deletePost(${post.id})">Delete</button>

    </div>`;

  document.getElementById('posts').appendChild(postElement);

}

function savePost(post) {

  var posts = getPostsFromStorage();

  posts.push(post);

  localStorage.setItem('posts', JSON.stringify(posts));

}

function loadPosts() {

  var posts = getPostsFromStorage();

  posts.forEach(post => {

    displayPost(post);

  });

  hideLoadingScreen(); // Hide loading screen after loading posts

}

function getPostsFromStorage() {

  var posts = localStorage.getItem('posts');

  return posts ? JSON.parse(posts) : [];

}

function deletePost(postId) {

  var posts = getPostsFromStorage();

  var postElement = document.querySelector(`[onclick="deletePost(${postId})"]`).parentNode.parentNode;

  postElement.classList.add('deleted-post');

  setTimeout(function() {

    postElement.remove();

  }, 500); // Delay removal to match animation duration

  posts = posts.filter(post => post.id !== postId);

  localStorage.setItem('posts', JSON.stringify(posts));

}

function likePost(postId) {

  var posts = getPostsFromStorage();

  var post = posts.find(post => post.id === postId);

  if (!post.liked) {

    post.likes++;

    post.liked = true;

    var likeButton = document.querySelector(`[onclick="likePost(${postId})"]`);

    likeButton.textContent = post.likes + ' Likes';

    likeButton.classList.add('like-btn-liked');

    setTimeout(function() {

      likeButton.classList.remove('like-btn-liked');

    }, 500); // Remove animation class after duration

    localStorage.setItem('posts', JSON.stringify(posts));

  }

}

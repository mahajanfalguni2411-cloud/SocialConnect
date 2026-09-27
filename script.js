
const API_URL = "http://localhost:5000";

const token = localStorage.getItem("token");


// =====================================
// CREATE POST
// =====================================

async function createPost() {

    const content = document.getElementById("postContent").value;
    const message = document.getElementById("postMessage");

    if (!content.trim()) {
        message.textContent = "Please write something.";
        return;
    }

    try {

        const response = await fetch(`${API_URL}/api/posts`, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                token: token,
                content: content
            })
        });

        const data = await response.json();

        if (response.ok) {

            message.textContent =
                "Post created successfully! 🎉";

            document.getElementById("postContent").value = "";

            loadPosts();

        } else {

            message.textContent =
                data.message || "Failed to create post.";
        }

    } catch (error) {

        console.error("Create post error:", error);

        message.textContent =
            "Unable to connect to server.";
    }
}


// =====================================
// LOAD POSTS
// =====================================

async function loadPosts() {

    const container =
        document.getElementById("postsContainer");

    container.innerHTML = "Loading posts...";

    try {

        const response =
            await fetch(`${API_URL}/api/posts`);

        if (!response.ok) {
            throw new Error("Failed to load posts");
        }

        const posts = await response.json();

        container.innerHTML = "";

        if (posts.length === 0) {

            container.innerHTML =
                "<p>No posts yet.</p>";

            return;
        }

        posts.forEach(post => {

            const postDiv =
                document.createElement("div");

            postDiv.className = "post";

            postDiv.innerHTML = `
                <h3>${post.user.name}</h3>

                <p>${post.content}</p>

                <small>
                    ${new Date(post.createdAt).toLocaleString()}
                </small>

                <br><br>

                <button onclick="likePost('${post._id}')">
                    ❤️ Like
                </button>

                <span>
                    ${post.likes ? post.likes.length : 0} Likes
                </span>

                <br><br>

                <button onclick="deletePost('${post._id}')">
                    🗑️ Delete
                </button>

                <hr>

                <h4>💬 Comments</h4>

                <div>
                    ${
                        post.comments &&
                        post.comments.length > 0

                        ?

                        post.comments.map(comment => `
                            <p>
                                <strong>
                                    ${
                                        comment.user
                                            ? comment.user.name
                                            : "User"
                                    }
                                </strong>:
                                ${comment.text}
                            </p>
                        `).join("")

                        :

                        "<p>No comments yet.</p>"
                    }
                </div>

                <input
                    type="text"
                    id="comment-${post._id}"
                    placeholder="Write a comment..."
                >

                <button onclick="addComment('${post._id}')">
                    Comment
                </button>
            `;

            container.appendChild(postDiv);

        });

    } catch (error) {

        console.error("Load posts error:", error);

        container.innerHTML =
            "<p>Unable to load posts.</p>";
    }
}


// =====================================
// LIKE / UNLIKE POST
// =====================================

async function likePost(postId) {

    try {

        const response = await fetch(
            `${API_URL}/api/posts/${postId}/like`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    token: token
                })
            }
        );

        const data = await response.json();

        if (response.ok) {

            loadPosts();

        } else {

            alert(
                data.message ||
                "Unable to like post."
            );
        }

    } catch (error) {

        console.error("Like error:", error);

        alert("Unable to connect to server.");
    }
}


// =====================================
// ADD COMMENT
// =====================================

async function addComment(postId) {

    const input =
        document.getElementById(
            `comment-${postId}`
        );

    const text = input.value;

    if (!text.trim()) {

        alert("Please write a comment.");

        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/api/posts/${postId}/comment`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    token: token,
                    text: text
                })
            }
        );

        const data = await response.json();

        if (response.ok) {

            input.value = "";

            loadPosts();

        } else {

            alert(
                data.message ||
                "Unable to add comment."
            );
        }

    } catch (error) {

        console.error("Comment error:", error);

        alert("Unable to connect to server.");
    }
}


// =====================================
// DELETE POST
// =====================================

async function deletePost(postId) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this post?"
    );

    if (!confirmDelete) {
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/api/posts/${postId}`,
            {
                method: "DELETE",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    token: token
                })
            }
        );

        const data = await response.json();

        if (response.ok) {

            alert(
                "Post deleted successfully!"
            );

            loadPosts();

        } else {

            alert(
                data.message ||
                "Unable to delete post."
            );
        }

    } catch (error) {

        console.error("Delete error:", error);

        alert("Unable to connect to server.");
    }
}


// =====================================
// LOGOUT
// =====================================
// =====================================
// GO TO PROFILE
// =====================================

function goToProfile() {
    window.location.href = "profile.html";
}
function logout() {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    window.location.href = "login.html";
}


// =====================================
// LOAD POSTS WHEN PAGE OPENS
// =====================================

loadPosts();


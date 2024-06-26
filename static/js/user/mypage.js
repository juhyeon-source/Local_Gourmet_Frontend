const frontendBaseUrl = "https://www.sparta-local-gourmet.store";
const backendBaseUrl = "http://3.38.191.229";

// 로그인 여부 체크
window.onload = () => {
  if (!localStorage.getItem("access")) {
    window.location.href = `${frontendBaseUrl}`;
  }
};

function storyDetail(story_id) {
  window.location.href = `${frontendBaseUrl}/story/detail.html?story_id=${story_id}`;
}

// 마이페이지 get api
function getMyPage() {
  const accessToken = localStorage.getItem("access");
  fetch(`${backendBaseUrl}/user/mypage/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((user) => {
      // user 정보 가져오기
      const data = user.my_data;
      document.getElementById("nickname").textContent = data.nickname;
      document.getElementById("email").textContent = data.email;
      document.getElementById("country").textContent = data.country;

      const userImage = document.getElementById("user-profile");
      if (data.profile_img) {
        userImage.setAttribute("src", `${backendBaseUrl}${data.profile_img}`);
      } else {
        userImage.setAttribute("src", `${backendBaseUrl}/media/user/default-profile.jpg`);
      }

      // 북마크 목록 불러오기
      const bookmarks = data.bookmark_story_list;
      bookmarks.reverse();
      const bookmarkList = document.getElementById("bookmark-story");
      bookmarkList.innerHTML = "";

      bookmarks.forEach((bookmark) => {
        const bookmarkElement = document.createElement("div");
        bookmarkElement.setAttribute("onclick", `storyDetail(${bookmark.story_id})`);

        bookmarkElement.innerHTML = `
                <div class="bookmark-card">
                  <img class="card-img" src="${backendBaseUrl}${bookmark.content.story_image}" />
                  <div class="card-text">
                  <p class="title">${bookmark.story_title}</p>
                  <p class="content">${bookmark.content.story_paragraph}</p>
                  <hr class="card-hr">
                  <div class="card_bottom">
                    <p class="country">${bookmark.author_country}
                    <span class="like">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-suit-heart-fill" viewBox="0 0 16 16">
                    <path d="M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1z"/>
                    </svg>${bookmark.like_user_list.length}
                    </span></p>
                  </div> 
                </div>
                `;

        bookmarkList.appendChild(bookmarkElement);
      });

      // 내가 작성한 동화 목록 불러오기
      const stories = data.my_story_list;
      stories.reverse();
      const storyList = document.getElementById("my-story");
      storyList.innerHTML = "";

      stories.forEach((story) => {
        const storyElement = document.createElement("div");
        storyElement.setAttribute("onclick", `storyDetail(${story.story_id})`);

        storyElement.innerHTML = `
                <div class="my-story-card">
                          <img class="card-img" src="${backendBaseUrl}${story.content.story_image}" />
                          <div class="card-text">
                            <p class="title">${story.story_title}</p>
                            <p class="content">${story.content.story_paragraph}</p>
                            <hr class="card-hr">
                            <div class="card_bottom">
                                <p class="country">${story.author_country}
                                <span class="like">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-suit-heart-fill" viewBox="0 0 16 16">
                                <path d="M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1z"/>
                                </svg>${story.like_user_list.length}
                                </span></p>
                            </div>
                          </div>
                      </div>
                  </div>
              `;
        storyList.appendChild(storyElement);
      });

      // 최근 조회한 글 목록 불러오기
      const storyTimestamps = data.story_timestamps;

      const recentStoryList = document.getElementById("recently-story");
      recentStoryList.innerHTML = "";

      storyTimestamps.forEach((recent_story) => {
        const recentStoryElement = document.createElement("div");
        recentStoryElement.setAttribute("onclick", `storyDetail(${recent_story.story_id})`);

        recentStoryElement.innerHTML = `
                <div class="recently-card">
                          <img class="card-img" src="${backendBaseUrl}${recent_story.content.story_image}" />
                          <div class="card-text">
                            <p class="title">${recent_story.story_title}</p>
                            <p class="content">${recent_story.content.story_paragraph}</p>
                            <hr class="card-hr">
                            <div class="card_bottom">
                                <p class="country">${recent_story.author_country}
                                <span class="like">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-suit-heart-fill" viewBox="0 0 16 16">
                                <path d="M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1z"/>
                                </svg>${recent_story.like_user_list.length}
                                </span></p>
                            </div>
                          </div>
                      </div>
                  </div>
              `;

        recentStoryList.appendChild(recentStoryElement);
      });
    });
}

window.addEventListener("load", getMyPage);
window.onpageshow = function (event) {
  if (
    event.persisted ||
    (window.performance && window.performance.getEntriesByType("navigation")[0]["type"] == "back_forward")
  ) {
    location.replace(location.href);
  }
};
function getInfoPage() {
  window.location.href = `${frontendBaseUrl}/user/user-info-update.html`;
}

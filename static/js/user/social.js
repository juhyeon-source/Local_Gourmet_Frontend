const frontendBaseUrl = "http://127.0.0.1:5500";
const backendBaseUrl = "http://127.0.0.1:8000";

// 카카오 로그인 페이지로 이동
async function kakaoLogin() {
    const response = await fetch(`${backendBaseUrl}/api/accounts/social/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ social: "kakao" }),
    });
    const dataUrl = await response.json();
    const responseUrl = dataUrl.url;
    window.location.href = responseUrl;
  }
  
  // 구글 로그인 페이지로 이동
  async function googleLogin() {
    const response = await fetch(`${backendBaseUrl}/api/accounts/social/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ social: "google" }),
    });
    const dataUrl = await response.json();
    const responseUrl = dataUrl.url;
    window.location.href = responseUrl;
  }
  
  // 네이버 로그인 페이지로 이동
  async function naverLogin() {
    const response = await fetch(`${backendBaseUrl}/api/accounts/social/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ social: "naver" }),
    });
    const dataUrl = await response.json();
    const responseUrl = dataUrl.url;
    window.location.href = responseUrl;
  }
  
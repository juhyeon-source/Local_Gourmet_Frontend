const frontendBaseUrl = "https://www.sparta-local-gourmet.store";
const backendBaseUrl = "http://3.38.191.229";
// 로그인 체크
function checkLogin() {
  const payload = localStorage.getItem("payload");
  if (payload) {
    window.location.replace(`${frontendBaseUrl}/`);
  }
}
checkLogin();

// 회원가입
async function handleSignup() {
  try {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const passwordCheck = document.getElementById("password-check").value;
    const gender = document.getElementById("gender").value;
    const phoneNumber = document.getElementById("phone_number").value;
    const addressSi = document.getElementById("address_si").value;
    const addressGu = document.getElementById("address_gu").value;
    const addressDetail = document.getElementById("address_detail").value;

    const formData = new FormData();

    if (username === "" || password === "" || passwordCheck === "") {
      alert("모든 필수 정보를 입력해주세요.");
      return;
    }
    if (password !== passwordCheck) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    formData.append("username", username);
    formData.append("password", password);
    formData.append("gender", gender);
    formData.append("phone_number", phoneNumber);
    formData.append("address_si", addressSi);
    formData.append("address_gu", addressGu);
    formData.append("address_detail", addressDetail);

    const profileImageInput = document.getElementById("profile_picture");
    if (profileImageInput.files.length > 0) {
      formData.append("profile_picture", profileImageInput.files[0]);
    }

    const response = await fetch(`${backendBaseUrl}/api/accounts/signup/`, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      // 회원가입 성공 시 바로 로그인
      const loginResponse = await fetch(`${backendBaseUrl}/api/accounts/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        localStorage.setItem("access", loginData.access);
        localStorage.setItem("refresh", loginData.refresh);
        localStorage.setItem("payload", JSON.stringify(loginData.payload));
        window.location.replace(`${frontendBaseUrl}/`);
      } else {
        const loginData = await loginResponse.json();
        alert(`로그인 실패: ${loginData.detail}`);
      }
    } else {
      const responseData = await response.json();
      if (responseData.error) {
        alert(responseData.error);
      } else {
        alert("회원가입에 실패했습니다. 다시 시도해주세요.");
      }
    }
  } catch (error) {
    console.error("Error during sign-up:", error);
    alert("잘못된 접근입니다.");
  }
}

// 회원가입 버튼
async function handleSignupButton() {
  await handleSignup();
}

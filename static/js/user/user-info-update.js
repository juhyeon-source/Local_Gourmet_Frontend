const frontendBaseUrl = "https://www.sparta-local-gourmet.store";
const backendBaseUrl = "http://3.38.191.229";

window.onload = () => {
  console.log("회원정보 수정 페이지 로드됨.");
  renderPage();
};

async function renderPage() {
  try {
    if (localStorage.getItem("access")) {
      const response = await fetch(`${backendBaseUrl}/api/accounts/me/`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access"),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();

      document.getElementById(
        "current-profile-img"
      ).src = `${backendBaseUrl}/${data.profile_picture}`;
      document.getElementById("email").value = data.email;
      document.getElementById("nickname").value = data.username;
      document.getElementById("gender").value = data.gender;
      document.getElementById("address_si").value = data.address_si;
      document.getElementById("address_gu").value = data.address_gu;
      document.getElementById("address_detail").value = data.address_detail;
      document.getElementById("phone_number").value = data.phone_number;
    } else {
      window.location.href = `${frontendBaseUrl}`;
    }

    const profileImgInput = document.getElementById("profile-img");
    profileImgInput.addEventListener("change", handleImagePreview);
  } catch (error) {
    alert("잘못된 접근입니다.");
  }
}

function handleImagePreview() {
  const profileImgInput = document.getElementById("profile-img");
  const previewImg = document.getElementById("current-profile-img");

  if (profileImgInput.files && profileImgInput.files[0]) {
    const reader = new FileReader();
    reader.onload = ({ target }) => {
      previewImg.src = target.result;
    };
    reader.readAsDataURL(profileImgInput.files[0]);
  } else {
    const payload = localStorage.getItem("payload");
    const payloadParse = JSON.parse(payload);
    previewImg.src = `${backendBaseUrl}${payloadParse.profile_picture}`;
  }
}

function openPasswordUpdateModal() {
  const passwordModal = document.getElementById("password-modal");

  if (passwordModal.style.display == "none") {
    passwordModal.style.display = "block";
  } else if (passwordModal.style.display == "block") {
    passwordModal.style.display = "none";

    document.getElementById("current-password").value = "";
    document.getElementById("new-password").value = "";
    document.getElementById("new-password-check").value = "";
  }
}

async function updatePasswordButton() {
  const current_password = document.getElementById("current-password").value;
  const new_password = document.getElementById("new-password").value;
  const new_password_check =
    document.getElementById("new-password-check").value;
  const password_pattern = /^(?=.*\d)(?=.*[~!@#$%^&*]).{8,20}$/;

  if (!current_password || !new_password || !new_password_check) {
    alert("모든 필수 정보를 입력해주세요.");
    return;
  }
  if (new_password != new_password_check) {
    alert("새 비밀번호가 새 비밀번호 확인과 일치하지 않습니다.");
    return;
  }
  if (!password_pattern.test(new_password)) {
    alert(
      "비밀번호는 8자 이상 20자 이하 및 숫자와 특수 문자(#?!@$~%^&*-)를 하나씩 포함시켜야 합니다."
    );
    return;
  }
  try {
    const response = await fetch(
      `${backendBaseUrl}/api/accounts/change-password/`,
      {
        method: "PATCH",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access"),
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          current_password: current_password,
          new_password: new_password,
          new_password_check: new_password_check,
        }),
      }
    );

    const responseJson = await response.json();
    console.log("Response JSON:", responseJson); // 디버깅용 로그
    const status = responseJson["status"];

    if (status == "200" && response.status == 200) {
      alert(`${responseJson["success"]}`);
      openPasswordUpdateModal();
      return;
    } else if (
      status == "400" &&
      response.status == 400 &&
      responseJson["error"]["password"]
    ) {
      alert(`${responseJson["error"]["password"]}`);
      return;
    } else if (status == "400" && response.status == 400) {
      alert(`${responseJson["error"]}`);
      return;
    } else if (status == "401" && response.status == 401) {
      alert(`${responseJson["error"]}`);
      return;
    }
  } catch (error) {
    console.error("Error during password update:", error); // 디버깅용 로그
    alert("새로고침 후 다시 시도해주세요.");
  }
}

function openUserDeleteModal() {
  const deldetModal = document.getElementById("delete-modal");

  if (deldetModal.style.display == "none") {
    deldetModal.style.display = "block";
    return;
  } else if (deldetModal.style.display == "block") {
    deldetModal.style.display = "none";

    document.getElementById("password").value = "";
    return;
  }
}

async function userDeleteButton() {
  const password = document.getElementById("password").value;

  try {
    if (password != "") {
      const response = await fetch(`${backendBaseUrl}/api/accounts/delete-account/`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: password }),
      });

      if (response.status === 204) {
        alert("계정이 성공적으로 삭제되었습니다.");
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("payload");
        window.location.replace(`${frontendBaseUrl}/`);
      } else {
        const responseJson = await response.json();
        if (response.status === 400) {
          alert(`${responseJson["error"]}`);
        } else if (response.status === 401) {
          alert(`${responseJson["error"]}`);
        }
      }
    } else {
      alert("비밀번호를 입력해주세요.");
    }
  } catch (error) {
    alert("다시 시도해주세요.");
    console.error("Error during account deletion:", error);
  }
}


async function handleUpdate() {
  const nickname = document.getElementById("nickname").value;
  const gender = document.getElementById("gender").value;
  const address_si = document.getElementById("address_si").value;
  const address_gu = document.getElementById("address_gu").value;
  const address_detail = document.getElementById("address_detail").value;
  const phone_number = document.getElementById("phone_number").value;
  const username = document.getElementById("nickname").value; // username 추가

  if (nickname.trim() === "") {
    alert("닉네임을 입력해주세요");
    return;
  }

  const data = new FormData();
  data.append("nickname", nickname);
  data.append("gender", gender);
  data.append("address_si", address_si);
  data.append("address_gu", address_gu);
  data.append("address_detail", address_detail);
  data.append("phone_number", phone_number);
  data.append("username", username); // username 추가

  const profileImageInput = document.getElementById("profile-img");
  if (profileImageInput.files.length > 0) {
    data.append("profile_picture", profileImageInput.files[0]);
  }

  try {
    const response = await fetch(`${backendBaseUrl}/api/accounts/me/`, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access"),
      },
      body: data,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error during update:", errorData);
      alert("업데이트 중 오류가 발생했습니다.");
      return;
    }

    alert("회원 정보가 성공적으로 수정되었습니다.");
    window.location.reload();
  } catch (error) {
    console.error("오류", error);
    alert("업데이트 중 오류가 발생했습니다.");
  }
}

async function updateButton() {
  await handleUpdate();
}

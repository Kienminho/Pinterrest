const btnLogin = $(".btn-login");
const loader = $(".loader");
const username = $("#email");
const password = $("#password");
const errorMessage = $(".message-errors");

//xử lý đăng nhập
btnLogin.on("click", () => {
  displayLoader();
  if (validateInfoLogin(username.val(), password.val())) {
    const data = {
      Email: username.val(),
      Password: password.val(),
    };

    fetch(`/api/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        hideLoader();
        if (res.statusCode === 200 || res.statusCode === 304) {
          if (res.data.Role === "admin") {
            //save token to local storage
            localStorage.setItem("data", JSON.stringify(res.data));
            window.location.href = "/admin/dashboard";
          } else {
            displayErrorMessage("Website không dành cho người dùng.");
          }
          //window.location.href = "/admin/dashboard";
        } else {
          password.val("");
          displayErrorMessage(res.message);
        }
      })
      .catch((err) => {
        password.val("");
        displayErrorMessage("Lỗi hệ thống vui lòng thử lại sau ít phút.");
      });
  } else {
    hideLoader();
    displayErrorMessage("Vui lòng nhập đầy đủ thông tin.");
  }
});

function validateInfoLogin(username, password) {
  if (username === "" || password === "") return false;
  return true;
}

function displayErrorMessage(message) {
  errorMessage.text(message).fadeIn("slow");
  setTimeout(function () {
    errorMessage.fadeOut("slow");
  }, 3000);
}

function displayLoader() {
  loader.removeClass("d-none");
  btnLogin.addClass("d-none");
}

function hideLoader() {
  loader.addClass("d-none");
  btnLogin.removeClass("d-none");
}

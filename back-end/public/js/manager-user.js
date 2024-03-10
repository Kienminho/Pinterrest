import { getToken, formatDate, createImageViewer } from "./base.js";
const loaderContainer = $(".loader-container");
const tbody = $(".tbody");
const token = getToken();

getUsers();

function getUsers() {
  loaderContainer.removeClass("d-none");
  fetch("/api/user/search?keyword=&pageSize=50&pageIndex=1", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  })
    .then((response) => response.json())
    .then((res) => {
      loaderContainer.addClass("d-none");
      displayData(res.data);
    })
    .catch((error) => {
      console.log(error);
    });
}

function displayData(arr) {
  tbody.empty();
  arr.map((item, index) => {
    //check if item.Category is null or undefined
    if (!item.Category) {
      item.Category = [];
    }
    let tr = `<tr>
                <td>${index + 1}</td>
                <td>
                <img src="${
                  item.Avatar
                }" alt="Avatar" class="cursor-pointer rounded-circle avatar-xs avatar-group align-items-center"/>
                  <i class="fab fa-angular fa-lg text-danger me-3"></i> <strong class="">${
                    item.UserName
                  }</strong></td>
                <td class= "email">${item.Email}</td>
                <td class= "gender">${item.Gender}</td>
                <td class= "birthday">${formatDate(item.Birthday)}</td>
                <td><span class="badge bg-label-primary me-1">${
                  item.Category.length
                }</span></td>
                <td>
                  <div class="dropdown">
                    <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                      <i class="bx bx-dots-vertical-rounded"></i>
                    </button>
                    <div class="dropdown-menu">
                      <a class="dropdown-item" href="javascript:void(0);"
                        ><i class="bx bx-edit-alt me-1"></i> Edit</a
                      >
                      <a class="dropdown-item" href="javascript:void(0);"
                        ><i class="bx bx-trash me-1"></i> Delete</a
                      >
                    </div>
                  </div>
                </td>
              </tr>`;
    tbody.append(tr);
  });
}

tbody.on("click", "img", function () {
  viewImage(this);
});

function viewImage(element) {
  createImageViewer(element);
}

import { getToken, formatDate, createImageViewer, showToast } from "./base.js";
const loaderContainer = $(".loader-container");
const tbody = $(".tbody");
const token = getToken();

let pageSize = 15;
let pageIndex = 1;
let keyword = "";
let loading = true;
let totalIndex = 0;

getUsers();

function getUsers() {
  loaderContainer.removeClass("d-none");
  fetchUsers();
}

function fetchUsers() {
  loading = true;
  fetch(
    `/api/user/search?keyword=${keyword}&pageSize=${pageSize}&pageIndex=${pageIndex}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }
  )
    .then((response) => response.json())
    .then((res) => {
      loaderContainer.addClass("d-none");
      displayData(res.data);
      if (res.data.length === pageSize) {
        // If there are more items, increment the pageIndex
        pageIndex += 1;
      } else {
        loading = false;
      }
    })
    .catch((error) => {
      console.log(error);
      loading = false;
    });
}

// Load more data when user scrolls to the end of the table
const debounceGetAttachments = _.debounce(() => {
  if (
    window.scrollY + window.innerHeight >=
      document.documentElement.scrollHeight &&
    loading == true
  ) {
    getUsers();
  }
}, 500);

window.addEventListener("scroll", debounceGetAttachments);

function displayData(arr) {
  arr.map((item) => {
    totalIndex++;
    //check if item.Category is null or undefined
    if (!item.Category) {
      item.Category = [];
    }
    let tr = /*html*/ `<tr>
      <td>${totalIndex}</td>
      <td class="d-none id">${item._id}</td>
      <td>
        <img
          src="${item.Avatar}"
          alt="Avatar"
          class="cursor-pointer rounded-circle avatar-xs avatar-group align-items-center"
        />
        <i class="fab fa-angular fa-lg text-danger me-3"></i>
        <strong class="">${item.UserName}</strong>
      </td>
      <td class="full-name">${item.FullName ?? "_"}</td>
      <td class="email">${item.Email}</td>
      <td class="gender">${item.Gender}</td>
      <td class="birthday">${formatDate(item.Birthday)}</td>
      <td>
        <span class="badge bg-label-primary me-1">${item.Category.length}</span>
      </td>
      <td>
        <span class="created">${formatDate(item.CreatedAt)}</span>
      </td>
      <td>
        <div class="dropdown">
          <button
            type="button"
            class="btn p-0 dropdown-toggle hide-arrow"
            data-bs-toggle="dropdown"
          >
            <i class="bx bx-dots-vertical-rounded"></i>
          </button>
          <div class="dropdown-menu">
            <a class="dropdown-item d-none" href="javascript:void(0);"
              ><i class="bx bx-edit-alt me-1"></i> Edit</a
            >
            <a class="dropdown-item delete-user" href="javascript:void(0);"
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
  createImageViewer(this);
});

//delete user
tbody.on("click", ".delete-user", function () {
  let tr = $(this).closest("tr");
  let id = tr.find(".id").text();
  fetch(`/api/user/delete-account/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  })
    .then((response) => response.json())
    .then((res) => {
      if (res.statusCode === 200) {
        tr.remove();
        showToast("Xoá tài khoản thành công!", true);
      } else {
        showToast(res.message, false);
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

// Debounce the searchAttachments function
const debouncedSearchAttachments = _.debounce(searchAttachments, 500);

// Search
function searchAttachments() {
  keyword = $(".search").val();
  tbody.empty();
  totalIndex = 0;
  pageIndex = 1;
  getUsers();
}

$(".search").on("input", () => {
  debouncedSearchAttachments();
});

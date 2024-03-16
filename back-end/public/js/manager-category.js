import { getToken, formatDate, showToast } from "./base.js";
const token = getToken();
const loaderContainer = $(".loader-container");
const tbody = $(".tbody");
const name = $("#category-name");
const desc = $("#desc");

let pageIndex = 1; // Track the current page index
let keyword = ""; // Track the current keyword
let loading = false; // Track if data is currently being loaded
let totalIndex = 0;

getCategories();

function getCategories() {
  loaderContainer.removeClass("d-none");
  fetchCategories();
}

function fetchCategories() {
  loading = true;
  fetch(
    `/api/category/get-all-categories?keyword=${keyword}&pageSize=50&pageIndex=${pageIndex}`,
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

      if (res.data.length === 50) {
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
    getAttachments();
  }
}, 500);

// Use event delegation
$(document).on("click", ".deleted-file", function () {
  let tr = $(this).closest("tr");
  let id = tr.find(".id").text();
  fetch(`/api/category/delete-category/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  })
    .then((response) => response.json())
    .then((res) => {
      if (res.statusCode === 200) {
        showToast("Xoá thành công!", true);
        tr.remove();
      } else {
        showToast("Xoá thất bại!", false);
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

//show modal update-category-modal when click on update button
$(document).on("click", ".update-category", function () {
  let tr = $(this).closest("tr");
  let id = tr.find(".id").text();
  let name = tr.find(".category-name").text();
  let desc = tr.find(".desc").text();
  if (desc === "_") desc = "";

  // Set the values in the modal
  $("#update-category-modal").modal("show");
  $("#update-category-modal .id-category").val(id);
  $("#update-category-modal #category-name-update").val(name);
  $("#update-category-modal #desc-update").val(desc);
});

//update category
$(".btn-update-category").on("click", function () {
  let id = $("#update-category-modal .id-category").val();
  let name = $("#update-category-modal #category-name-update").val();
  let desc = $("#update-category-modal #desc-update").val();

  if (validate(name)) {
    showToast("Tên không được để trống!", false);
    return;
  }

  fetch("/api/category/update-category", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      id,
      name,
      desc,
    }),
  })
    .then((response) => response.json())
    .then((res) => {
      if (res.statusCode === 200) {
        showToast("Cập nhật thành công!", true);
        $("#update-category-modal").modal("hide");
        searchAttachments();
      } else {
        $("#update-category-modal").modal("hide");
        showToast(res.message, false);
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

window.addEventListener("scroll", debounceGetAttachments);

function displayData(arr) {
  arr.map((item) => {
    totalIndex++;

    let tr = /*html*/ `<tr>
          <td class ="id d-none">${item._id}</td>
          <td>${totalIndex}</td>
          <td><i class="fab fa-angular fa-lg text-danger me-3"></i>
          <strong class="category-name">${item.Name ?? "_"}</strong></td>
          
          <td class="desc">${item.Description ?? "_"}</td>
          <td class="created-date">${formatDate(item.CreatedAt)}</td>
          <td class="updated-date">${formatDate(item.UpdatedAt)}</td>
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
            <a class="dropdown-item update-category" href="javascript:void(0);"><i
                          class="bx bx-edit-alt me-1"></i>Cập nhật</a>
              <a class="dropdown-item deleted-file" href="javascript:void(0);"
                ><i class="bx bx-trash me-1"></i> Xoá</a
              >
            </div>
          </div>
        </td>
      </tr>`;
    tbody.append(tr);
  });
}

const debouncedSearchAttachments = _.debounce(searchAttachments, 500);

// Search
function searchAttachments() {
  keyword = $(".search").val();
  tbody.empty();
  totalIndex = 0;
  pageIndex = 1;
  getCategories();
}

$(".search").on("input", () => {
  debouncedSearchAttachments();
});

//create category
$(".btn-add-category").on("click", createCategory);

function createCategory() {
  if (validate(name.val())) {
    showToast("Tên không được để trống!", false);
    return;
  }

  const listCategory = [
    {
      Name: name.val(),
      Description: desc.val(),
    },
  ];

  fetch("/api/category/create-category", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({ listCategory }),
  })
    .then((response) => response.json())
    .then((res) => {
      if (res.statusCode === 200) {
        $("#create-employee-modal").modal("hide");
        showToast("Tạo danh mục thành công!", true);
        name.val("");
        desc.val("");
        searchAttachments();
      } else {
        showToast(res.message, false);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}
//validate name
function validate(name) {
  return !name;
}

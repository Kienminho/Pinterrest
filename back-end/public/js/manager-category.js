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
        tr.remove(); // Use 'tr' directly since it's already a jQuery object
      } else {
        showToast("Xoá thất bại!", false);
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
            <a class="dropdown-item d-none" href="javascript:void(0);"><i
                          class="bx bx-edit-alt me-1"></i>Kích hoạt</a>
              <a class="dropdown-item deleted-file" href="javascript:void(0);"
                ><i class="bx bx-trash me-1"></i> Delete</a
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

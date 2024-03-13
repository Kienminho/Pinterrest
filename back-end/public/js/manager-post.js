import {
  sanity_url,
  getToken,
  createImageViewer,
  formatDate,
  showToast,
} from "./base.js";
const loaderContainer = $(".loader-container");
const tbody = $(".tbody");
const token = getToken();

let pageIndex = 1; // Track the current page index
let keyword = ""; // Track the current keyword
let loading = false; // Track if data is currently being loaded
let totalIndex = 0;

getPosts();

function getPosts() {
  console.log(pageIndex);
  loaderContainer.removeClass("d-none");
  fetchPosts();
}

function fetchPosts() {
  loading = true;
  fetch(
    `/api/post/search?keyword=${keyword}&pageSize=50&pageIndex=${pageIndex}`,
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
      showToast("Vui lòng thử lại sau ít phút!", false);
      loading = false;
    });
}

function displayData(arr) {
  arr.map((item) => {
    totalIndex++;
    let label = item.IsComment ? "bg-label-success" : "bg-label-danger";
    let tr = /*html*/ `<tr>
              <td class ="id d-none">${item._id}</td>
              <td>${totalIndex}</td>
              <td><i class="fab fa-angular fa-lg text-danger"></i>
              <strong class="title">${item.Title ?? "_"}</strong></td>
              <td class="desc">${item.Description}</td>
              <td>
              <img
              src="${item.Attachment.Thumbnail}"
              alt="Image"
              class="cursor-pointer avatar-xl avatar-group align-items-center"
              />
              </td>
              <td class="comment">${item.TotalComment ?? "_"}</td>
              <td class="isComment"><span class="badge ${label} me-1">${
      item.IsComment ? "Có" : "Không"
    }</span></td>
              <td class="created">${item.Created.UserName}</td>
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
                <a class="dropdown-item" href="javascript:void(0);"><i
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

tbody.on("click", "img", function () {
  createImageViewer(this);
});

const debouncedSearchAttachments = _.debounce(searchPosts, 500);

// Search
function searchPosts() {
  keyword = $(".search").val();
  tbody.empty();
  totalIndex = 0;
  pageIndex = 1;
  getPosts();
}

$(".search").on("input", () => {
  debouncedSearchAttachments();
});

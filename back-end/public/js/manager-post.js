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

let filePath;
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
                <a class="dropdown-item download-file" href="javascript:void(0);"><i
                              class="bx bx-edit-alt me-1"></i>Tải ảnh</a>
                              <a class="dropdown-item update-post" href="javascript:void(0);"
                    ><i class="bx bx-trash me-1"></i> Cập nhật</a
                  >
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

//update post, isComment is checkbox
tbody.on("click", ".update-post", function () {
  const tr = $(this).closest("tr");
  const id = tr.find(".id").text();
  const title = tr.find(".title").text();
  const desc = tr.find(".desc").text();
  const isComment = tr.find(".isComment").text().includes("Có") ? true : false;
  $("#update-post-modal").modal("show");
  $("#update-post-name").val(title);
  $("#update-desc").val(desc);
  $("#update-is-comment").prop("checked", isComment);
  $("#id").val(id);
});

$(".btn-update-post").on("click", function () {
  const title = $("#update-post-name").val();
  const desc = $("#update-desc").val();
  const isComment = $("#update-is-comment").is(":checked");
  const id = $("#id").val();
  const data = {
    PostId: id,
    Title: title,
    Description: desc,
    IsComment: isComment,
  };
  fetch(`/api/post/update-post`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((res) => {
      if (res.statusCode === 200) {
        //hide modal and reset form
        $("#update-post-modal").modal("hide");
        $("#update-post-name").val("");
        $("#update-desc").val("");
        showToast("Cập nhật bài viết thành công!", true);
        searchPosts();
      } else {
        showToast(res.error, false);
      }
    });
});

//download file from image link
tbody.on("click", ".download-file", function () {
  const tr = $(this).closest("tr");
  const title = tr.find(".title").text();
  const img = tr.find("img").attr("src");

  //download image using fetch and set name for imag
  fetch(img)
    .then((response) => response.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", title + ".jpg");
      document.body.appendChild(link);
      link.click();
      link.remove();
    });
});

$(document).on("click", ".deleted-file", function () {
  let tr = $(this).closest("tr");
  let id = tr.find(".id").text();
  fetch(`/api/post/delete-post/${id}`, {
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

const myDropzone = new Dropzone("#my-drop-zone", {
  url: "/api/file/upload-images",
  previewsContainer: null, // Disable default preview container
  clickable: true, // Allow clicking to add files
  maxFiles: 1, // Limit to one file
  maxFilesize: 5, // Max file size in MB
  previewsContainer: null,
  acceptedFiles: "image/*", // Accept only images
  headers: {
    Authorization: `Bearer ${token}`,
  },
  init: function () {
    this.on("addedfile", function (file) {
      // Remove the previous file if there is one
      if (this.files.length > 1) {
        this.removeFile(this.files[0]);
      }
    });
    this.on("success", function (file, res) {
      console.log(res); // This should contain the path to the uploaded image
      filePath = res.data;
    });
  },
});

$(".btn-add-post").on("click", function () {
  if (validatePost()) {
    const title = $("#post-name").val();
    const desc = $("#desc").val();
    const isComment = $("#is-comment").is(":checked");
    const data = {
      Title: title,
      Description: desc,
      IsComment: isComment,
      File: filePath,
    };

    fetch("/api/post/admin-create-post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.statusCode === 200) {
          //hide modal and reset form
          $("#create-post-modal").modal("hide");
          $("#post-name").val("");
          $("#desc").val("");
          filePath = {};
          myDropzone.removeAllFiles();
          showToast("Thêm bài viết thành công!", true);
          searchPosts();
        } else {
          showToast(res.error, false);
        }
      });
  }
});

//validate post-name, description and filePath
function validatePost() {
  const title = $("#post-name").val();
  if (!title) {
    showToast("Vui lòng nhập tên bài viết!", false);
    return false;
  }
  if (!filePath) {
    showToast("Vui lòng chọn ảnh bài viết!", false);
    return false;
  }
  return true;
}

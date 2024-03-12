import { getToken, formatDate, createImageViewer, showToast } from "./base.js";
const sanity_url = "https://cdn.sanity.io/";
const loaderContainer = $(".loader-container");
const tbody = $(".tbody");
const token = getToken();

let pageIndex = 1; // Track the current page index
let keyword = ""; // Track the current keyword
let loading = false; // Track if data is currently being loaded
let totalIndex = 0;

getAttachments();

function getAttachments() {
  console.log(pageIndex);
  loaderContainer.removeClass("d-none");
  fetchAttachments();
}

function fetchAttachments() {
  loading = true;
  fetch(
    `/api/file/get-all-attachments?keyword=${keyword}&pageSize=50&pageIndex=${pageIndex}`,
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
}, 500); // Debounce for 500 milliseconds

window.addEventListener("scroll", debounceGetAttachments);

function displayData(arr) {
  arr.map((item) => {
    totalIndex++;
    let created = item.CreatedName;

    if (item.AttachmentType === "AI") {
      created = "AI";
    }

    let tr = /*html*/ `<tr>
        <td class ="id d-none">${item._id}</td>
        <td>${totalIndex}</td>
        <td><i class="fab fa-angular fa-lg text-danger me-3"></i>
        <strong class="file-name">${item.FileName ?? "_"}</strong></td>
        <td>
        <img
        src="${sanity_url + item.FilePath}"
        alt="Image"
        class="cursor-pointer avatar-xl avatar-group align-items-center"
        />
        </td>
        <td class="file-size">${
          parseFloat(item.FileSize.toFixed(2)) ?? "_"
        } MB</td>
        <td class="file-type">${item.FileType}</td>
        <td class="created">${created}</td>
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

// Use event delegation
$(document).on("click", ".deleted-file", function () {
  let tr = $(this).closest("tr");
  let id = tr.find(".id").text();
  fetch(`/api/file/delete-attachment/${id}`, {
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

// Debounce the searchAttachments function
const debouncedSearchAttachments = _.debounce(searchAttachments, 500);

// Search
function searchAttachments() {
  keyword = $(".search").val();
  tbody.empty();
  totalIndex = 0;
  pageIndex = 1;
  getAttachments();
}

$(".search").on("input", () => {
  debouncedSearchAttachments();
});

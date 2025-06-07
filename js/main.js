var siteName = document.getElementById("siteName");
var siteURL = document.getElementById("siteURL");
var addBtn = document.getElementById("addBtn");
var updateBtn = document.getElementById("updateBtn");
var searchInput = document.getElementById("searchInput");
var sitesContainer = document.getElementById("sitesContainer");
var siteList = [];
if (localStorage.getItem("sites") != null) {
  siteList = JSON.parse(localStorage.getItem("sites"));
  displaySites();
}

// Function to handle the add site button click
function addSite() {
  if (ValidationInputs(siteName) && ValidationInputs(siteURL)) {
    var site = {
      id: Date.now(),
      name: siteName.value,
      url: siteURL.value,
    };
    siteList.push(site);
    localStorage.setItem("sites", JSON.stringify(siteList));
    displaySites();
    clearForm();
  }
}

// Function to display the list of sites
function displaySites(list = siteList) {
  var box = `<table class="table table-striped table-bordered table-hover shadow-sm align-middle text-center">
      <thead class="table-warning">
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Visit</th>
          <th>Edit</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>`;
  for (var i = 0; i < list.length; i++) {
    box += `
      <tr>
        <td>${i + 1}</td>
        <td>${list[i].name.toUpperCase()}</td>
        <td>
          <button class="btn btn-success text-white font-pt-sans-caption" onclick="window.open('${formatUrl(list[i].url)}', '_blank')">
            <i class="fa-solid fa-eye"></i> Visit
          </button>
        </td>
        <td>
          <button class="btn btn-warning font-pt-sans-caption" onclick="updateSite(${i})">
            <i class="fa-solid fa-pen-to-square"></i> Edit
          </button>
        </td>
        <td>
          <button class="btn btn-danger text-white font-pt-sans-caption" onclick="deleteSite(${list[i].id})">
            <i class="fa-solid fa-trash-can"></i> Delete
          </button>
        </td>
      </tr>
    `;
  }
  box += `
      </tbody>
    </table>
  `;
  sitesContainer.innerHTML = box;
}

// Function to clear the form inputs
function clearForm() {
  siteName.value = "";
  siteURL.value = "";
}

// Function to delete a site by its ID
function deleteSite(id) {
  for (var i = 0; i < siteList.length; i++) {
    if (siteList[i].id == id) {
      siteList.splice(i, 1);
      break;
    }
  }
  localStorage.setItem("sites", JSON.stringify(siteList));
  displaySites();
}

// Function to handle the update button click
var globalIndex;
function updateSite(index) {
  globalIndex = index;
  addBtn.classList.add("d-none");
  updateBtn.classList.remove("d-none");
  siteName.value = siteList[index].name;
  siteURL.value = siteList[index].url;
}

// Function to handle the update button click
function finalUpdate() {
  addBtn.classList.remove("d-none");
  updateBtn.classList.add("d-none");
  siteList[globalIndex].name = siteName.value;
  siteList[globalIndex].url = siteURL.value;
  localStorage.setItem("sites", JSON.stringify(siteList));
  displaySites();
  clearForm();
}

// Search function to filter sites based on input
function searchSite() {
  var searchArr = [];
  var term = searchInput.value.trim().toLowerCase();
  for (var i = 0; i < siteList.length; i++) {
    if (siteList[i].name.toLowerCase().includes(term) == true)
      searchArr.push(siteList[i]);
  }
  displaySites(searchArr);
}

// Validation function for inputs
function ValidationInputs(input) {
  var Regex = {
    siteName: /^[A-Za-z0-9]{3,30}$/,
    siteURL:
      /^(https?:\/\/)?([\w\-]+\.)+[\w\-]{2,}(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i,
  };

  if (Regex[input.id].test(input.value)) {
    input.classList.add("is-valid");
    input.classList.remove("is-invalid");
    input.nextElementSibling.classList.add("d-none");
    return true;
  } else {
    input.classList.add("is-invalid");
    input.classList.remove("is-valid");
    input.nextElementSibling.classList.remove("d-none");
    return false;
  }
}

// Check validity of inputs
function checkValidity() {
  if (ValidationInputs(siteName) && ValidationInputs(siteURL))
    addBtn.removeAttribute("disabled");
  else addBtn.setAttribute("disabled", true);
}
siteName.addEventListener("input", checkValidity);
siteURL.addEventListener("input", checkValidity);

// Format URL to ensure it starts with "https://"
function formatUrl(url) {
  var httpsRegex = /^https?:\/\//i;
  if (httpsRegex.test(url)) {
    return url;
  } else {
    return `https://${url}`;
  }
}

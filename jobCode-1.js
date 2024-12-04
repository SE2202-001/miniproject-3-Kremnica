//job code
document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const fileInput = document.getElementById("upload-json");
  const jobListings = document.getElementById("job-listings");
  const jobDetails = document.getElementById("job-details");
  const filterLevel = document.getElementById("filter-level");
  const filterType = document.getElementById("filter-type");
  const filterSkill = document.getElementById("filter-skill");

  // Job Data
  let jobs = [];
  let filteredJobs = [];

  // Load JSON File
  fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        jobs = JSON.parse(e.target.result);
        filteredJobs = [...jobs];
        populateFilters();
        displayJobs(filteredJobs);
      } catch (error) {
        alert("Invalid JSON file. Please upload a valid file.");
        console.error(error);
      }
    };
    reader.readAsText(file);
  });

  // Display Jobs (titles only)
  function displayJobs(jobs) {
    jobListings.innerHTML = ""; // Clear previous jobs
    if (jobs.length === 0) {
      jobListings.innerHTML = "<p>No jobs match the criteria.</p>";
      return;
    }

    jobs.forEach((job) => {
      const jobDiv = document.createElement("div");
      jobDiv.classList.add("job");

      // Display only the job title
      jobDiv.innerHTML = `
        <h3 class="job-title">${job.Title}</h3>
      `;

      // Add click event to reveal detailed job information
      jobDiv.addEventListener("click", () => {
        displayJobDetails(job);
      });

      jobListings.appendChild(jobDiv);
    });
  }

  // Display Job Details
  function displayJobDetails(job) {
    // Populate the job details section
    jobDetails.innerHTML = `
      <h3>${job.Title}</h3>
      <p><strong>Posted:</strong> ${job.Posted}</p>
      <p><strong>Type:</strong> ${job.Type}</p>
      <p><strong>Level:</strong> ${job.Level}</p>
      <p><strong>Skill:</strong> ${job.Skill || "N/A"}</p>
      <p><strong>Details:</strong> ${job.Detail || "No additional details available."}</p>
      <a href="${job["Job Page Link"]}" target="_blank">View Job Page</a>
    `;
  }

  // Populate Filters
  function populateFilters() {
    const levels = [...new Set(jobs.map((job) => job.Level))];
    const types = [...new Set(jobs.map((job) => job.Type))];
    const skills = [...new Set(jobs.map((job) => job.Skill || "N/A"))];

    populateDropdown(filterLevel, levels);
    populateDropdown(filterType, types);
    populateDropdown(filterSkill, skills);
  }

  function populateDropdown(dropdown, options) {
    dropdown.innerHTML = `<option value="">All</option>`; // Default option
    options.forEach((option) => {
      const opt = document.createElement("option");
      opt.value = option;
      opt.textContent = option;
      dropdown.appendChild(opt);
    });
  }

  // Filter Jobs
  function filterJobs() {
    const level = filterLevel.value;
    const type = filterType.value;
    const skill = filterSkill.value;

    filteredJobs = jobs.filter((job) => {
      return (
        (level === "" || job.Level === level) &&
        (type === "" || job.Type === type) &&
        (skill === "" || (job.Skill || "N/A") === skill)
      );
    });

    displayJobs(filteredJobs);
  }

  // Add Event Listeners for Filters
  filterLevel.addEventListener("change", filterJobs);
  filterType.addEventListener("change", filterJobs);
  filterSkill.addEventListener("change", filterJobs);
});
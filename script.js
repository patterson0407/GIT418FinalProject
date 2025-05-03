"use strict";

$(document).ready(function () {
  const projectsJsonUrl = "projects.json";
  const localStorageKey = "alchemistVisitorName_AP";

  $("#milestones-accordion").accordion({
    heightStyle: "content",
    collapsible: true,
    active: false,
    header: "> h3"
  });

  $(".hero-carousel").slick({
    dots: true,
    infinite: true,
    speed: 500,
    fade: true,
    cssEase: "linear",
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    arrows: true,
    adaptiveHeight: false
  });

  function loadProjects() {
    const $projectGrid = $("#project-grid");
    const $loadingIndicator = $("#loading-indicator");

    $loadingIndicator.show();
    $projectGrid.empty();

    $.ajax({
      url: projectsJsonUrl,
      dataType: "json",
      timeout: 10000
    })
      .done(function (data) {
        setTimeout(function () {
          $loadingIndicator.hide();

          if (Array.isArray(data) && data.length > 0) {
            $.each(data, function (index, project) {
              const title = $("<div>").text(project.title || "Untitled Project").html();
              const description = $("<div>").text(project.description || "No description available.").html();
              const imageUrl = $("<div>").text(project.image || "placeholder.png").html();
              const techList = Array.isArray(project.tech) ? project.tech : [];
              const githubLink = $("<div>").text(project.github_link || "#").html();
              const liveLink = $("<div>").text(project.live_link || "#").html();

              let techHtml = "";
              techList.forEach((tech) => {
                const safeTech = $("<div>").text(tech).html();
                techHtml += `<span>${safeTech}</span>`;
              });

              const projectCard = `
                <article class="project-card" style="animation-delay: ${index * 0.1}s;">
                  <div class="project-image">
                    <img src="${imageUrl}" alt="${title} screenshot or mockup" loading="lazy">
                  </div>
                  <div class="project-content">
                    <h3>${title}</h3>
                    <p class="project-description">${description}</p>
                    <div class="project-tech">${techHtml}</div>
                    <div class="project-links">
                      ${githubLink !== "#" ? `<a href="${githubLink}" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i> GitHub</a>` : ""}
                      ${liveLink !== "#" ? `<a href="${liveLink}" target="_blank" rel="noopener noreferrer"><i class="fas fa-external-link-alt"></i> Live Demo</a>` : ""}
                    </div>
                  </div>
                </article>
              `;

              $projectGrid.append(projectCard);
            });
          } else {
            $projectGrid.html('<p class="error-message">No projects found or data is invalid.</p>');
          }
        }, 300);
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        $loadingIndicator.hide();
        let errorMsg = "Failed to summon project data. Please try again later.";
        if (jqXHR.status === 404) {
          errorMsg = `Error: Could not find '${projectsJsonUrl}'.`;
        } else if (textStatus === "parsererror") {
          errorMsg = `Error: Invalid JSON format in '${projectsJsonUrl}'.`;
        }
        $projectGrid.html(`<p class="error-message">${errorMsg}</p>`);
      });
  }

  loadProjects();

  const $visitorNameInput = $("#visitorName");
  const $saveNameBtn = $("#save-name-btn");
  const $welcomeGreeting = $("#welcome-greeting");
  const $formStatus = $("#form-status");

  function showStatusMessage(message, isError = false) {
    $formStatus
      .text(message)
      .css("color", isError ? "var(--accent-color)" : "var(--glow-color)")
      .addClass("visible")
      .delay(3500)
      .queue(function (next) {
        $(this).removeClass("visible");
        next();
      });
  }

  try {
    const storedName = localStorage.getItem(localStorageKey);
    if (storedName) {
      const sanitizedName = $("<div>").text(storedName).html();
      $welcomeGreeting.text(`Welcome back, ${sanitizedName}!`).show();
      $visitorNameInput.val(sanitizedName);
    }
  } catch (e) {
    console.warn("localStorage not available", e);
  }

  $saveNameBtn.on("click", function () {
    const currentName = $visitorNameInput.val().trim();
    if (currentName) {
      try {
        localStorage.setItem(localStorageKey, currentName);
        const sanitizedName = $("<div>").text(currentName).html();
        showStatusMessage(`Name '${sanitizedName}' remembered!`);
        $welcomeGreeting.text(`Welcome, ${sanitizedName}!`).show();
      } catch (e) {
        console.error("Error saving to localStorage:", e);
        showStatusMessage("Could not remember name. Storage might be full or disabled.", true);
        if (e.name === "QuotaExceededError") {
          alert("Browser storage is full. Could not save name.");
        }
      }
    } else {
      showStatusMessage("Please enter a name first.", true);
    }
  });

  $("#contact-form").on("submit", function (event) {
    event.preventDefault();
    let isValid = true;
    $(this).find("input[required], textarea[required]").each(function () {
      if (!$(this).val()) isValid = false;
    });

    if (isValid) {
      showStatusMessage("Transmission simulated. Thank you!");
    } else {
      showStatusMessage("Please fill out all required fields.", true);
    }
  });

  $("#current-year").text(new Date().getFullYear());
});

document.getElementById('theme-toggle').addEventListener('click', function() {
    document.body.classList.toggle('light-mode');
  });

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('.progress-bar').forEach(bar => {
      const value = bar.dataset.value;
      if (value) {
        bar.style.width = value + '%';
      }
    });
  });
  
// Show/Hide "Other" for disability
const disability = document.getElementById("disability");
const otherDisabilityWrap = document.getElementById("otherDisabilityWrap");
if (disability) {
  disability.addEventListener("change", () => {
    otherDisabilityWrap.classList.toggle("hidden", disability.value !== "Other");
  });
}

// Show experience fields if "Experienced"
const experienceStatus = document.getElementById("experienceStatus");
const experiencedBlock = document.getElementById("experiencedBlock");
if (experienceStatus) {
  experienceStatus.addEventListener("change", () => {
    experiencedBlock.classList.toggle("hidden", experienceStatus.value !== "Experienced");
  });
}

// Password strength (very simple)
const pwd = document.getElementById("password");
const meter = document.getElementById("pwdStrength");
if (pwd && meter) {
  pwd.addEventListener("input", () => {
    const v = pwd.value || "";
    let score = 0;
    if (v.length >= 8) score++;
    if (/[A-Z]/.test(v)) score++;
    if (/\d/.test(v)) score++;
    if (/[^A-Za-z0-9]/.test(v)) score++;
    const levels = ["Weak", "Fair", "Moderate", "Strong"];
    meter.textContent = `Password strength: ${levels[Math.min(score - 1, 3)] || "Weak"}`;
  });
}

// Generic multi-select handler (checkbox menu → chips + hidden input of CSV)
function initMulti(menuId, outputId, hiddenName, otherWrapId = null) {
  const menu = document.getElementById(menuId);
  const output = document.getElementById(outputId);
  if (!menu || !output) return;

  // Ensure there's a hidden input for posting values
  let hidden = document.querySelector(`input[name="${hiddenName}"]`);
  if (!hidden) {
    hidden = document.createElement("input");
    hidden.type = "hidden";
    hidden.name = hiddenName;
    menu.parentElement.appendChild(hidden);
  }

  const update = () => {
    const checks = [...menu.querySelectorAll('input[type="checkbox"]:checked')];
    const values = checks.map((c) => c.value);
    // Update chips
    output.innerHTML = "";
    values.forEach((val) => {
      const chip = document.createElement("span");
      chip.className = "chip";
      chip.textContent = val;

      const x = document.createElement("button");
      x.type = "button";
      x.setAttribute("aria-label", `Remove ${val}`);
      x.textContent = "✕";
      x.addEventListener("click", () => {
        const target = menu.querySelector(`input[type="checkbox"][value="${val}"]`);
        if (target) {
          target.checked = false;
          update();
        }
      });

      chip.appendChild(x);
      output.appendChild(chip);
    });

    // Store as CSV; server will convert to array
    hidden.value = values.join(",");

    // If "Other" involved, show matching input
    if (otherWrapId) {
      const showOther = values.includes("Other");
      document.getElementById(otherWrapId)?.classList.toggle("hidden", !showOther);
    }
  };

  // Listen to changes
  menu.addEventListener("change", update);

  // Initialize once in case of pre-checked items
  update();
}

// Wire multi-selects
initMulti("techMenu", "techOutput", "technicalSkills", "otherTechnicalSkillsWrap");
initMulti("nonTechMenu", "nonTechOutput", "nonTechnicalSkills", "otherNonTechnicalSkillsWrap");
initMulti("assistMenu", "assistOutput", "assistiveTech", "otherAssistiveTechWrap");
initMulti("physicalMenu", "physicalOutput", "physicalRequirements");
initMulti("accomMenu", "accomOutput", "accommodation", "otherAccommodationWrap");
initMulti("trainMenu", "trainOutput", "training");

// Basic client-side file size reminder (doesn't replace server limit)
const form = document.getElementById("jobForm");
if (form) {
  form.addEventListener("submit", (e) => {
    const image = form.querySelector('input[name="image"]')?.files?.[0];
    const doc = form.querySelector('input[name="document"]')?.files?.[0];
    const limit = 500 * 1024; // 500 KB
    if (image && image.size > limit) {
      e.preventDefault();
      alert("Image file too large (max 500 KB). Please compress it.");
      return;
    }
    if (doc && doc.size > limit) {
      e.preventDefault();
      alert("Document file too large (max 500 KB). Please compress it.");
      return;
    }

    // Convert CSV hidden inputs back to multiple fields for server:
    // server already accepts CSV and converts to array, so this is optional.
  });
}

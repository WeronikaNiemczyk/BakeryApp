import {
  sections as initialSections,
  employees as initialEmployees,
  products,
} from "./utilities/data.js";

(async function () {
  const sectionSelect = document.getElementById("section");
  const employeeSelect = document.getElementById("employee");
  const productContainer = document.getElementById("products");
  const adminLoginButton = document.getElementById("admin-login");
  const adminPanel = document.getElementById("admin-panel");
  const removeSectionSelect = document.getElementById("remove-section");
  const adminSectionSelect = document.getElementById("admin-section");
  const removeEmployeeSelect = document.getElementById("remove-employee");
  const addSectionButton = document.getElementById("add-section");
  const newSectionInput = document.getElementById("new-section");
  const deleteSectionButton = document.getElementById("delete-section");

  const ADMIN_PIN = "1234";

  let sections =
    JSON.parse(localStorage.getItem("sections")) || initialSections;
  let employees =
    JSON.parse(localStorage.getItem("employees")) || initialEmployees;

  function saveToLocalStorage() {
    localStorage.setItem("sections", JSON.stringify(sections));
    localStorage.setItem("employees", JSON.stringify(employees));
  }

  function updateSectionOptions() {
    sectionSelect.innerHTML = "";
    removeSectionSelect.innerHTML = "";
    adminSectionSelect.innerHTML = "";

    sections.forEach((section) => {
      const option = document.createElement("option");
      option.value = section.section;
      //   console.log("section", section.section);
      //   console.log("option", option);
      option.textContent = section.section;
      sectionSelect.appendChild(option);
      removeSectionSelect.appendChild(option.cloneNode(true));
      adminSectionSelect.appendChild(option.cloneNode(true));
    });
  }

  function updateEmployeeOptions(selectedSection) {
    employeeSelect.innerHTML = "";
    removeEmployeeSelect.innerHTML = "";
    const sectionEmployees = employees.filter(
      (e) => e.section === selectedSection
    );
    // console.log("employees", employees);
    // console.log("sectionEmployees", sectionEmployees);
    // console.log("sectionSelect ", sectionSelect);
    sectionEmployees.forEach((employee) => {
      const option = document.createElement("option");
      option.value = employee.id;
      option.textContent = employee.name;
      employeeSelect.appendChild(option);
      removeEmployeeSelect.appendChild(option.cloneNode(true));
    });
  }
  adminLoginButton.addEventListener("click", () => {
    const pin = prompt("Enter Admin PIN:");
    if (pin === ADMIN_PIN) {
      adminPanel.style.display = "block";
    } else {
      alert("Incorrect PIN!");
    }
  });
  addSectionButton.addEventListener("click", () => {
    const newSectionName = newSectionInput.value.trim();
    console.log("newSectionName", newSectionName);
    if (!newSectionName) {
      alert("Wprowadź nazwę sekcji.");
      return;
    }
    if (sections.some((s) => s.section === newSectionName)) {
      alert("Ta nazwa sekcji juz istnieje.");
      return;
    }
    sections.push({ section: newSectionName });
    alert(`Sekcja '${newSectionName}' została dodana.`);
    newSectionInput.value = "";
    saveToLocalStorage();
    updateSectionOptions();
  });
  deleteSectionButton.addEventListener("click", () => {
    const sectionToDelete = removeSectionSelect.value;
    console.log("removeSectionSelect", sectionToDelete);
    if (!sectionToDelete) {
      alert("Wybierz sekcję do usunięcia.");
      return;
    }
    sections = sections.filter((s) => s.section !== sectionToDelete);
    employees = employees.filter((e) => e.section !== sectionToDelete);
    alert(`Sekcja '${sectionToDelete}' i jej pacownicy zostali usunięci.`);
    saveToLocalStorage();
    updateSectionOptions();
  });
  document.getElementById("employee-next").addEventListener("click", () => {
    const selectedEmployee = employeeSelect.value;
    if (!selectedEmployee) {
      alert("Please select an employee.");
      return;
    }
    populateProducts();
    document.getElementById("employee-select").style.display = "none";
    document.getElementById("product-list").style.display = "block";
  });
  document.getElementById("save").addEventListener("click", () => {
    const selectedSection = sectionSelect.value;
    const selectedEmployee = employeeSelect.value;
    const productQuantities = Array.from(
      productContainer.querySelectorAll("input")
    ).map((input) => ({
      code: input.dataset.code,
      quantity: parseInt(input.value, 10) || 0,
    }));
    console.log("Section:", selectedSection);
    console.log("Employee ID:", selectedEmployee);
    console.log("Product Quantities:", productQuantities);

    alert("Document saved successfully!");
  });
  document.getElementById("send").addEventListener("click", () => {
    alert("Document sent to Optima!");
  });

  function populateProducts() {
    productContainer.innerHTML = "";
    products.forEach(({ name, code }) => {
      const div = document.createElement("div");
      div.innerHTML = `<label>${name}</label><input type="number" data-code="${code}" min="0">`;
      productContainer.appendChild(div);
    });
  }

  document.getElementById("section-next").addEventListener("click", () => {
    const selectedSection = sectionSelect.value;
    if (!selectedSection) {
      alert("Please select a section.");
      return;
    }
    updateEmployeeOptions(selectedSection);
    document.getElementById("section-select").style.display = "none";
    document.getElementById("employee-select").style.display = "block";
  });

  updateSectionOptions();
})();

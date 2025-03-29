document.addEventListener("DOMContentLoaded", () => {
  const mapElement = document.getElementById("map");
  const coordinatesElement = document.getElementById("coordinates");

  // Default map location (India)
  const defaultLocation = { lat: 20.5937, lng: 78.9629 };

  // Create the map
  const map = new google.maps.Map(mapElement, {
    center: defaultLocation,
    zoom: 5,
  });

  // Create a marker
  const marker = new google.maps.Marker({
    position: defaultLocation,
    map: map,
    draggable: true,
  });

  // Update coordinates display
  const updateCoordinates = (lat, lng) => {
    coordinatesElement.textContent = `Latitude: ${lat.toFixed(
      6
    )}, Longitude: ${lng.toFixed(6)}`;
  };

  // Initialize with default coordinates
  updateCoordinates(defaultLocation.lat, defaultLocation.lng);

  // Listen for marker drag events
  google.maps.event.addListener(marker, "dragend", (event) => {
    const newLat = event.latLng.lat();
    const newLng = event.latLng.lng();
    updateCoordinates(newLat, newLng);
  });

  // Listen for map click events to move the marker
  google.maps.event.addListener(map, "click", (event) => {
    const clickedLat = event.latLng.lat();
    const clickedLng = event.latLng.lng();
    marker.setPosition(event.latLng);
    updateCoordinates(clickedLat, clickedLng);
  });
  // Handle Solar Potential Mapper inputs
  const monthlyBillInput = document.getElementById("monthly-bill");
  const rooftopSizeInput = document.getElementById("rooftop-size");
  const monthlyBillButton = monthlyBillInput.nextElementSibling;
  const rooftopSizeButton = rooftopSizeInput.nextElementSibling;

  monthlyBillButton.addEventListener("click", () => {
    const monthlyBill = parseFloat(monthlyBillInput.value);
    if (!isNaN(monthlyBill) && monthlyBill > 0) {
      alert(`Your monthly bill is ₹${monthlyBill}`);
    } else {
      alert("Please enter a valid monthly bill amount.");
    }
  });

  rooftopSizeButton.addEventListener("click", () => {
    const rooftopSize = parseFloat(rooftopSizeInput.value);
    if (!isNaN(rooftopSize) && rooftopSize > 0) {
      alert(`Your rooftop size is ${rooftopSize} sq ft.`);
    } else {
      alert("Please enter a valid rooftop size.");
    }
  });

  // Handle Feasibility Checker inputs
  const unitCostInput = document.getElementById("unit-cost");
  const unitCostButton = unitCostInput.nextElementSibling;
  const feasibilityStatus = document.querySelector(".feasibility-status p");

  unitCostButton.addEventListener("click", () => {
    const unitCost = parseFloat(unitCostInput.value);
    if (!isNaN(unitCost) && unitCost > 0) {
      const powerConsumedPerYear = calculatePowerConsumed();
      const powerProduced = calculatePowerProduced();
      const investmentNeeded = calculateInvestmentNeeded(powerProduced);

      updateResults(powerConsumedPerYear, powerProduced, investmentNeeded);

      if (investmentNeeded > 0 && powerProduced > powerConsumedPerYear) {
        feasibilityStatus.innerHTML = `<span class="status-feasible">FEASIBLE</span>`;
      } else {
        feasibilityStatus.innerHTML = `<span class="status-not-feasible">NOT FEASIBLE</span>`;
      }
    } else {
      alert("Please enter a valid per unit cost.");
    }
  });

  // Handle icon selection in Feasibility Checker
  const iconBoxes = document.querySelectorAll(".icon-box");
  iconBoxes.forEach((box) => {
    box.addEventListener("click", () => {
      iconBoxes.forEach((b) => b.classList.remove("active"));
      box.classList.add("active");
    });
  });

  // Calculation functions
  function calculatePowerConsumed() {
    // Placeholder calculation (replace with actual logic)
    return 5000; // kWh per year
  }

  function calculatePowerProduced() {
    const rooftopSize = parseFloat(rooftopSizeInput.value);
    const efficiencyFactor = 15; // Assumed average production in kWh/sq ft per year
    return rooftopSize > 0 ? rooftopSize * efficiencyFactor : 0;
  }

  function calculateInvestmentNeeded(powerProduced) {
    const costPerKw = 50000; // Assumed investment cost per kW
    return powerProduced > 0 ? (powerProduced / 1000) * costPerKw : 0;
  }

  function updateResults(powerConsumed, powerProduced, investment) {
    const [powerConsumedInput, powerProducedInput, investmentInput] =
      document.querySelectorAll(".bottom-section input");
    powerConsumedInput.value = `${powerConsumed} kWh/year`;
    powerProducedInput.value = `${powerProduced} kWh/year`;
    investmentInput.value = `₹${investment.toLocaleString()}`;
  }
});

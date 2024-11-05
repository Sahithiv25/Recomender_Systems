document.addEventListener("DOMContentLoaded", () => {
  const recommendationsContainer = document.getElementById("recommendations");
  const recommendationForm = document.getElementById("recommendationForm");

  recommendationForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const skinType = document.getElementById("skinType").value;
    const productName = document.getElementById("productInput").value;

    if (!skinType || !productName) {
      alert("Please select a skin type and enter a product name.");
      return;
    }

    recommendationsContainer.innerHTML = '';  // Clear previous recommendations

    try {
      // Send GET request to Flask API with product name and skin type
      const response = await fetch(`http://127.0.0.1:5000/get_recommendations?skinType=${encodeURIComponent(skinType)}&productName=${encodeURIComponent(productName)}`);
      const recommendations = await response.json();

      localStorage.setItem(`recommendations_${Date.now()}`, JSON.stringify(recommendations));

      displayRecommendations(recommendations);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      recommendationsContainer.innerHTML = '<p class="text-center text-danger">Failed to load recommendations.</p>';
    }
  });

  function displayRecommendations(recommendations) {
    recommendationsContainer.innerHTML = '';  // Clear previous recommendations
    recommendations.forEach((product) => {
      const card = document.createElement("div");
      card.className = "col-md-4 mb-3";
      card.innerHTML = `
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">${product.Brand}</h5>
            <p class="card-text">${product.Name}</p>
            <p class="card-text"><strong>Price:</strong> $${product.Price}</p>
            <button class="btn btn-outline-primary"><i class="fas fa-heart"></i> Add to Favorites</button>
          </div>
        </div>
      `;
      recommendationsContainer.appendChild(card);
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("showPreviousRecommendations").addEventListener("click", () => {
    const previousRecommendationsContainer = document.getElementById("previousRecommendations");
    previousRecommendationsContainer.innerHTML = '';  // Clear previous contents

    // Loop over all localStorage keys to find saved recommendations
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("recommendations_")) {
        const recommendations = JSON.parse(localStorage.getItem(key));
        
        // Create a section for each recommendation set with a timestamp header
        const section = document.createElement("div");
        section.className = "mb-4";
        section.innerHTML = `<h5>Recommendations from ${new Date(parseInt(key.split('_')[1])).toLocaleString()}:</h5>`;

        const recommendationsContainer = document.createElement("div");
        recommendationsContainer.className = "row";

        recommendations.forEach((product) => {
          const card = document.createElement("div");
          card.className = "col-md-4 mb-3";
          card.innerHTML = `
            <div class="card h-100">
              <div class="card-body">
                <h5 class="card-title">${product.Brand}</h5>
                <p class="card-text">${product.Name}</p>
                <p class="card-text"><strong>Price:</strong> $${product.Price}</p>
              </div>
            </div>
          `;
          recommendationsContainer.appendChild(card);
        });

        section.appendChild(recommendationsContainer);
        previousRecommendationsContainer.appendChild(section);
      }
    });

    // Display a message if no previous recommendations are found
    if (previousRecommendationsContainer.innerHTML === '') {
      previousRecommendationsContainer.innerHTML = '<p class="text-center text-muted">No previous recommendations found.</p>';
    }
  });
});

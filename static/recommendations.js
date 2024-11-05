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


document.addEventListener("DOMContentLoaded", function () {
    let allItems = [];

    // Fetch Data from `data.json`
    fetch("data.json")
        .then(response => response.json())
        .then(data => {
            allItems = data;
            displayItems(allItems);
        })
        .catch(error => console.error("Error loading menu:", error));

    // Function to Display Items in Menu
    function displayItems(items) {
        const menuContainer = document.getElementById("menu");
        menuContainer.innerHTML = ""; // Clear previous items

        items.forEach(item => {
            const card = document.createElement("div");
            card.classList.add("card");

            card.innerHTML = `
                <img src="${item.image}" alt="${item.title}">
                <div class="card-content">
                    <div class="card-title">${item.title}</div>
                    
                    <button class="toggle-details">Show Details</button>

                    <div class="details">
                        <div class="card-description">${item.description}</div>
                        <div class="tag">${item.tag}</div>
                        
                        <div class="nutrition-info">
                            <h4>Nutrition Information</h4>
                            <div class="nutrition-item"><span>Calories</span><strong>${item.calories}</strong></div>
                            <div class="nutrition-item"><span>Protein</span> <div class="progress-bar"><div class="progress" style="width: ${item.protein_percent};"></div></div> <span>${item.protein}</span></div>
                            <div class="nutrition-item"><span>Carbs</span> <div class="progress-bar"><div class="progress" style="width: ${item.carbs_percent};"></div></div> <span>${item.carbs}</span></div>
                            <div class="nutrition-item"><span>Fat</span> <div class="progress-bar"><div class="progress" style="width: ${item.fat_percent};"></div></div> <span>${item.fat}</span></div>
                        </div>
                    </div>

                    <div class="price">${item.price}</div>
                    <button class="button add-to-cart">+ Add to Cart</button>
                </div>
            `;

            menuContainer.appendChild(card);
        });

        attachDetailEventListeners();
    }

    // 🔹 Function to Attach Event Listeners for Detail Toggle
    function attachDetailEventListeners() {
        document.querySelectorAll(".toggle-details").forEach(button => {
            button.addEventListener("click", function () {
                const card = this.closest(".card"); // Get the closest card element
                card.classList.toggle("expanded"); // Toggle expanded class

                const details = card.querySelector(".details"); // Get details section
                if (card.classList.contains("expanded")) {
                    details.style.display = "block"; // Show details
                    setTimeout(() => details.style.opacity = "1", 50); // Smooth fade-in
                    this.textContent = "Hide Details"; // Change button text
                } else {
                    details.style.opacity = "0"; // Smooth fade-out
                    setTimeout(() => details.style.display = "none", 300); // Hide after fade-out
                    this.textContent = "Show Details"; // Change button text
                }
            });
        });
    }

    // 🔹 Search Menu Items
   // 🔹 Attach Event Listener to Search Bar
document.getElementById("searchBar").addEventListener("input", searchMenu);

// 🔹 Search Menu Items
function searchMenu() {
    const searchQuery = document.getElementById("searchBar").value.toLowerCase().trim();

    if (searchQuery === "") {
        displayItems(allItems); // Show all items if search is empty
        return;
    }

    const filteredItems = allItems.filter(item => 
        item.title.toLowerCase().includes(searchQuery) ||
        item.description.toLowerCase().includes(searchQuery) ||
        item.category.toLowerCase().includes(searchQuery)
    );

    displayItems(filteredItems);
}


    // 🔹 Category Button Click Event
    document.querySelectorAll(".menu-category").forEach(button => {
        button.addEventListener("click", () => {
            const category = button.dataset.category;
            activateButton(category);

            if (category === "all") {
                displayItems(allItems);
            } else {
                const filteredItems = allItems.filter(item => item.category === category);
                displayItems(filteredItems);
            }
        });
    });

    // 🔹 Function to Activate Button
    function activateButton(category) {
        document.querySelectorAll(".menu-category").forEach(button => {
            button.classList.remove("active");
            if (button.dataset.category === category) {
                button.classList.add("active");
            }
        });
    }

    // 🔹 Add Items to Cart
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("add-to-cart")) {
            const card = event.target.closest(".card");

            const item = {
                image: card.querySelector("img").src,
                title: card.querySelector(".card-title").textContent,
                description: card.querySelector(".card-description").textContent,
                price: card.querySelector(".price").textContent,
                quantity: 1
            };

            let existingItem = cart.find(cartItem => cartItem.title === item.title);

            if (existingItem) {
                existingItem.quantity += 1; // Increase quantity
            } else {
                cart.push(item);
            }

            localStorage.setItem("cart", JSON.stringify(cart)); // Save cart
            alert(`${item.title} added to cart!`);
        }
    });

    // 🔹 Redirect Users if Not Logged In
    const userName = localStorage.getItem("userName"); 
    const userLoggedIn = localStorage.getItem("userLoggedIn");

    if (userLoggedIn === "true" && userName) {
        alert(`Welcome, ${userName} To Our Menu Section! 🎉`);
    } else {
        window.location.href = "sign-up.html"; // Redirect if not signed-up in
    }

    // 🔹 Mobile Menu Toggle
    document.querySelector(".menu-toggle").addEventListener("click", function () {
        document.querySelector(".nav ul").classList.toggle("active");
    });
});

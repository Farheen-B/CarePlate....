let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Function to Display Cart Items
function displayCartItems() {
    let cartContainer = document.getElementById("cart-items");
    let totalPriceContainer = document.getElementById("total-price");
    cartContainer.innerHTML = ""; // Clear previous content
    let total = 0;

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>Your cart is empty.</p>";
        totalPriceContainer.textContent = "";
        return;
    }

    cart.forEach((item, index) => {
        total += parseFloat(item.price.replace("$", "")) * item.quantity;

        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");
        cartItem.innerHTML = `
            <div>
                <h4>${item.title}</h4>
                <p>${item.price} each</p>
            </div>
            <input type="number" value="${item.quantity}" min="1" data-index="${index}">
            <button class="remove-item" data-index="${index}">🗑️</button>
        `;

        cartContainer.appendChild(cartItem);
    });

    totalPriceContainer.textContent = `Total: $${total.toFixed(2)}`;
}

// Function to Update Quantity
document.addEventListener("change", function (event) {
    if (event.target.type === "number") {
        let index = event.target.getAttribute("data-index");
        cart[index].quantity = parseInt(event.target.value);
        localStorage.setItem("cart", JSON.stringify(cart));
        displayCartItems();
    }
});

// Function to Remove an Item
document.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-item")) {
        let index = event.target.getAttribute("data-index");
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        displayCartItems();
    }
});

// Load Cart Items
document.addEventListener("DOMContentLoaded", displayCartItems);
if (cart.length === 0) {
    document.getElementById("place-order").disabled = true;
} else {
    document.getElementById("place-order").disabled = false;
}
// Flag to check if the order form has been displayed
let orderFormDisplayed = false;

// Function to Handle Place Order Button Click
document.getElementById("place-order").addEventListener("click", function () {
    // If the order form is already displayed, don't show it again
    if (orderFormDisplayed) {
        return;
    }

    // Check if the cart is empty
    if (cart.length === 0) {
        // Display a message or prevent action if the cart is empty
        alert("Your cart is empty. Please add items before placing an order.");
        return; // Exit the function if the cart is empty
    }

    let cartContainer = document.getElementById("cart-items");
    let totalPriceContainer = document.getElementById("total-price");

    // Hide the cart items and total price temporarily
    cartContainer.style.display = "none";
    totalPriceContainer.style.display = "none";

    // Create a form for collecting phone number and address
    const orderForm = document.createElement("div");
    orderForm.classList.add("order-form");

    orderForm.innerHTML = `
        <h3>Please provide your details to complete the order:</h3>
        <label for="phone-number">Phone Number:</label>
        <input type="text" id="phone-number" placeholder="Enter your phone number" required>
        <label for="address">Address:</label>
        <textarea id="address" placeholder="Enter your address" required></textarea>
        <button id="submit-order">Submit Order</button>
    `;

    // Insert the form into the page
    cartContainer.insertAdjacentElement("afterend", orderForm);

    // Mark the order form as displayed
    orderFormDisplayed = true;

    // Handle form submission
    document.getElementById("submit-order").addEventListener("click", function () {
        let phoneNumber = document.getElementById("phone-number").value;
        let address = document.getElementById("address").value;

        // Validate phone number and address
        if (!phoneNumber || !address) {
            // Show message inside the form instead of an alert
            const errorMessage = document.createElement("p");
            errorMessage.style.color = 'red';
            errorMessage.textContent = "Both phone number and address are required!";
            orderForm.appendChild(errorMessage);
            return;
        }

        // Display order placed message
        const orderPlacedMessage = document.createElement("div");
        orderPlacedMessage.classList.add("order-placed-message");
        orderPlacedMessage.innerHTML = `
            <h3>Your order has been placed!</h3>
            <p>We will deliver it soon as it gets ready. Thank you for your order!</p>
        `;
        cartContainer.insertAdjacentElement("afterend", orderPlacedMessage);

        // Hide the Place Order Button after the order is placed
        document.getElementById("place-order").style.display = "none";

        // Clear the cart
        cart = [];
        localStorage.setItem("cart", JSON.stringify(cart));
        displayCartItems(); // Refresh cart view

        // Hide the order form
        orderForm.style.display = "none";
    });
});

// Function to check and disable "Place Order" button if cart is empty
function checkCart() {
    if (cart.length === 0) {
        document.getElementById("place-order").disabled = true; // Disable button if cart is empty
        document.getElementById("place-order").style.backgroundColor = "#ddd"; // Optionally style the button to show it's disabled
    } else {
        document.getElementById("place-order").disabled = false; // Enable button if items are in cart
        document.getElementById("place-order").style.backgroundColor = "#4CAF50"; // Restore button color
    }
}

// Call checkCart whenever cart is updated
checkCart();

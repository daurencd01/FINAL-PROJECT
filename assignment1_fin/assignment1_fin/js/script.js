$(document).ready(function() {
    $(".cart-items-container .checkout").click(function() {
        var existingCartItems = $(".cart-item");
        if (existingCartItems.length > 0) {
            window.location.href = "successful.html";
        }
    });

    $(".add_el").click(function () {
        var itemName = $(this).data("name");
        var itemPrice = $(this).data("price");
        var itemImage = $(this).data("image");

        var existingCartItem = $(".cart-item").filter(function() {
            return $(this).find(".content h3").text() === itemName;
        });

        if (existingCartItem.length > 0) {
            var quantityElement = existingCartItem.find(".quantity");
            var quantity = parseInt(quantityElement.text());
            quantityElement.text(quantity + 1);
        } else {
            var newCartItem = $("<div>", {
                "class": "cart-item",
                html: `
                    <span class="fas fa-times remove-item"></span>
                    <img src="${itemImage}" alt="">
                    <div class="content">
                        <h3>${itemName}</h3>
                        <div class="price">${itemPrice}</div>
                    </div>`
            });

            var quantityCounter = $("<div>", {
                "class": "quantity-counter",
                html: `
                    <button class="decrement">-</button>
                    <span class="quantity">1</span>
                    <button class="increment">+</button>`
            });
            newCartItem.append(quantityCounter);
            $(".cart-items-container").append(newCartItem);
        }
        updateTotalCost();
    });

    $(document).on("click", ".remove-item", function() {
        $(this).closest(".cart-item").remove();
        updateTotalCost();
    });

    $(document).on("click", ".increment", function() {
        var quantityElement = $(this).siblings(".quantity");
        var quantity = parseInt(quantityElement.text());
        quantityElement.text(quantity + 1);
        updateTotalCost();
    });

    $(document).on("click", ".decrement", function() {
        var quantityElement = $(this).siblings(".quantity");
        var quantity = parseInt(quantityElement.text());
        if (quantity > 1) {
            quantityElement.text(quantity - 1);
            updateTotalCost();
        }
    });

    // Функционал для поиска
    $("#search-box").on("input", function () {
        const query = $(this).val().toLowerCase(); // Получаем введённый текст
        const items = $(".menu .box, .products .box"); // Находим все элементы меню и продуктов

        items.each(function () {
            const name = $(this).find("h3").text().toLowerCase(); // Название элемента
            if (name.includes(query)) {
                $(this).show(); // Показываем элемент, если он соответствует запросу
            } else {
                $(this).hide(); // Скрываем элемент, если он не соответствует
            }
        });
    });

});

function updateTotalCost() {
    var totalCost = 0;
    $(".cart-item").each(function() {
        var price = parseFloat($(this).find(".price").text().replace("$", ""));
        var quantity = parseInt($(this).find(".quantity").text());
        totalCost += price * quantity;
    });

    $(".price_out").text("$" + totalCost.toFixed(2));
}

// Navbar функционал
let navbar = document.querySelector('.navbar');

document.querySelector('#menu-btn').onclick = () => {
    navbar.classList.toggle('active');
    searchForm.classList.remove('active');
    cartItem.classList.remove('active');
}

let searchForm = document.querySelector('.search-form');

document.querySelector('#search-btn').onclick = () => {
    searchForm.classList.toggle('active');
    navbar.classList.remove('active');
    cartItem.classList.remove('active');
}

let cartItem = document.querySelector('.cart-items-container');

document.querySelector('#cart-btn').onclick = () => {
    cartItem.classList.toggle('active');
    navbar.classList.remove('active');
    searchForm.classList.remove('active');
}

window.onscroll = () => {
    navbar.classList.remove('active');
    searchForm.classList.remove('active');
    cartItem.classList.remove('active');
}

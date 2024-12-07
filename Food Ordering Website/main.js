document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartItemsCount = document.querySelector('.cart-icon span');
    const cartItemsList = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.cart-total');
    const cartIcon = document.querySelector('.cart-icon');
    const sidebar = document.querySelector('.sidebar');
    const checkoutButton = document.querySelector('.checkout-btn');
    const cashInput = document.querySelector('#cash-input');
    const submitPaymentBtn = document.querySelector('.submit-payment-btn');
    const changeSection = document.querySelector('.change-section');
    const changeAmount = document.querySelector('#change-amount');

    let cartItems = [];
    let totalAmount = 0;

    addToCartButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            const item = {
                name: document.querySelectorAll('.card .card-title')[index].textContent,
                price: parseFloat(
                    document.querySelectorAll('.price')[index].textContent.slice(1)
                ),
                quantity: 1,
            };
            
            const existingItem = cartItems.find(
                (cartItem) => cartItem.name === item.name
            );
            if (existingItem){
                existingItem.quantity++;
            } else {
                cartItems.push(item);
            }
            totalAmount += item.price;
            updateCartUI();
        });
    });

    function updateCartUI() {
        updateCartItemCount(cartItems.length);
        updateCartItemList();
        updateCartTotal();
    }

    function updateCartItemCount(count) {
        if (cartItemsCount) {
            cartItemsCount.textContent = count;
        } else {
            console.error('Cart item count element not found!');
        }
    }

    function updateCartItemList() {
        if (!cartItemsList) {
            console.error('Cart items list element not found!');
            return;
        }
        cartItemsList.innerHTML = '';
        cartItems.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item', 'individual-cart-item');
            cartItem.innerHTML = `
                <span>(${item.quantity}x) ${item.name}</span>
                <span class="cart-item-price">₱${(item.price * item.quantity).toFixed(2)}
                <button class="remove-btn" data-index="${index}"><i class="fa-solid fa-times"></i></button>
                </span>
            `;
            cartItemsList.append(cartItem);
        });

        const removeButtons = document.querySelectorAll('.remove-btn');
        removeButtons.forEach((button) => {
            button.addEventListener('click', (event) => {
                const index = event.target.dataset.index;
                removeItemFromCart(index);
            });
        });
    }

    function removeItemFromCart(index) {
        const removeItem = cartItems.splice(index, 1)[0];
        totalAmount -= removeItem.price * removeItem.quantity;
        updateCartUI();
    }

    function updateCartTotal() {
        if (cartTotal) {
            cartTotal.textContent = `₱${totalAmount.toFixed(2)}`;
        } else {
            console.error('Cart total element not found!');
        }
    }

    cartIcon.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    const closeButton = document.querySelector('.sidebar-close');
    closeButton.addEventListener('click', () => {
        sidebar.classList.remove('open');
    });

    checkoutButton.addEventListener('click', () => {
        if (totalAmount === 0) {
            alert('Your cart is empty!');
            return;
        }
        sidebar.classList.add('open');
        
    });
    checkoutButton.addEventListener('click', () => {
        const userCash = parseFloat(cashInput.value);

        
        if (isNaN(userCash) || userCash <= 0) {
            alert('Please enter a valid amount of cash.');
            return;
        }
        if (userCash >= totalAmount) {
            const change = userCash - totalAmount;
            changeSection.style.display = 'block';
            changeAmount.textContent = `₱${change.toFixed(2)}`;
            //alert(`Thank you for your purchase! Your change is ₱${change.toFixed(2)}.`);
            // Clear cart after checkout
            cartItems = [];
            totalAmount = 0;
            updateCartUI();
            sidebar.classList.add('open');
        } else {
            alert(`Insufficient funds! You need ₱${(totalAmount - userCash).toFixed(2)} more.`);
        }
    });
    
    
});

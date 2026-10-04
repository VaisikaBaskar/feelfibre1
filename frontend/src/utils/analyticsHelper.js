export const calculateFunnelMetrics = (data) => {
    let views = parseInt(data.views) || 0;
    let addToCart = parseInt(data.addToCart !== undefined ? data.addToCart : data.cart) || 0;
    let checkout = parseInt(data.checkout) || 0;
    let purchased = parseInt(data.purchased) || 0;

    // Enforce logical funnel property: Views >= Add To Cart >= Checkout >= Purchased
    // 1. Views must be at least Add To Cart
    views = Math.max(views, addToCart);

    // 2. Checkout cannot exceed Add To Cart
    checkout = Math.min(checkout, addToCart);

    // 3. Purchased cannot exceed Checkout
    purchased = Math.min(purchased, checkout);

    // Abandoned Cart: accurately represents Users who initiated a cart but never successfully purchased.
    const abandonedCart = Math.max(0, addToCart - purchased);

    return {
        productViews: views,
        addToCartCount: addToCart,
        checkoutCount: checkout,
        purchasedCount: purchased,
        abandonedCart: abandonedCart
    };
};

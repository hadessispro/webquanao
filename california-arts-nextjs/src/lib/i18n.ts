export type Locale = 'en' | 'vi'

export type TranslationKey =
  | 'address'
  | 'apartmentOptional'
  | 'apply'
  | 'bankTransfer'
  | 'cart'
  | 'cashOnDelivery'
  | 'checking'
  | 'checkout'
  | 'city'
  | 'closeCart'
  | 'closeSearch'
  | 'color'
  | 'completeYourOrder'
  | 'contact'
  | 'continueShopping'
  | 'countryLabel'
  | 'countryRegion'
  | 'decreaseQuantity'
  | 'delivery'
  | 'detailsSavedNextTime'
  | 'details'
  | 'discountApplied'
  | 'discountError'
  | 'discountPlaceholder'
  | 'district'
  | 'email'
  | 'emptyCart'
  | 'increaseQuantity'
  | 'itemDefault'
  | 'firstName'
  | 'languageToggle'
  | 'lastName'
  | 'menu'
  | 'method'
  | 'newsOffers'
  | 'needAssistance'
  | 'notesOptional'
  | 'openCart'
  | 'openSearch'
  | 'orderReceived'
  | 'orderSubmitError'
  | 'orderSummary'
  | 'payment'
  | 'phone'
  | 'placeOrder'
  | 'placingOrder'
  | 'postalCodeOptional'
  | 'remove'
  | 'returningCustomer'
  | 'savedAfterCheckout'
  | 'savedCustomerLoaded'
  | 'savedDetailsNextVisit'
  | 'search'
  | 'secureCheckout'
  | 'addToBag'
  | 'shipping'
  | 'shippingCalculated'
  | 'shippingReturns'
  | 'shopAll'
  | 'size'
  | 'sizeFit'
  | 'selectSize'
  | 'soldOut'
  | 'styleWith'
  | 'sustainability'
  | 'subtotal'
  | 'submitSearch'
  | 'suggestedForYou'
  | 'total'
  | 'unavailable'
  | 'recentlyViewed'
  | 'recentlyViewedEmpty'

export const LOCALE_STORAGE_KEY = 'california_arts_locale'

const DICTIONARY: Record<Locale, Record<TranslationKey, string>> = {
  en: {
    address: 'Address',
    apartmentOptional: 'Apartment, suite, etc. optional',
    apply: 'Apply',
    bankTransfer: 'Bank transfer',
    cart: 'Cart',
    cashOnDelivery: 'Cash on delivery',
    checking: 'Checking',
    checkout: 'Checkout',
    city: 'City',
    closeCart: 'Close cart',
    closeSearch: 'Close search',
    color: 'Color',
    completeYourOrder: 'Complete your order',
    contact: 'Contact',
    continueShopping: 'Continue Shopping',
    countryLabel: 'Vietnam | VND ₫',
    countryRegion: 'Country/Region',
    decreaseQuantity: 'Decrease quantity',
    delivery: 'Delivery',
    detailsSavedNextTime: 'Your details will be saved for next time.',
    details: 'Details',
    discountApplied: 'Discount applied.',
    discountError: 'Discount code could not be applied.',
    discountPlaceholder: 'Discount code or gift card',
    district: 'District',
    email: 'Email',
    emptyCart: 'Your cart is empty',
    increaseQuantity: 'Increase quantity',
    itemDefault: 'Default',
    firstName: 'First name',
    languageToggle: 'Switch language',
    lastName: 'Last name',
    menu: 'Menu',
    method: 'Method',
    newsOffers: 'Email me with news and offers',
    needAssistance: 'Need Assistance?',
    notesOptional: 'Notes optional',
    openCart: 'Open cart',
    openSearch: 'Open search',
    orderReceived: 'Order received.',
    orderSubmitError: 'Order could not be submitted.',
    orderSummary: 'Order Summary',
    payment: 'Payment',
    phone: 'Phone',
    placeOrder: 'Place Order',
    placingOrder: 'Placing Order',
    postalCodeOptional: 'Postal code optional',
    remove: 'Remove',
    returningCustomer: 'Returning customer',
    savedAfterCheckout: 'Saved after checkout',
    savedCustomerLoaded: 'Saved customer details loaded.',
    savedDetailsNextVisit: 'Your checkout details are saved for the next visit.',
    search: 'Search',
    secureCheckout: 'Secure checkout',
    addToBag: 'Add To Bag',
    shipping: 'Shipping',
    shippingCalculated: 'Calculated after confirmation',
    shippingReturns: 'Shipping & Returns',
    shopAll: 'Shop All',
    size: 'Size',
    sizeFit: 'Size & Fit',
    selectSize: 'Select Size',
    soldOut: 'Sold Out',
    styleWith: 'Style With',
    sustainability: 'Sustainability',
    subtotal: 'Subtotal',
    submitSearch: 'Submit search',
    suggestedForYou: 'Suggested For You',
    total: 'Total',
    unavailable: 'Unavailable',
    recentlyViewed: 'Recently Viewed',
    recentlyViewedEmpty: 'Recently viewed products will appear here.',
  },
  vi: {
    address: 'Địa chỉ',
    apartmentOptional: 'Căn hộ, tòa nhà, ghi chú thêm',
    apply: 'Áp dụng',
    bankTransfer: 'Chuyển khoản',
    cart: 'Giỏ hàng',
    cashOnDelivery: 'Thanh toán khi nhận hàng',
    checking: 'Đang kiểm tra',
    checkout: 'Thanh toán',
    city: 'Thành phố',
    closeCart: 'Đóng giỏ hàng',
    closeSearch: 'Đóng tìm kiếm',
    color: 'Màu',
    completeYourOrder: 'Hoàn tất đơn hàng',
    contact: 'Liên hệ',
    continueShopping: 'Tiếp tục mua sắm',
    countryLabel: 'Việt Nam | VND ₫',
    countryRegion: 'Quốc gia/Khu vực',
    decreaseQuantity: 'Giảm số lượng',
    delivery: 'Giao hàng',
    detailsSavedNextTime: 'Thông tin sẽ được lưu cho lần mua sau.',
    details: 'Chi tiết',
    discountApplied: 'Đã áp dụng mã giảm giá.',
    discountError: 'Không thể áp dụng mã giảm giá.',
    discountPlaceholder: 'Mã giảm giá hoặc thẻ quà tặng',
    district: 'Quận/Huyện',
    email: 'Email',
    emptyCart: 'Giỏ hàng đang trống',
    increaseQuantity: 'Tăng số lượng',
    itemDefault: 'Mặc định',
    firstName: 'Tên',
    languageToggle: 'Đổi ngôn ngữ',
    lastName: 'Họ',
    menu: 'Menu',
    method: 'Phương thức',
    newsOffers: 'Nhận tin tức và ưu đãi qua email',
    needAssistance: 'Cần hỗ trợ?',
    notesOptional: 'Ghi chú thêm',
    openCart: 'Mở giỏ hàng',
    openSearch: 'Mở tìm kiếm',
    orderReceived: 'Đã nhận đơn hàng.',
    orderSubmitError: 'Không thể gửi đơn hàng.',
    orderSummary: 'Tóm tắt đơn hàng',
    payment: 'Thanh toán',
    phone: 'Số điện thoại',
    placeOrder: 'Đặt hàng',
    placingOrder: 'Đang đặt hàng',
    postalCodeOptional: 'Mã bưu chính',
    remove: 'Xóa',
    returningCustomer: 'Khách hàng quay lại',
    savedAfterCheckout: 'Lưu sau khi thanh toán',
    savedCustomerLoaded: 'Đã tải thông tin khách hàng đã lưu.',
    savedDetailsNextVisit: 'Thông tin thanh toán đã được lưu cho lần sau.',
    search: 'Tìm kiếm',
    secureCheckout: 'Thanh toán bảo mật',
    addToBag: 'Thêm vào túi',
    shipping: 'Vận chuyển',
    shippingCalculated: 'Tính sau khi xác nhận',
    shippingReturns: 'Vận chuyển & đổi trả',
    shopAll: 'Xem tất cả',
    size: 'Kích cỡ',
    sizeFit: 'Kích cỡ & phom dáng',
    selectSize: 'Chọn kích cỡ',
    soldOut: 'Hết hàng',
    styleWith: 'Phối cùng',
    sustainability: 'Bền vững',
    subtotal: 'Tạm tính',
    submitSearch: 'Gửi tìm kiếm',
    suggestedForYou: 'Gợi ý cho bạn',
    total: 'Tổng cộng',
    unavailable: 'Không khả dụng',
    recentlyViewed: 'Đã xem gần đây',
    recentlyViewedEmpty: 'Sản phẩm đã xem gần đây sẽ hiển thị tại đây.',
  },
}

export function readStoredLocale(): Locale {
  if (typeof window === 'undefined') return 'en'

  return window.localStorage.getItem(LOCALE_STORAGE_KEY) === 'vi' ? 'vi' : 'en'
}

export function translate(locale: Locale, key: TranslationKey) {
  return DICTIONARY[locale][key]
}

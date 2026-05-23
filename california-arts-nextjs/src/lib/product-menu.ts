export type ProductMenuGroup = {
  href?: string;
  items?: Array<{
    href?: string;
    label: string;
  }>;
  title: string;
};

export const PRODUCT_MENU_GROUPS: ProductMenuGroup[] = [
  {
    title: "áo",
    items: [
      { label: "áo thun", href: "/collections/collection-t-shirts-tanks" },
      { label: "áo sơ mi" },
      { label: "áo khoác", href: "/collections/coats-jackets" },
    ],
  },
  {
    title: "quần",
    items: [
      { label: "quần dài", href: "/collections/trousers-shorts" },
      { label: "quần ngắn" },
    ],
  },
  {
    title: "phụ kiện",
    href: "/collections/accessories",
  },
  {
    title: "xem tất cả",
    href: "/collections/shop-all",
  },
];

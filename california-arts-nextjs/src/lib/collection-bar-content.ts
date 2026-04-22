export const DEMO_COLLECTION_BAR_DESCRIPTION =
  "A vintage inspired vegan leather blouson. Our modern interpretation of a wardrobe classic, both effortlessly cool & elegantly refined."

export const DEMO_COLLECTION_BAR_DESCRIPTION_HTML = `<p>${DEMO_COLLECTION_BAR_DESCRIPTION}</p>`

export const DEFAULT_COLLECTION_INTRO_HTML = [
  "<p><br><br><br><br></p>",
  '<p><br><br>Our Product Philosophy:<br><em>"Less and More."</em></p>',
  "<p>We re-imagine one garment at a time, combining<br>intentional proportions with superior craftsmanship.<br>We advocate for sustainability by producing less,<br>building better &amp; simplifying the way we get dressed.</p>",
].join("")

export const VIEW_ALL_SECTION_BAR_DEFAULTS = [
  { handle: "coats", title: "01 Coats", titleVi: "01 Coats" },
  { handle: "jackets", title: "02 Jackets", titleVi: "02 Jackets" },
  { handle: "denim-jackets", title: "03 Denim Jackets", titleVi: "03 Denim Jackets" },
  { handle: "blazers", title: "04 Blazers", titleVi: "04 Blazers" },
  { handle: "crewneck-sweaters", title: "05 Crewneck Sweaters", titleVi: "05 Crewneck Sweaters" },
  { handle: "v-neck-sweaters", title: "06 V-Neck Sweaters", titleVi: "06 V-Neck Sweaters" },
  { handle: "cardigans", title: "07 Cardigans", titleVi: "07 Cardigans" },
  { handle: "polos", title: "08 Polos", titleVi: "08 Polos" },
  { handle: "turtlenecks", title: "09 Turtlenecks", titleVi: "09 Turtlenecks" },
  { handle: "sweatshirts", title: "10 Sweatshirts", titleVi: "10 Sweatshirts" },
  { handle: "long-sleeve-shirts", title: "11 Long Sleeve Shirts", titleVi: "11 Long Sleeve Shirts" },
  { handle: "short-sleeve-shirts", title: "12 Short Sleeve Shirts", titleVi: "12 Short Sleeve Shirts" },
  { handle: "long-sleeve-tees-henleys", title: "13 Long Sleeve Tees & Henleys", titleVi: "13 Long Sleeve Tees & Henleys" },
  { handle: "t-shirts", title: "14 T-Shirts", titleVi: "14 T-Shirts" },
  { handle: "vests", title: "15 Vests", titleVi: "15 Vests" },
  { handle: "tank-tops", title: "16 Tank Tops", titleVi: "16 Tank Tops" },
  { handle: "muscle-tanks", title: "17 Muscle Tanks", titleVi: "17 Muscle Tanks" },
  { handle: "pants-trousers", title: "18 Pants & Trousers", titleVi: "18 Pants & Trousers" },
  { handle: "jeans", title: "19 Jeans", titleVi: "19 Jeans" },
  { handle: "shorts", title: "20 Shorts", titleVi: "20 Shorts" },
  { handle: "accessories", title: "21 Accessories", titleVi: "21 Accessories" },
].map((section) => ({
  ...section,
  barDescription: DEMO_COLLECTION_BAR_DESCRIPTION,
}))

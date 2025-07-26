import { GiMeal, GiCroissant, GiCupcake, GiSodaCan } from "react-icons/gi";
import { MdOutlineFastfood } from "react-icons/md";
import { IconType } from "react-icons";

export interface Product {
  id: number;
  name:string;
  description: string;
  price: number;
  category: string;
  image: string;
}

export interface Category {
    label: string;
    value: string;
    icon: IconType
}

export const categories = [
  {
    label: "All",
    value: "all",
    icon: MdOutlineFastfood,
  },
  {
    label: "Main Course",
    value: "main course",
    icon: GiMeal,
  },
  {
    label: "Breakfast",
    value: "breakfast",
    icon: GiCroissant,
  },
  {
    label: "Dessert",
    value: "dessert",
    icon: GiCupcake,
  },
  {
    label: "Drink",
    value: "drink",
    icon: GiSodaCan,
  },
];

export const products : Product[] = [
  {
    id: 1,
    name: "Jollof Rice with Grilled Chicken",
    description: "Spicy Nigerian jollof rice served with perfectly grilled chicken and fresh coleslaw.",
    price: 3500,
    category: "main course",
    image: "/images/products/product1.png",
  },
  {
    id: 2,
    name: "Efo Riro with Pounded Yam",
    description: "Rich spinach stew cooked with assorted meats, served with fluffy pounded yam.",
    price: 4000,
    category: "main course",
    image: "/images/products/product1.png",
  },
  {
    id: 3,
    name: "Ofada Rice with Ayamase Sauce",
    description: "Local Nigerian rice served with spicy green pepper sauce and assorted meats.",
    price: 4500,
    category: "main course",
    image: "/images/products/product1.png",
  },
  {
    id: 4,
    name: "Egusi Soup with Semovita",
    description: "Melon seed soup loaded with meats and vegetables, served with smooth semovita.",
    price: 3800,
    category: "main course",
    image: "/images/products/product1.png",
  },
  {
    id: 5,
    name: "Moi Moi",
    description: "Steamed bean pudding made with blended beans, peppers, and fish or egg.",
    price: 1200,
    category: "main course",
    image: "/images/products/product1.png",
  },
  {
    id: 6,
    name: "Akara & Pap",
    description: "Crispy bean cakes served with smooth fermented corn pap. A popular breakfast combo.",
    price: 2000,
    category: "breakfast",
    image: "/images/products/product1.png",
  },
  {
    id: 7,
    name: "Plantain Pancakes",
    description: "Sweet and fluffy pancakes made with ripe plantains, served with honey drizzle.",
    price: 1800,
    category: "breakfast",
    image: "/images/products/product1.png",
  },
  {
    id: 8,
    name: "Yam Porridge",
    description: "Hearty Nigerian yam porridge cooked in a rich tomato and pepper sauce.",
    price: 2500,
    category: "main course",
    image: "/images/products/product1.png",
  },
  {
    id: 9,
    name: "Fried Plantain with Egg Sauce",
    description: "Sweet fried plantain slices served with savory tomato-based egg sauce.",
    price: 2200,
    category: "breakfast",
    image: "/images/products/product1.png",
  },
  {
    id: 10,
    name: "Pepper Soup",
    description: "Hot and spicy broth made with goat meat or fish and aromatic spices.",
    price: 2800,
    category: "main course",
    image: "/images/products/product1.png",
  },
  {
    id: 11,
    name: "Puff Puff",
    description: "Golden brown, fluffy deep-fried dough balls. Perfect for snacking or dessert.",
    price: 500,
    category: "dessert",
    image: "/images/products/product1.png",
  },
  {
    id: 12,
    name: "Chin Chin",
    description: "Crunchy fried dough cubes lightly sweetened and spiced.",
    price: 700,
    category: "dessert",
    image: "/images/products/product1.png",
  },
  {
    id: 13,
    name: "Ice Cream Puff Delight",
    description: "Creamy vanilla ice cream served with hot puff puff and chocolate drizzle.",
    price: 2500,
    category: "dessert",
    image: "/images/products/product1.png",
  },
  {
    id: 14,
    name: "Fruit Parfait",
    description: "Layers of yogurt, granola, and fresh seasonal fruits served chilled.",
    price: 2000,
    category: "dessert",
    image: "/images/products/product1.png",
  },
  {
    id: 15,
    name: "Chapman",
    description: "Classic Nigerian cocktail made with Angostura bitters, citrus soda, and fruit garnish.",
    price: 1500,
    category: "drink",
    image: "/images/products/product1.png",
  },
  {
    id: 16,
    name: "Zobo Drink",
    description: "Chilled hibiscus flower drink infused with pineapple and ginger.",
    price: 1000,
    category: "drink",
    image: "/images/products/product1.png",
  },
  {
    id: 17,
    name: "Tigernut Milk",
    description: "Smooth and creamy natural drink made from tigernuts, dates, and coconut.",
    price: 1200,
    category: "drink",
   image: "/images/products/product1.png",
  },
  {
    id: 18,
    name: "Smoothie Bowl",
    description: "A thick fruit smoothie topped with nuts, seeds, and berries in a bowl.",
    price: 2300,
    category: "breakfast",
    image: "/images/products/product1.png",
  },
  {
    id: 19,
    name: "Beans & Plantain",
    description: "Boiled beans served with fried ripe plantain and palm oil sauce.",
    price: 2700,
    category: "main course",
    image: "/images/products/product1.png",
  },
  {
    id: 20,
    name: "Coconut Rice with Fried Fish",
    description: "Fragrant rice cooked in coconut milk served with spiced fried fish.",
    price: 3700,
    category: "main course",
    image: "/images/products/product1.png",
  },
];

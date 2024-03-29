import { createContext, useContext, useReducer } from "react";
import faker from "faker";
import { cartReducer, productReducer } from "./Reducers";
const Bread = require("../Assets/Bread.jpg")

const Cart = createContext();
const ProductName = ["BREAD","BREAD","BREAD","BREAD","BREAD","BREAD","BREAD"]
const ProductPrice = ["500","500","500","500","500","500","500"]
const ProductImage = [Bread,Bread,Bread,Bread,Bread,Bread,Bread]
faker.seed(99);

const Context = ({ children }) => {
  const products = ProductName.map((productName, index) => ({
    id: faker.datatype.uuid(),
    name: productName,
    price: ProductPrice[index],
    image: ProductImage[index],
    inStock: faker.random.arrayElement([0, 3, 5, 6, 7]),
  }));

  const [state, dispatch] = useReducer(cartReducer, {
    products: products,
    cart: [],
  });

  const [productState, productDispatch] = useReducer(productReducer, {
    byStock: false,
    searchQuery: "",
  });

  console.log(productState);

  return (
    <Cart.Provider value={{ state, dispatch, productState, productDispatch }}>
      {children}
    </Cart.Provider>
  );
};

export const CartState = () => {
  return useContext(Cart);
};

export default Context;

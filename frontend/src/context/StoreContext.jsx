import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  // const [cartItems, setCartItems] = useState({});
  const url = "https://yumcrave-food-delivery-backend.onrender.com";
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);
  const [cartItems, setCartItems] = useState(() => {
  const savedCart = localStorage.getItem("cartItems");
  return savedCart ? JSON.parse(savedCart) : {};
});


  // const addToCart = async (itemId) => {
  //   // if (!cartItems[itemId]) {
  //   //   setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
  //   // } else {
  //   //   setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
  //   // }
  //   setCartItems((prev) => {
  //   const qty = prev[itemId] || 0;
  //   return { ...(prev || {}), [itemId]: qty + 1 };
  // });
  //   if (token) {
  //     const response=await axios.post(
  //       url + "/api/cart/add",
  //       { itemId },
  //       { headers: { token } }
  //     );
  //     if(response.data.success){
  //       toast.success("item Added to Cart")
  //     }else{
  //       toast.error("Something went wrong")
  //     }
  //   }
  // };
  
  const addToCart = async (itemId) => {
  setCartItems((prev) => {
    const qty = prev[itemId] || 0;
    return { ...prev, [itemId]: qty + 1 };
  });

  if (!token) {
    toast.error("Please login again");
    return;
  }

  try {
    await axios.post(
      url + "/api/cart/add",
      { itemId },
      { headers: { token } }
    );

    toast.success("Item added to cart"); // ✅ ALWAYS show
  } catch (error) {
    console.error(error);
    toast.error("Not authorized, login again");
  }
};


  // const removeFromCart = async (itemId) => {
  //   // setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
  //   setCartItems((prev) => {
  //   const qty = prev[itemId] || 0;
  //   if (qty <= 1) {
  //     const copy = { ...prev };
  //     delete copy[itemId];
  //     return copy;
  //   }
  //   return { ...prev, [itemId]: qty - 1 };
  // });
  //   if (token) {
  //     const response= await axios.post(
  //       url + "/api/cart/remove",
  //       { itemId },
  //       { headers: { token } }
  //     );
  //     if(response.data.success){
  //       toast.success("item Removed from Cart")
  //     }else{
  //       toast.error("Something went wrong")
  //     }
  //   }
  // };
  const removeFromCart = async (itemId) => {
  setCartItems((prev) => {
    const qty = prev[itemId] || 0;
    if (qty <= 1) {
      const copy = { ...prev };
      delete copy[itemId];
      return copy;
    }
    return { ...prev, [itemId]: qty - 1 };
  });

  if (!token) {
    toast.error("Please login again");
    return;
  }

  try {
    await axios.post(
      url + "/api/cart/remove",
      { itemId },
      { headers: { token } }
    );

    toast.success("Item removed from cart"); // ✅ ALWAYS show
  } catch (error) {
    console.error(error);
    toast.error("Not authorized, login again");
  }
};


  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const itemInfo = food_list.find((product) => product._id === item);
        if(itemInfo) totalAmount += itemInfo.price * cartItems[item];
      }
    }
    return totalAmount;
  };

  const fetchFoodList = async () => {
    const response = await axios.get(url + "/api/food/list");
    if (response.data.success) {
      setFoodList(response.data.data);
    } else {
      alert("Error! Products are not fetching..");
    }
  };

  const loadCardData = async (token) => {
    const response = await axios.post(
      url + "/api/cart/get",
      {},
      { headers: { token } }
    );
    setCartItems(response.data.cartData || {});
  };
  
  useEffect(() => {
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
}, [cartItems]);

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      if (localStorage.getItem("token")) {
        setToken(localStorage.getItem("token"));
        await loadCardData(localStorage.getItem("token"));
      }
    }
    loadData();
  }, []);

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
  };
  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};
export default StoreContextProvider;

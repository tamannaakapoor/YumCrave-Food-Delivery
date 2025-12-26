// import userModel from "../models/userModel.js";

// // add items to user cart
// const addToCart = async (req, res) => {
//   try {
//     let userData = await userModel.findById({_id:req.userId});
//     let cartData = await userData.cartData || {};
//     if (!cartData[req.body.itemId]) {
//       cartData[req.body.itemId] = 1;
//     } else {
//       cartData[req.body.itemId] += 1;
//     }
//     await userModel.findByIdAndUpdate(req.userId, { cartData });
//     res.json({ success: true, message: "Added to Cart" });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: "Error" });
//   }
// };

// // remove from cart
// const removeFromCart = async (req, res) => {
//   try {
//     let userData = await userModel.findById({_id:req.userId});
//     let cartData = await userData.cartData || {};
//     if (cartData[req.body.itemId] > 1) {
//       cartData[req.body.itemId] -= 1;
//     } else {
//       delete cartData[req.body.itemId];
//     }
//     await userModel.findByIdAndUpdate(req.userId, { cartData });
//     res.json({ success: true, message: "Removed from Cart" });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: "Error" });
//   }
// };

// // fetch user cart data
// const getCart = async (req, res) => {
//   try {
//     let userData = await userModel.findById(req.userId);
//     let cartData = await userData.cartData;
//     res.json({ success: true, cartData: cartData });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: "Error" });
//   }
// };

// export { addToCart, removeFromCart, getCart };

import userModel from "../models/userModel.js";

// add items to user cart
const addToCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.userId); // Fixed: removed {_id:}
    let cartData = userData.cartData || {}; // Fixed: removed await
    
    if (!cartData[req.body.itemId]) {
      cartData[req.body.itemId] = 1;
    } else {
      cartData[req.body.itemId] += 1;
    }
    
    // Fixed: Use markModified for nested objects
    userData.cartData = cartData;
    userData.markModified('cartData');
    await userData.save();
    
    res.json({ success: true, message: "Added to Cart", cartData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message || "Error" });
  }
};

// remove from cart
const removeFromCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.userId); // Fixed: removed {_id:}
    let cartData = userData.cartData || {}; // Fixed: removed await
    
    if (cartData[req.body.itemId] > 1) {
      cartData[req.body.itemId] -= 1;
    } else {
      delete cartData[req.body.itemId];
    }
    
    // Fixed: Use markModified for nested objects
    userData.cartData = cartData;
    userData.markModified('cartData');
    await userData.save();
    
    res.json({ success: true, message: "Removed from Cart", cartData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message || "Error" });
  }
};

// fetch user cart data
const getCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.userId); // Fixed: removed {_id:}
    let cartData = userData.cartData || {}; // Fixed: removed await and added fallback
    res.json({ success: true, cartData: cartData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message || "Error" });
  }
};

export { addToCart, removeFromCart, getCart };

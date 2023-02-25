import React from "react";
import ReactDOM from "react-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Link } from "react-router-dom";
import { deleteFromCart, removeCartQuantity, addCartQuantity, addCartToLs } from '../../../actions';
import NavigationBar from "../../Navbar/index";
import Banner from '../../Home/Banner/index';
import Footer from '../../Footer/index';
import "./Cart.css"
import { deleteUserCart, getUserCart, getUserInfo, updateUserCart, statusCart } from "../../../actions/userActions";
import SpinnerCard from "../WineCard/SpinnerCard";
import LoginButton from "../../Login/LoginButton";


export default function Cart() {
  const cart = useSelector((state) => state.products.cart);
  const currentUser = useSelector((state) => state.users.userInfo)
  const [getSwitch, setGetSwitch] = useState(false)
  const [discount, setDiscount] = useState(0)
  const [porcentage, setPorcentage] = useState(0)
  const total = cart.reduce((acc, product) => {
    return acc + product.price * product.cartQuantity;
  }, 0);
  const [newTotal, setNewTotal] = useState(total)

  const dispatch = useDispatch();

  const { user, isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    if (getSwitch) {
      dispatch(getUserCart(currentUser.id))
      setGetSwitch(false)
    }

  }, [dispatch, getSwitch]);

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]);

  useEffect(() => {
    if (!currentUser.id && isAuthenticated) {
      dispatch(getUserInfo(user.email))
    }
    if (currentUser.id && isAuthenticated) {
      dispatch(getUserCart(currentUser.id, currentUser.email))
    }
    if (total > 0) {
      for (let i = 0; i < currentUser.memberships?.length; i++) {
        let objetoActual = currentUser.memberships[i];
        if (objetoActual.discount > discount) {
          setDiscount(objetoActual.discount)
        }
      }
      setPorcentage((100 - discount) / 100)

      setNewTotal(total * (1 - (discount / 100)))
    }
  }, [dispatch, isAuthenticated, currentUser.id, discount, newTotal, total, porcentage])

  const addProductQuantity = (id, price) => {
    if (isAuthenticated) {
      let updateWine = cart.find(el => el.id === id)
      dispatch(updateUserCart({
        userId: currentUser.id,
        totalPrice: price * (updateWine.cartQuantity + 1),
        quantity: updateWine.cartQuantity + 1,
        email: user.email,
        productId: id,
      }))
      dispatch(addCartQuantity(id))
    }
    if (!isAuthenticated) {
      dispatch(addCartQuantity(id))
    }
  }

  const restProductQuantity = (id, price) => {
    if (isAuthenticated) {
      let updateWine = cart.find(el => el.id === id)

      dispatch(updateUserCart({
        userId: currentUser.id,
        totalPrice: price * (updateWine.cartQuantity - 1),
        quantity: updateWine.cartQuantity - 1,
        email: user.email,
        productId: id,
      }))
      dispatch(removeCartQuantity(id))
    }
    if (!isAuthenticated) {
      dispatch(removeCartQuantity(id))
    }
  }

  const deleteProduct = (userId, productId) => {
    if (!isAuthenticated) {
      dispatch(deleteFromCart(productId))
    }
    if (isAuthenticated) {
      console.log('Click Delete Data Base')
      dispatch(deleteUserCart(userId, productId))
      setGetSwitch(true)
    }
  }

  const handleStatus = () => {
    dispatch(statusCart({
      email: currentUser.email,
      status: 'processing payment'
    }))
  }

  return (
    <>
      <Banner />
      <NavigationBar />
      <div className="container d-flex align-items-center" >
        <table className="shadow-table table align-middle table-striped m-5">
          <thead >
            <tr>
              <th className="text-center">Product</th>
              <th className="text-center">Name</th>
              <th className="text-center">Unit Price</th>
              <th className="text-center">Delete Quantity</th>
              <th className="text-center">Quantity Boxes</th>
              <th className="text-center">Add Quantity</th>
              <th className="text-center">Subtotal</th>
              <th className="text-center">Delete</th>
            </tr>
          </thead>
          <tbody >
            {cart.map(product => (
              <tr key={product.id} >
                <th scope="col" className="text-center">
                  <img src={product.image} className="ms-3 align-middle" alt="imagen" style={{ width: '100px', height: '100px' }} id="img-detail" />
                </th>

                <td className="text-center">{product.name}</td>
                <td className="text-center">${product.price},00-</td>
                <td className="text-center">
                  <button disabled={product.cartQuantity === 1 ? true : false} className="bg-transparent fs-5 border border-0 fw-bolder text-primary" onClick={() => restProductQuantity(product.id, product.price)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ffbb33" class="bi bi-cart-dash-fill" viewBox="0 0 16 16">
                    <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM6.5 7h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1 0-1z" />
                  </svg>
                  </button>
                </td>
                <td className="text-center">{product.cartQuantity}</td>
                <td className="text-center">
                  <button className="bg-transparent fs-5 border fw-bolder border-0 text-primary" onClick={() => addProductQuantity(product.id, product.price)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ffbb33" class="bi bi-cart-plus-fill" viewBox="0 0 16 16">
                    <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM9 5.5V7h1.5a.5.5 0 0 1 0 1H9v1.5a.5.5 0 0 1-1 0V8H6.5a.5.5 0 0 1 0-1H8V5.5a.5.5 0 0 1 1 0z" />
                  </svg>
                  </button>
                </td>
                <td className="text-center">${product.price * product.cartQuantity},00-</td>
                <td className="text-center"><button className="bg-transparent border border-0 fw-bolder ms-5 me-5 text-danger" onClick={() => deleteProduct(currentUser.id, product.id)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />
                </svg>
                </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="container d-flex align-items-center justify-content-around">
        <div className="d-flex ">
          {isLoading ? <SpinnerCard /> :
            <div>
              {
                total === newTotal ?
                  <p>
                    <strong>Total: ${newTotal}.00-</strong>
                  </p> :
                  <div className='d-flex align-items-center gap-4'><p className="fs-4 fw-bold">Total: </p><p className="text-decoration-line-through text-muted fs-6">${total}.00-</p><p className="fs-4 fw-bold">${newTotal}.00-</p></div>
              }
            </div>
          }
        </div>
        <div className="float-end" >
          {isAuthenticated ?
            (
              <Link to={"/payment"}>
                <button type="button" id="button-cart" className="btn btn-warning btn-lg mb-4" onClick={handleStatus}>Buy Product<i class="bi bi-cart-check-fill ms-2"></i></button>
              </Link>
            ) :
            (
              <LoginButton />
            )
          }
        </div>
      </div>
      <div className="col col-12">
        <Footer />
      </div>
    </>
  );
};



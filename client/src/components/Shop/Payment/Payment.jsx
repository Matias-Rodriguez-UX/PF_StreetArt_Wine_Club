import React from "react";
import ReactDOM from "react-dom";
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import NavigationBar from "../../Navbar/index";
import Banner from '../../Home/Banner/index';
import Footer from '../../Footer/index';
import useLocalStorage from  '../../../useLocalStorage';
import { statusCart, deleteCart } from "../../../actions/userActions";
const PayPalButton = window.paypal.Buttons.driver("react", { React, ReactDOM });
export default function Paypal(){
    const { user, isAuthenticated } = useAuth0();
    const [storedCart, setStoredCart] = useLocalStorage("cart", []);
    const cart = useSelector((state) => state.products.cart);
    const userInfo = useSelector((state) => state.users.userInfo);
    const dispatch = useDispatch();
  
    const total = cart.reduce((acc, product) => {
      return acc + product.price * product.cartQuantity;
    }, 0);
    const createOrder = (data, actions) => {
      return actions.order.create({
        purchase_units: [
          {
            amount: {
              value: total,
            },
          },
        ],
      });
    }
    const onApprove = (data, actions) => {
      return actions.order.capture(handlePay(total));
    }
    
    function handlePay (total) {
      Swal.fire({
        title: `Your purchase by ${total},00 It was successful!`,
        icon: 'success',
        timer: '8000',
        timerProgressBar: true,
        allowOutsideClick: true,
        confirmButtonColor: '#ffc107'
      })
      dispatch(statusCart({
        email: userInfo.email,
        status: 'processing shipping'
      }))
      /* dispatch(deleteCart(
         userInfo.id,
      )) */
    }
    // useEffect(() => {
    //   if (storedCart.length === 0 && cart.length > 0) {
    //     setStoredCart(cart);
    //   } else if (storedCart.length > 0 && cart.length === 0) {
    //     cart.forEach(item => dispatch(addCartToLs(item)));
    //   }
    // }, [dispatch, cart, storedCart, setStoredCart]);

    
  
    return (
      <>
          <Banner />
          <NavigationBar />
          <div className="container d-flex align-items-center"> 
        <div className="col-md-4 order-md-2 mb-4">
          <h4 className="d-flex justify-content-between align-items-center mb-3">
            <span className="text-muted">Your cart</span>
            <span className="badge badge-secondary badge-pill">3</span>
          </h4>
          <ul className="list-group mb-3">
          {cart.map(product => (
            <li className="list-group-item d-flex justify-content-between lh-condensed">
              <div>
                <h6 className="my-0">{product.name}</h6>
                <small className="text-muted">Quantity Box: {product.cartQuantity}</small>
              </div>
              <span className="text-muted">${product.price},00-</span>
            </li>
           ))}
            
            
            <li className="list-group-item d-flex justify-content-between">
              <span>Total</span>
              <strong>${total},00</strong>
            </li>
          </ul>
    
          <form className="card p-2">
            <div className="input-group">
              <input type="text" className="form-control" placeholder="Promo code"/>
              <div className="input-group-append">
                <button type="submit" className="btn btn-secondary">Redeem</button>
              </div>
            </div>
          </form>
        </div>
        <div className="col-md-8 order-md-1">
          <h4 className="mb-3">Billing address</h4>
          <form className="needs-validation" novalidate>
            <div className="row">
              <div className="mb-3">
                <label for="firstName">Full name</label>
                <input type="text" className="form-control" id="firstName" placeholder="" value={userInfo.fullname} required/>
                <div className="invalid-feedback">
                  Valid full name is required.
                </div>
              </div>
            </div>
    
            <div className="mb-3">
              <label for="username">Email</label>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">@</span>
                </div>
                <input type="text" className="form-control" id="username" value={userInfo.email} required/>
                <div className="invalid-feedback">
                  Your username is required.
                </div>
              </div>
            </div>
    
            <div className="mb-3">
              <label for="address">Address</label>
              <input type="text" className="form-control" id="address" placeholder="1234 Main St" required/>
              <div className="invalid-feedback">
                Please enter your shipping address.
              </div>
            </div>
    
            <div className="row">
              <div className="col-md-5 mb-3">
                <label for="phone">Phone number with country code</label>
                <input type="text" id="phone" className="form-control" placeholder="+48 999-999-999" required/>
              </div>
              <div className="col-md-4 mb-3">
                <label for="zip">ZipCode</label>
                <input type="text" className="form-control" id="zip" placeholder="" required/>
                <div className="invalid-feedback">
                  Zip code required.
                </div>
              </div>
            </div>
        </form>
        </div>
          </div>
          <div className="container d-flex align-items-center"> 
            <div className="col col-12">
              <h1>{total}</h1>
              <PayPalButton
                createOrder={(data, actions) => createOrder(data, actions)}
                onApprove={(data, actions) => onApprove(data, actions)}
              />
              <Link to={"/cart"}><button type="button" className="btn btn-warning btn-lg">Back to Cart</button></Link>
            </div>   
          </div>
          <div className="col col-12">
            <Footer />
          </div>
      </>
    );
  };
import React from "react";
import ReactDOM from "react-dom";
import { useEffect, useState } from "react";
import Form from 'react-bootstrap/Form';
// import { useAuth0 } from "@auth0/auth0-react";
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import NavigationBar from "../../Navbar/index";
import Banner from '../../Home/Banner/index';
import Footer from '../../Footer/index';
// import useLocalStorage from  '../../../useLocalStorage';
import { getStates } from "../../../actions/index.js";
import { backToCartOrder } from "../../../actions/ordersAction";
import { statusCart, getUserAddresses, createUserAddress, getUserInfo, getAllCities} from "../../../actions/userActions";
import "./Payment.css"
const PayPalButton = window.paypal.Buttons.driver("react", { React, ReactDOM });

function validate(input) {
  let errors = {};
  const requiredFields = ['address', 'reference', 'telephone', 'zipCode'];
  requiredFields.forEach((field) => {
    if (!input[field]) {
      errors[field] = `${field} is required`;
    }
  });
  return errors;
}


export default function Paypal(){
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.products.cart);
    const userInfo = useSelector((state) => state.users.userInfo);
    const states = useSelector((state) => state.products.states);
    const cities = useSelector((state) => state.users.cities);
    const userAddresses = useSelector((state) => state.users.userAddresses);
    const history = useHistory();
    const [errors, setErrors] = useState({});
    const [selectedAddress, setSelectedAddress] = useState('');
    const [input, setInput] = useState({
      reference: "",
      address: "", 
      zipCode: "",
      telephone: "", 
      userEmail: userInfo.email,
      state: "",
      region: "",
    })
    console.log(input);
    const total = cart.reduce((acc, product) => {
      return acc + product.price * product.cartQuantity;
    }, 0);
    
    let orderedStates = states.sort(function(a,b) {
      if (a.name > b.name){
          return 1;
      }
      if (b.name > a.name){
          return -1
      }
      return 0;
    });


   let orderedCities = cities?.municipios?.sort(function(a,b) {
      if (a.nombre > b.nombre){
          return 1;
      }
      if (b.nombre > a.nombre){
          return -1
      }
      return 0;
    }); 

    useEffect(() => {
      dispatch(getStates());
      dispatch(getUserInfo(userInfo.email));
      dispatch(getUserAddresses(userInfo.email)); 
    }, [dispatch]);


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

    const handleAddressChange = (event) => {
      const addressId = event.target.value;
      const selected = userAddresses.find((address) => address.id === addressId);
      setSelectedAddress(selected);
      setInput({
        ...input,
        reference: selected.reference,
        address: selected.address,
        zipCode: selected.zipCode,
        telephone: selected.telephone,
        state: selected.state,
        region: selected.region,
        userEmail: selected.userEmail,
      });
    };
    

    const handleChange = (event) => {
      const { name, value } = event.target;
      setInput(prevState => ({
          ...prevState,
          [name] : value,
       }));
      setErrors(validate({
          ...input,
          [name] : value
      }))
      setInput(prevState => {
        console.log(prevState);
        return prevState;
      });
  }

  const handleSelect =  (e) => {
    if (e.target.name) {
        dispatch(getAllCities(e.target.value));
        setInput({
            ...input,
            [e.target.name] : e.target.value
        });
      }
  };

  const handleCitySelect =  (e) => {
      if (e.target.name) {
          setInput({
              ...input,
              [e.target.name] : e.target.value
          });
      }
  };



    
    function handlePay (total) {
      let addressUser = input;
      Swal.fire({
        title: `Your purchase by ${total},00 It was successful!`,
        icon: 'success',
        timer: '8000',
        timerProgressBar: true,
        allowOutsideClick: true,
        confirmButtonColor: '#ffc107'
      }).then(() => {
        dispatch(statusCart({
          email: userInfo.email,
          status: 'processing shipping'
        }))
        dispatch(createUserAddress(addressUser))
        setInput({
          reference: "",
          address: "", 
          zipCode: "",
          telephone: "",
          userEmail: userInfo.email,
          state: "",
          region: "",  
      });
      history.push('/shop');
      }) 
    }

    
  
    return (
      <>
          <Banner />
          <NavigationBar />
          <div className="container d-flex flex-wrap col align-items-center gap-2 mt-4">
          <div className="container-fluid w-100 d-flex align-items-center">
          <Link to={'/cart'} className='text-decoration-none text-reset' onClick={backToCartOrder(userInfo?.orders?.find(el => el.status === "processing payment")?.id)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left me-2" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                </svg>Back to Cart</Link>
          </div>
          <div className="container d-flex align-items-center gap-5 mt-4">
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
        {typeof userAddresses !== 'string'? (
              <>
                <label htmlFor="address-select">Select an address:</label>
                <Form.Select id="selectedAddressId" name="selectedAddressId" onChange={handleAddressChange}>
                <option value="">Select an address</option>
                {userAddresses.map((address) => (
                  <option key={address.id} value={address.id}>
                    {`Reference: ${address.reference}, Address: ${address.address}, ZipCode: ${address.zipCode}, Telephone: ${address.telephone}`}
                  </option>
                ))}
                </Form.Select>
                <h4 className="mb-3">Billing address</h4>
          <form className="needs-validation" novalidate>
            <div className="row">
              <div className="mb-3">
                <label for="firstName">Full name</label>
                <input type="text" className="form-control" id="firstName" placeholder="" value={userInfo.fullname} readOnly />
              </div>
            </div>
    
            <div className="mb-3">
              <label for="username">Email</label>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">@</span>
                </div>
                <input type="text" className="form-control" id="username" value={userInfo.email} readOnly />
              </div>
            </div>
    
            <div className="mb-3">
              <label for="address">Address</label>
              <input type="text" className="form-control" name="address" id="address" placeholder="1234 Main St" value={selectedAddress?.address || input.address} onChange={handleChange}/>
              {errors.address && (
                <p className="error">{errors.address}</p>
                )}
            </div>
            <div className="mb-3">
              <label for="address">Reference</label>
              <input type="text" className="form-control" name="reference" id="reference" placeholder="" value={selectedAddress?.reference || input.reference} onChange={handleChange}/>
              {errors.reference && (
                <div><p className="error">{errors.reference}</p></div>
                )}
            </div>
            <div className="row">
              <div className="col-md-5 mb-3">
              <Form.Select name='state' onChange={(e) => handleSelect(e)}>
                <option name='state'>State</option>
                {orderedStates?.map((el, index) => (<option key={index} value={el.name}>{el.name}</option>))}
              </Form.Select>
              </div>
              <div className="col-md-5 mb-3">
              <Form.Select name='region' onChange={(e) => handleCitySelect(e)} >
                <option name='region'>City</option>
                {(orderedCities ? orderedCities.map((el, index) => (<option key={index} value={el.nombre}>{el.nombre}</option>)) : <div>'Error'</div>)}
              </Form.Select>
              </div>
            </div>
    
            <div className="row">
              <div className="col-md-5 mb-3">
                <label for="phone">Phone number with country code</label>
                <input type="text" id="telephone" name="telephone" className="form-control" placeholder="+54 999-999-999" value={selectedAddress?.telephone || input.telephone} onChange={handleChange}/>
                {errors.telephone && (
                <p className="error">{errors.telephone}</p>
                )}
              </div>
              <div className="col-md-4 mb-3">
                <label for="zip">ZipCode</label>
                <input type="text" className="form-control" name="zipCode" id="zipCode" placeholder="" value={selectedAddress?.zipCode || input.zipCode} onChange={handleChange}/>
                {errors.zipCode && (
                <p className="error">{errors.zipCode}</p>
                )}
              </div>
            </div>
        </form>
                
            </>
          ):(
            <>
              <h4 className="mb-3">Billing address</h4>
              <form className="needs-validation" novalidate>
                <div className="row">
                  <div className="mb-3">
                    <label for="firstName">Full name</label>
                    <input type="text" className="form-control" id="firstName" placeholder="" value={userInfo.fullname} readOnly />
                  </div>
                </div>
        
                <div className="mb-3">
                  <label for="username">Email</label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">@</span>
                    </div>
                    <input type="text" className="form-control" id="username" value={userInfo.email} readOnly />
                  </div>
                </div>
        
                <div className="mb-3">
                  <label for="address">Address</label>
                  <input type="text" className="form-control" name="address" id="address" placeholder="1234 Main St" value={input.address} onChange={handleChange}/>
                  {errors.address && (
                    <p className="error">{errors.address}</p>
                    )}
                </div>
                <div className="mb-3">
                  <label for="address">Reference</label>
                  <input type="text" className="form-control" name="reference" id="reference" placeholder="" value={input.reference} onChange={handleChange}/>
                  {errors.reference && (
                    <div><p className="error">{errors.reference}</p></div>
                    )}
                </div>
                <div className="row">
                  <div className="col-md-5 mb-3">
                  <Form.Select name='state' onChange={(e) => handleSelect(e)}>
                    <option name='state'>State</option>
                    {orderedStates?.map((el, index) => (<option key={index} value={el.name}>{el.name}</option>))}
                  </Form.Select>
                  </div>
                  <div className="col-md-5 mb-3">
                  <Form.Select name='region' onChange={(e) => handleCitySelect(e)} >
                    <option name='region'>City</option>
                    {(orderedCities ? orderedCities.map((el, index) => (<option key={index} value={el.nombre}>{el.nombre}</option>)) : <div>'Error'</div>)}
                  </Form.Select>
                  </div>
                </div>
        
                <div className="row">
                  <div className="col-md-5 mb-3">
                    <label for="phone">Phone number with country code</label>
                    <input type="text" id="telephone" name="telephone" className="form-control" placeholder="+54 999-999-999" value={input.telephone} onChange={handleChange}/>
                    {errors.telephone && (
                    <p className="error">{errors.telephone}</p>
                    )}
                  </div>
                  <div className="col-md-4 mb-3">
                    <label for="zip">ZipCode</label>
                    <input type="text" className="form-control" name="zipCode" id="zipCode" placeholder="" value={input.zipCode} onChange={handleChange}/>
                    {errors.zipCode && (
                    <p className="error">{errors.zipCode}</p>
                    )}
                  </div>
                </div>
            </form>
            </>
          )}
          {/* <div className="container d-flex align-items-center">
            <h4>codigo despues de billing address - form</h4> 
          </div> */}
        </div>
          </div>
          <div className="container d-flex align-items-center"> 
            <div className="col col-12">
              <h1>${total},00.</h1>
              <PayPalButton
                createOrder={(data, actions) => createOrder(data, actions)}
                onApprove={(data, actions) => onApprove(data, actions)}
              />
            </div>   
          </div>
          </div>
            <Footer />
      </>
    );
  };
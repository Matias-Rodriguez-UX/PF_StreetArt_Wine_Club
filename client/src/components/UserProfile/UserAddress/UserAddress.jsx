import React, { useEffect, useState } from "react";
import Form from 'react-bootstrap/Form';
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getStates } from "../../../actions";
import { createUserAddress, deleteUserAddress, getAllCities } from "../../../actions/userActions";
import { getUserAddresses } from "../../../actions/userActions";
import './address.css'  


export default function UserAddress(){
    const dispatch = useDispatch();
    const history = useHistory();
    
    const userInfo = useSelector((state) => state.users.userInfo);
    const states = useSelector((state) => state.products.states);
    const cities = useSelector((state) => state.users.cities);
    const addresses = useSelector(state => state.users.userAddresses);
    console.log(addresses);
const [ input, setInput ] = useState({
    reference: '',
    address: '',
    zipCode:"",
    telephone: "",
    state: "",
    region: ""
});
    // console.log(states);
    input.userEmail = userInfo.email;

    let orderedStates = states.sort(function(a,b) {
        if (a.name > b.name){
            return 1;
        }
        if (b.name > a.name){
            return -1
        }
        return 0;
    });
    //   console.log(orderedStates);
   
    let orderedCities = cities.municipios?.sort(function(a,b) {
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
        dispatch(getUserAddresses(userInfo.email))
    }, [dispatch]);

    const handleChange = (e) => {
        setInput({
            ...input,
            [e.target.name]: e.target.value
        });
       
    };
//  console.log(input);
    const handleSelect =  (e) => {
        if (e.target.name === 'state') {
             dispatch(getAllCities(e.target.value));
            setInput({
                ...input,
                [e.target.name] : e.target.value
            });
        }
    };
    // console.log(orderedCities);

    const handleCitySelect =  (e) => {
        if (e.target.name === 'region') {
            // console.log(e.target.name);
            console.log(e.target.value);
            setInput({
                ...input,
                [e.target.name] : e.target.value
            });
        }
    };
    console.log(input);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(input);
        if (input.reference === '' || input.address === '' || input.zipCode === 0 || input.telephone === 0) 
        return alert('You need to complete all the fields');
        dispatch(createUserAddress(input));
        alert ('Address added!');
        setInput({
            reference: '',
            address: '',
            zipCode: '',
            telephone: ''
        });
        history.push('/userprofile');
    };
    const handleDelete = (e, el) => {
        e.preventDefault()
        dispatch(deleteUserAddress(el.id));
    };
    
    return (
        <div className="container col py-5 mt-5" display='flex'>
          <div class="col-md-8">
          <Form>
                    <div class="card mb-4 d-flex">
                {
                    (typeof addresses !== 'string') ?
                
                addresses.map((el, index) => 
                    (<div>
                        <div class="d-flex card-body mb-1">
                        <Form.Check 
                        type="switch"
                        id="custom-switch"
                        label="Main address"
                        />
                            <div class="row-sm-3 d-flex ">
                                <h6 class="mb-0">{el.reference}</h6>
                                <h6 class="mb-0">{el.address}</h6>
                            </div>
                            <div class="row-sm-3 d-flex text-secondary">
                                <h6 class="mb-0">{el.telephone}</h6>
                            <div class="col-sm-3 text-secondary flex-fill">
                                <h6 class="mb-0">{el.state}</h6>
                                <h6 class="mb-0">{el.region}</h6>
                            </div>
                            <div>
                                <h6 class="mb-0">Edit</h6>
                            </div>
                            <button class="btn btn-warning btn-sm" onClick={(e) => handleDelete(e, el)}>x</button>
                            </div>
                        </div>
                    <hr/>
                    </div>
                         
                )): 
                    <div className="address"><p>You don't have registered addresses yet</p></div>
                    }
                    </div>
                    </Form>
                        <div class="card">
                            <div class="card-body">
                                <h4>Add address</h4>
                                <div class="row mb-3">
                                    <div class="col-sm-3">
                                        <h6 class="mb-0">Reference (ex. Sam's house)</h6>
                                    </div>
                                    <div class="col-sm-9 text-secondary">
                                        <input type="text" class="form-control" name='reference' value={input.reference} onChange={(e) => handleChange(e)} />
                                    </div>
                                </div>
    
                                <div class="row mb-3">
                                    <div class="col-sm-3">
                                        <h6 class="mb-0">Complete Address (street & number)</h6>
                                    </div>
                                    <div class="col-sm-9 text-secondary">
                                        <input type="text" class="form-control" name='address' value={input.address} onChange={(e) => handleChange(e)}/>
                                    </div>
                                </div>
                                
                                <div class="row mb-3">
                                    <div class="col-sm-3">
                                        <h6 class="mb-0">Zip code</h6>
                                    </div>
                                    <div class="col-sm-9 text-secondary">
                                        <input type="text" class="form-control" name='zipCode' value={input.zipCode} onChange={(e) => handleChange(e)}/>
                                    </div>
                                </div>
    
                                <div class="row mb-3">
                                    <div class="col-sm-9 text-secondary">
                                        <Form.Select name='state' onChange={(e) => handleSelect(e)}>
                                            <option name='state'>State</option>
                                            {orderedStates?.map((el, index) => <option key={index} value={el.name}>{el.name}</option>)}
                                        </Form.Select>
                                    </div>
                                </div>

                                <div class="row mb-3">
                                    <div class="col-sm-9 text-secondary">
                                        <Form.Select name='region' onChange={(e) => handleCitySelect(e)}>
                                            <option name='region'>City</option>
                                            {(orderedCities ? orderedCities.map((el, index) => <option key={index} value={el.nombre}>{el.nombre}</option>) : <div>'Error'</div>)}
                                        </Form.Select>
                                    </div>
                                </div>
    
                                <div class="row mb-3">
                                    <div class="col-sm-3">
                                        <h6 class="mb-0">Contact number</h6>
                                    </div>
                                    <div class="col-sm-9 text-secondary">
                                        <input type="text" class="form-control" name='telephone' value={input.telephone} onChange={(e)=>handleChange(e)}/>
                                    </div>
                                </div>
    
                                <div class="row">
                                    <div class="col-sm-3">
                                    <div class="col-sm-9 text-secondary">
                                        <input type="button" class="btn btn-warning btn-sm" value="Add" onClick={(e) => handleSubmit(e)}/>
                                    </div>
                                    </div>
                                </div> 
                                </div>
                                </div>
                                </div>
                                </div>


    )
};







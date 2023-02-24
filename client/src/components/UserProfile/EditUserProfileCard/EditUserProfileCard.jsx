import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch, useSelector} from 'react-redux';
import { getUserInfo, editUserInfo } from "../../../actions/userActions";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {Image} from "react-bootstrap";




export default function EditUserProfileCard() {
    const { isAuthenticated: auth, user } = useAuth0();
    const dispatch = useDispatch();
    const userInfo = useSelector((state) => state.users.userInfo);
	// console.log(userInfo);
	const userId = userInfo.id;
	// console.log(userId)

    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState({
		fullname: userInfo.fullname,
		profile: '',
        avatar: userInfo.avatar,
		status: 'active',
        phone:0,
        mobile:0,
        address:'',
        state:'',
        city:'',
        zipCode: 0,
    });
	input.id=userId;
	input.email=userInfo.email;
	// console.log(input.id);
    let userEmail = '';

    if(auth){
        userEmail = user.email
    };

    useEffect(() => {
        dispatch(getUserInfo(userEmail))
    }, [dispatch, user])


    //Método para cargar las imágenes a cloudinary
    const uploadImage = async (event) => {
        event.preventDefault();
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append("file", file);
        console.log(file);
        formData.append("upload_preset", "user_profile_pictures");
        formData.append('api_key', 757917398541782);
        setLoading(true);
        const res = await fetch("https://api.cloudinary.com/v1_1/dom9fvn1q/image/upload",{
            method: "POST",
            body: formData
        })

        const resFile = await res.json();
        // console.log(res);
        let uploadedUrl = resFile.secure_url;
        console.log(uploadedUrl)
        setLoading(false)
        setInput({
            ...input,
            avatar: uploadedUrl
        });
        // console.log(input.avatar)
    };


        //Modificar inputs
        const handleChange = (e) => {
            setInput({
                ...input,
                [e.target.name]: e.target.value
            });
            console.log(input);
        };

        //Send info to change db
        const handleSubmit = (e) => {
            e.preventDefault();
            console.log(input);

            dispatch(editUserInfo(input));
            alert('Info modified!');
            setInput({
                fullname: '',
                email:'',
                phone:0,
                mobile:0,
                address:'',
                state:'',
                city:'',
                zipCode: 0,
                profile:''
            })
        };

    return(
        <div  className="container col py-3 mt-5" display='flex'>
        <div class="col-lg-8">
					<div class="card">
						<div class="card-body">
                             <div class="row mb-3">
								<div class="col-sm-3">
									<h6 class="mb-0">Image</h6>
								</div>
								<div class="col-sm-9 text-secondary">
									<input type="file" class="form-control" name='avatar' onChange={(event) => {uploadImage(event)}}/>
								</div>
                                <div class="col-sm-9 text-secondary">
									{loading ? (<p>Loading image</p>) : (<Image src={input.avatar} width='100px' height='100px' />)}
								</div>
							</div>
							<div class="row mb-3">
								<div class="col-sm-3">
									<h6 class="mb-0">Full Name</h6>
								</div>
								<div class="col-sm-9 text-secondary">
									<input type="text" class="form-control" name='fullname' value={input.fullname} onChange={(e) => handleChange(e)}/>
								</div>
							</div>
							<div class="row mb-3">
								<div class="col-sm-3">
									<h6 class="mb-0">Email</h6>
								</div>
								<div class="col-sm-9 text-secondary">
									<input type="text" readOnly class="form-control" name='email' value={input.email} onChange={(e) => handleChange(e)}/>
								</div>
							</div>
							<div class="row mb-3">
								<div class="col-sm-3">
									<h6 class="mb-0">Phone</h6>
								</div>
								<div class="col-sm-9 text-secondary">
									<input type="text" class="form-control" name='phone' value={input.phone} onChange={(e) => handleChange(e)}/>
								</div>
							</div>
							<div class="row mb-3">
								<div class="col-sm-3">
									<h6 class="mb-0">Mobile</h6>
								</div>
								<div class="col-sm-9 text-secondary">
									<input type="text" class="form-control" name='mobile' value={input.mobile} onChange={(e) => handleChange(e)}/>
								</div>
							</div>
							<div class="row mb-3">
								<div class="col-sm-3">
									<h6 class="mb-0">Address</h6>
								</div>
								<div class="col-sm-9 text-secondary">
									<input type="text" class="form-control" name='address' value={input.address} onChange={(e) => handleChange(e)}/>
								</div>
							</div>
                            <div class="row mb-3">
								<div class="col-sm-3">
									<h6 class="mb-0">State</h6>
								</div>
								<div class="col-sm-9 text-secondary">
									<input type="text" class="form-control" name='state' value={input.state} onChange={(e) => handleChange(e)}/>
								</div>
							</div>
                            <div class="row mb-3">
								<div class="col-sm-3">
									<h6 class="mb-0">City</h6>
								</div>
								<div class="col-sm-9 text-secondary">
									<input type="text" class="form-control" name='city' value={input.city} onChange={(e) => handleChange(e)}/>
								</div>
							</div>
                            <div class="row mb-3">
								<div class="col-sm-3">
									<h6 class="mb-0">ZIP code</h6>
								</div>
								<div class="col-sm-9 text-secondary">
									<input type="text" class="form-control" name='zipCode' value={input.zipCode} onChange={(e) => handleChange(e)}/>
								</div>
							</div>
                            <div class="row mb-3">
								<div class="col-sm-3">
									<h6 class="mb-0">About you</h6>
								</div>
								<div class="col-sm-9 text-secondary">
									<input type="text" class="form-control" name='profile' value={input.profile} onChange={(e) => handleChange(e)}/>
								</div>
							</div>
							<div class="row">
								<div class="col-sm-3"></div>
								<div class="col-sm-9 text-secondary">
									<input type="button" class="btn btn-warning btn-sm" value="Save Changes" onClick={(e) => handleSubmit(e)}/>
								</div>
							</div>
						</div>
					</div>
                </div>
            </div>
    )
};

// export default function UserProfileCard({ userName, userPicture, userEmail, setCurrentPage }) {
//     const dispatch = useDispatch();

//     const { isLoading, isAuthenticated: auth, user } = useAuth0();
//     const [loading, setLoading] = useState(false);
//     const [input, setInput] = useState ({
//         email: "", 
//         role: "common", 
//         fullname: "", 
//         profile: "", 
//         avatar: ""
//     });


//     const handleChange = (e) => {
//         setInput({
//             ...input,
//             [e.target.name]: e.target.value
//         });
//         console.log(input)
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         console.log(input);
//         dispatch(createUser(input));
//         dispatch(editUserInfo(input))
//         alert('Info modified!')
//     };

//     let uploadedUrl;

//     const upLoadImage = async (e) => {
//         e.preventDefault();
//         const file = e.target.files[0]
//         console.log(file)
//         const formData = new FormData();
//         console.log(file)
//         formData.append('file', file);
//         formData.append('upload_preset', 'products')
//         formData.append('api_key', 757917398541782);
//         setLoading(true)
//         const res = await fetch('https://api.cloudinary.com/v1_1/dom9fvn1q/image/upload',
//             {
//                 method: "POST",
//                 body: formData
//             })
//         const resFile = await res.json()
//         console.log(res)
//         uploadedUrl = resFile.secure_url
//         console.log(uploadedUrl)
//         setLoading(false)
//         setInput({
//             ...input,
//             image: uploadedUrl
//         })
//     }

//     return (
//         <>
//         <div className="container col py-5 mt-5" display='flex'>
//             <h1 className="text-center">My info</h1>
//                 <Form onSubmit={(e) => handleSubmit(e)}>   

//                 <Form.Group controlId="formImg">
//                     <Form.Label>Image</Form.Label>
//                     <Form.Control type="file" accept="image/png, image/jpeg" name="image" value={input.avatar} multiple onChange={upLoadImage} />
//                     {loading ? (<p>Loading Image</p>) : (<p> </p>)}
//                 </Form.Group>
//                 <div className="form-row">
//                 <Form.Group className=" col mb-3" controlId="formBasicName" >
//                     <Form.Label>Fullname </Form.Label>
//                     <Form.Control type="text" placeholder="Enter your fullname" name='fullname' value={input.fullname} onChange={(e) => handleChange(e)}/>
//                 </Form.Group>

//                 {/* <Form.Group className="mb-3" controlId="formBasicLastName">
//                     <Form.Label>Lastname </Form.Label>
//                     <Form.Control type="text" placeholder="Enter your lastname" defaultValue={user.family_name} name='lastname' value={input.lastname} onChange={(e) => handleChange(e)}/>
//                 </Form.Group> */}
//                 </div>

//                 <Form.Group className="mb-3" controlId="formBasicId">
//                     <Form.Label>Id number </Form.Label>
//                     <Form.Control type="text" placeholder="Enter your id" defaultValue={''} name='idNumber' />
//                 </Form.Group>

//                 <Form.Group className="mb-3" controlId="formBasicEmail">
//                     <Form.Label>Email address</Form.Label>
//                     <Form.Control type="email" placeholder="Enter email" name='email' value={input.email} onChange={(e) => handleChange(e)}/>
//                     <Form.Text className="text-muted">
//                      We'll never share your email with anyone else.
//                     </Form.Text>
//                 </Form.Group>

//                 <Form.Group className="mb-3" controlId="formBasicPhone">
//                     <Form.Label>Phone number</Form.Label>
//                     <Form.Control type="text" placeholder="Enter your phone number" defaultValue={''} name='phoneNumber' value={input.phoneNumber}/>
//                 </Form.Group>

//                 <Form.Group className="mb-3" controlId="formBasicAddress">
//                     <Form.Label>Address</Form.Label>
//                     <Form.Control type="text" placeholder="Enter your address" defaultValue={''} name='address' value={input.address}/>
//                 </Form.Group>

                
//                 <Form.Group className="mb-3" controlId="formBasicState">
//                     <Form.Label>State</Form.Label>
//                     <Form.Control type="text" placeholder="Enter your state" defaultValue={''} name='state' />
//                 </Form.Group>

//                 <Form.Group className="mb-3" controlId="formBasicCity">
//                     <Form.Label>City</Form.Label>
//                     <Form.Control type="text" placeholder="Enter your city" defaultValue={''} name='city' />
//                 </Form.Group>


//                 <Form.Group className="mb-3" controlId="formBasicCP">
//                     <Form.Label>CP</Form.Label>
//                     <Form.Control type="text" placeholder="Enter your CP" defaultValue={''} name='CP' />
//                 </Form.Group>

//                 <Button className="btn btn-warning btn-sm" variant="primary" type="submit">
//                     Save Profile
//                 </Button>
//                 </Form>
//             </div>
//         </>
//     );
// };
// import logo from './logo.svg';
import './App.css';
import { initializeApp } from "firebase/app";
import firebaseConfig from './firebase.config';
import { Button,Container,Form,Card,Alert } from 'react-bootstrap';
import { getAuth, signInWithPopup, GoogleAuthProvider,signOut, createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from 'react';
const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
const auth = getAuth();


function App() {

 const [user, setUser] = useState({
    isSingIn: false,
   email : '',
   name : '',
   photo : '',
   password: '',
 
 })
 console.log(user)

  const handleSignIn = () =>{
    signInWithPopup(auth, provider)
    .then((result) => {
      console.log(result)
      const user = result.user;
      const {email,displayName,photoURL} = user;
      const signedInUser = {
        isSingIn: true,
        email : email,
        name : displayName,
        photo : photoURL
      }
      setUser(signedInUser);
      // ...
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
  }

  const handleSignOut = () =>{
     signOut(auth).then(() => {
      const signedOutUser = {
        isSingIn: false,
        email : '',
        name : '',
        photo : '',
        error: false,
        success : false,
        // error: false

      }
      setUser(signedOutUser)
      }).catch((error) => {
        // An error happened.
      });
  }
  const handleSubmit = (e) => {
    
      if(user.name && user.email){
        createUserWithEmailAndPassword(auth, user.email, user.password)
        .then((userCredential) => {
          // Signed in 

          const errorAlert = {
            error: false,
            success: true
          }
          setUser(errorAlert)

          // const user = userCredential.user;
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          const newUserInfo = {...user}
          newUserInfo.error = true;
          setUser(newUserInfo)
          console.log(errorCode,errorMessage);
          // ..
        });
      
      }
      e.preventDefault();
  }
  const handleChange = (e) =>{
    let isFieldValid = true;
    if(e.target.name === 'email'){
      isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
    }
    if(e.target.name === 'password'){
      const isPasswordValid = e.target.value.length > 6;
      const passwordHasNumber =  /\d{1}/.test(e.target.value);
      isFieldValid = isPasswordValid && passwordHasNumber
    }
    if(isFieldValid){
      const newUserInfo = {...user};
      newUserInfo[e.target.name] = e.target.value ;
      setUser(newUserInfo);
      
    }
  }
  
  return (
    <Container className="d-flex align-items-center justify-content-center"
    style={{ minHeight: "100vh" }} >
        <div className="w-100" style={{ maxWidth: "400px" }} >
          <Card >
            <Card.Body>
              {/* {error && <Alert variant="danger">{error}</Alert>} */}
              <Form onSubmit={handleSubmit} >
                {user.error && <Alert variant="warning" >Email is already Used</Alert>}
                {user.success && <Alert variant="success" >User Created Successfully</Alert>}
              <Form.Group id="email">
                  <Form.Label>Your Name</Form.Label>
                  <Form.Control name="name" onBlur={handleChange} type="text"  required />
                </Form.Group>
                <Form.Group id="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control name="email" onBlur={handleChange} type="email"  required />
                </Form.Group>
                <Form.Group id="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control name="password" onBlur={handleChange} type="password"  required />
                </Form.Group>
                <Button  className="w-100 mt-3" type="submit">
                  Sign Up
                </Button>
              </Form>
            </Card.Body>
          </Card>
          <div className="w-100 text-center mt-2">
            <p>Login With Google? <a style={{cursor:'pointer',color: 'blue'}} onClick={handleSignIn} >Log In</a></p>
          </div>
        </div>
    </Container>
    
  );
}

export default App;

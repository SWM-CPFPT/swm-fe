import Header from "../../Layout/User/Header";
import Footer from "../../Layout/User/Footer";
import "bootstrap/dist/css/bootstrap.css";
import React, { useEffect } from 'react';
import axios from 'axios';

const RegisterConfirm = () => {
  useEffect(() => {
    // Gọi API
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    axios.get(`https://localhost:7207/api/home/confirm?email=${email}`)
    .then(response => {
       alert("Kích hoạt tài khoản thành công")
       setTimeout(() => {
        window.location.href = "/login"
       },2000)
    })
    .catch(error => {
      console.log(error);
    });
  }, []); 
  return (
    <div>
      <div>
      </div>
    </div>
  );
};

export default RegisterConfirm;
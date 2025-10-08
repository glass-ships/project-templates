"use client";

import { ToastContainer } from "react-toastify";

import Logo from "@/assets/images/logo.svg";
import styles from "./Navbar.module.scss";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <a href="#" rel="noopener noreferrer">
        <img src={Logo} alt="Logo" className={styles.logo} />
      </a>
      <ToastContainer theme="dark" />
    </nav>
  );
}

import { Link } from "react-router";
import { ToastContainer } from "react-toastify";
import Logo from "@/assets/images/logo.svg";
import styles from "./Navbar.module.scss";
import ThemeToggle from "./ui/ThemeToggle";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <Link to="/">
        <img src={Logo} alt="Logo" className={styles.logo} />
      </Link>
      <ToastContainer theme="dark" />
      <ThemeToggle />
    </nav>
  );
}

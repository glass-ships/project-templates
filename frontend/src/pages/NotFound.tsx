import img404 from "@/assets/images/404.png";
import AppButton from "@/components/AppButton";
// import AppSection from "@/components/AppSection";
import Nexus from "@/components/Nexus";
import "@/global/styles.scss";

const style = {
  textAlign: "center" as const,
  padding: "2rem",
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center",
  justifyContent: "center",
  gap: "1.5rem",
};

export default function NotFound() {
  return (
    <main style={style}>
      <img src={img404} alt="404 Not Found" />
      <h1>Page Not Found</h1>
      <AppButton linkTo="/" text="Return to Home" />
      <Nexus />
    </main>
  );
}

import img404 from "@/assets/images/404.png";
import AppSection from "@/components/AppSection";
import "@/global/styles.scss";

export default function NotFound() {
  return (
    <main>
      <AppSection>
        <picture>
          <img src={img404} alt="404 Not Found" />
        </picture>
      </AppSection>
    </main>
  );
}

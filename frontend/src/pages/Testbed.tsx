import Footer from "@/components/Footer";
import AppBackToTopButton from "@/components/ui/AppBackToTopButton";
import AppButton from "@/components/ui/AppButton";
import AppCard from "@/components/ui/AppCard";
import AppCodeBlock from "@/components/ui/AppCodeBlock";
import AppFlex from "@/components/ui/AppFlex";
import AppGrid from "@/components/ui/AppGrid";
import AppIcon from "@/components/ui/AppIcon";
import AppModal from "@/components/ui/AppModal";
import AppSection from "@/components/ui/AppSection";
import faIcons from "@/global/icons";
import "@/global/styles.scss";
import { useState } from "react";
import { toast } from "react-toastify";
import { Tooltip } from "react-tooltip";
import styles from "./TestBed.module.scss";

// Get filenames of custom icons in /src/assets/icons
const customIconsImport = import.meta.glob("/src/assets/icons/*.svg");
const customIcons: { [key: string]: boolean } = {};
for (const path in customIconsImport) {
  const match = path.match(/\/src\/assets\/icons\/(.*)\.svg$/);
  if (match) {
    const iconName = match[1];
    customIcons[iconName] = true;
  }
}
const icons: string[] = ["not-an-icon", ...Object.keys(customIcons), ...Object.keys(faIcons)];

const sizeGroups = ["large", "medium", "small", "tiny"] as const;

const colorGroups = {
  primary: ["primary-dark", "primary", "primary-light"],
  secondary: ["secondary-dark", "secondary", "secondary-light"],
  tertiary: ["tertiary"],
  misc: ["success", "error"],
};

export default function Testbed() {
  return (
    <main>
      <AppBackToTopButton ariaLabel="Back to Top" />
      <TestText />
      <TestButtons />
      <TestColors />
      <TestGrid />
      <TestIcons />
      <TestTooltips />
      <Footer />
    </main>
  );
}

function TestButtons() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLockedOpen, setIsLockedOpen] = useState(false);
  const toggleDialog = () => {
    setIsOpen(!isOpen);
  };
  return (
    <AppSection width="big" height="auto">
      <AppModal isOpen={isOpen} toggle={toggleDialog}>
        <h1>Test Modal</h1>
      </AppModal>
      {/* Escape and backdrop clicks do nothing; only the Close button closes it */}
      <AppModal isOpen={isLockedOpen} toggle={() => {}}>
        <h1>Locked Modal</h1>
        <AppButton text="Close" color="primary" onClick={() => setIsLockedOpen(false)} />
      </AppModal>
      <AppCard>
        <h3>Test AppButtons</h3>
        <AppFlex>
          {/* normal: click handlers */}
          <AppFlex direction="row">
            <AppButton text="Toast Success" color="primary" onClick={() => toast.success("Button 1 clicked")} />
            <AppButton
              text="Toast Error"
              color="secondary"
              icon="vial"
              iconPosition="left"
              onClick={() => toast.error("Button 2 clicked")}
            />
            {/* in-app path with no route: should show the 404 page */}
            <AppButton type="link" text="Broken link" icon="vial" color="tertiary" linkTo="/doesnotexist" />
            <AppButton text="Test modal" icon="vial" color="none" onClick={() => setIsOpen(true)} />
            <AppButton text="Test locked modal" icon="vial" color="none" onClick={() => setIsLockedOpen(true)} />
            <AppButton icon="vial" ariaLabel="Icon button" onClick={() => toast.info("Icon button clicked")} />
          </AppFlex>
          {/* circle: links */}
          <AppFlex>
            <AppButton text="External link" color="primary" design="circle" linkTo="https://example.com" />
            <AppButton
              text="New tab"
              color="secondary"
              design="circle"
              icon="arrow-up-right-from-square"
              iconPosition="left"
              linkTo="https://example.com"
              newTab
            />
            <AppButton text="Link to nexus" color="tertiary" design="circle" icon="vial" linkTo="/nexus" />
            <AppButton icon="vial" text="Infinite Scroll" color="none" design="circle" linkTo="/infinite-scroll" />
            <AppButton design="circle" icon="envelope" ariaLabel="Email" linkTo="mailto:someone@example.com" />
          </AppFlex>
          {/* small: link edge cases, keyboard and form submit */}
          <AppFlex>
            {/* should scroll to the Test Icons section */}
            <AppButton text="Hash link" color="primary" design="small" linkTo="#test-icons" />
            {/* same-site file the app has no route for: should open the icon, not the 404 page */}
            <AppButton
              text="Static file"
              color="secondary"
              design="small"
              icon="file-arrow-down"
              iconPosition="left"
              linkTo="/images/favicon.ico"
            />
            <AppButton
              text="Key down"
              color="tertiary"
              design="small"
              icon="vial"
              onKeyDown={(event) => toast.info(`Key: ${event.key}`)}
            />
            {/* should show both toasts: the button's onClick, then the form's onSubmit */}
            <form
              onSubmit={(event) => {
                event.preventDefault();
                toast.success("Form submitted");
              }}
            >
              <AppButton
                text="Submit"
                type="submit"
                icon="vial"
                color="none"
                design="small"
                onClick={() => toast.info("Submit button clicked")}
              />
            </form>
            <AppButton design="small" icon="vial" ariaLabel="Home" type="link" linkTo="/" />
          </AppFlex>
        </AppFlex>
      </AppCard>
    </AppSection>
  );
}

function TestColors() {
  return (
    <AppSection width="medium" height="auto">
      <AppCard>
        <h3>Test Colors</h3>
        {Object.entries(colorGroups).map(([groupName, colors]) => (
          <AppFlex key={`colors-${groupName}`} direction="row" gap="small">
            {colors.map((color) => (
              <div key={color} className={`${styles.swatch}` + ` ${styles[color]}`}>
                <p className={styles["color-name"]}>{color}</p>
              </div>
            ))}
          </AppFlex>
        ))}
      </AppCard>
    </AppSection>
  );
}

function TestGrid() {
  return (
    <AppSection width="medium" height="auto">
      <AppCard>
        <h3>Test Grid</h3>
        <AppGrid cols={4}>
          {Array.from({ length: 15 }, (_, i) => i + 1).map((n) => (
            <div key={n} className={styles["grid-item"]}>
              {n}
            </div>
          ))}
        </AppGrid>
      </AppCard>
    </AppSection>
  );
}

function TestIcons() {
  return (
    <AppSection width="medium" height="auto" id="test-icons">
      <AppCard>
        <h3>Test Icons</h3>
        {sizeGroups.map((groupSize, gidx) => (
          <AppFlex key={groupSize} direction="row">
            {icons.map((icon, _idx) => (
              <AppIcon
                key={`${groupSize}-${icon}`}
                icon={icon}
                color="oklch(0.6 0.1 185)"
                size={sizeGroups[gidx]}
                background={!(gidx % 2)}
              />
            ))}
          </AppFlex>
        ))}
      </AppCard>
    </AppSection>
  );
}

function TestText() {
  return (
    <AppSection width="medium" height="auto">
      <AppCard>
        <h1>Testbed</h1>
        <h2>Test Header 2</h2>
        <h3>Test Header 3</h3>
        <h4>Test Header 4</h4>
        <h5>Test Header 5</h5>
        <p>
          This is a testbed for new components and features. You are a worm through time. The thunder song distorts you.
          Happiness comes. White pearls, but yellow and red in the eye. Through a mirror, inverted is made right. Leave
          your insides by the door. Push the fingers through the surface into the wet. You’ve always been the new you.
          You want this to be true. We stand around you while you dream. You can almost hear our words but you forget.
          This happens more and more now.
        </p>
        <p>
          You gave us the permission in your regulations. We wait in the stains. The word that describes this is
          redacted. Repeat the word. The name of the sound. It resonates in your house. After the song, time for
          applause. We build you till nothing remains. The egg cracks and the truth will emerge out of you. You are
          home. You remind us of home. You’ve taken your boss with your boss with you. All hair must be eaten. Under the
          conceptual reality behind this reality you must want these waves to drag you away.
        </p>
        <code>
          After the song, time for applause. This cliché is death out of time, breaking the first the second the third
          the fourth wall, the fifth wall, floor; no floor: you fall! How do you say “insane”? Hurts to be happy. An
          earworm is a tune you can’t stop humming in a dream: "Baby baby baby, yeah." Just plastic. So safe and nothing
          to worry about. Ha ha, funny. The last egg breaks now. The hole in your room is a hole in you. You came and we
          let you in through the hole in you. You have always been here, the only child. A copy of a copy of a copy.
          Orange peel. The picture is you holding the picture. When you hear this you will know you’re in new you. You
          want to listen. You want to dream. You want to smile. You want to hurt. You don’t want to be.
        </code>
        <AppCodeBlock language="js">
          {`
            function example() {
              console.log("This is a code block with a long line that should trigger horizontal scrolling.");
              return true;
            }
          `}
        </AppCodeBlock>
      </AppCard>
    </AppSection>
  );
}

function TestTooltips() {
  return (
    <AppSection width="medium" height="auto">
      <AppCard>
        <h3>Test Tooltip</h3>
        <AppFlex direction="row">
          <Tooltip content="Tooltip content" anchorSelect="#tooltip-left" place="left" />
          <AppButton text="Tooltip Left" color="primary" id="tooltip-left" />

          <Tooltip
            content="This is an example of a tooltip with longer text content"
            anchorSelect="#tooltip-top"
            place="top"
          />
          <AppButton text="Tooltip Top" color="primary" id="tooltip-top" />

          <Tooltip
            content="This is an example of a tooltip with longer text content"
            anchorSelect="#tooltip-bottom"
            place="bottom"
          />
          <AppButton design="circle" icon="vial" color="primary" id="tooltip-bottom" ariaLabel="Tooltip Bottom" />

          <Tooltip content="Tooltip content" place="right" anchorSelect="#tooltip-right" />
          <AppButton design="small" icon="vial" color="primary" id="tooltip-right" ariaLabel="Tooltip Right" />
        </AppFlex>

        <AppFlex>
          <Tooltip content="FA icon with tooltip" anchorSelect="#tooltip-icon" />
          <AppIcon icon="vial" id="tooltip-icon" />
          <Tooltip content="Custom icon with tooltip" anchorSelect="#custom-tooltip-icon" />
          <AppIcon icon="logo" id="custom-tooltip-icon" />
        </AppFlex>

        <Tooltip content="I'm interactible! You can click inside me." anchorSelect="#tooltip-text" clickable />
        <p id="tooltip-text">Hover over me too.</p>
      </AppCard>
    </AppSection>
  );
}

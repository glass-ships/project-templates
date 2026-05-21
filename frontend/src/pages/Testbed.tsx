import { lazy, useState } from "react";
import { toast } from "react-toastify";
import { Tooltip } from "react-tooltip";
import Navbar from "@/components/Navbar";
import AppBackToTopButton from "@/components/ui/AppBackToTopButton";
import AppButton from "@/components/ui/AppButton";
import AppCard from "@/components/ui/AppCard";
import AppFlex from "@/components/ui/AppFlex";
import AppIcon from "@/components/ui/AppIcon";
import AppSection from "@/components/ui/AppSection";
import faIcons from "@/global/icons";
import styles from "./TestBed.module.scss";
import "@/global/styles.scss";

const Modal = lazy(() => import("@/components/ui/AppModal"));

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
// console.log({ icons });

// Split icons into groups for different sizes
const groups: string[][] = [];
const groupCount = 4;
const chunkSize = Math.ceil(icons.length / groupCount);
for (let i = 0; i < groupCount; i++) {
  const start = i * chunkSize;
  const end = start + chunkSize;
  groups.push(icons.slice(start, end));
}
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
      <Navbar />
      <AppBackToTopButton ariaLabel="Back to Top" />
      <TestColors />
      <TestText />
      <TestButtons />
      <TestIcons />
      <TestTooltips />
    </main>
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
          This is a testbed for new components and features. Lorem ipsum dolor sit amet consectetur adipiscing elit.
          Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis.
          Tempus leo eu aenean sed diam urna tempor.
        </p>
        <p>
          Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc
          posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos
          himenaeos.
        </p>
        <code>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
          consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum.
        </code>
        <pre>
          {`function example() {
            console.log("This is a code block with a long line that should trigger horizontal scrolling.");
            return true;
          }`}
        </pre>
      </AppCard>
    </AppSection>
  );
}

function TestButtons() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleDialog = () => {
    setIsOpen(!isOpen);
  };
  return (
    <AppSection width="big" height="auto">
      <Modal isOpen={isOpen} toggle={toggleDialog}>
        <h1>Test Modal</h1>
      </Modal>
      <AppCard>
        <h3>Test AppButtons</h3>
        <AppFlex>
          {/* normal */}
          <AppFlex direction="row">
            <AppButton text="Toast Success" color="primary" onClick={() => toast.success("Button 1 clicked")} />
            <AppButton
              text="Toast Error"
              color="secondary"
              icon="vial"
              iconPosition="left"
              onClick={() => toast.error("Button 2 clicked")}
            />
            <AppButton type="link" text="Broken link" icon="vial" color="tertiary" linkTo="/doesnotexist" />
            <AppButton text="Test modal" icon="vial" color="none" onClick={() => setIsOpen(true)} />
            <AppButton icon="vial" iconColor="white" onClick={() => console.log("Button 5 clicked")} />
          </AppFlex>
          {/* circle */}
          <AppFlex>
            <AppButton text="Circle 1" color="primary" design="circle" onClick={() => console.log("Icon clicked")} />
            <AppButton
              text="Circle 2"
              color="secondary"
              design="circle"
              icon="vial"
              iconPosition="left"
              onClick={() => console.log("Icon clicked")}
            />
            <AppButton
              text="Link to nexus"
              color="tertiary"
              design="circle"
              icon="vial"
              linkTo="/nexus"
            />
            <AppButton icon="vial" text="Broken link" color="none" design="circle" linkTo="/doesnotexist" />
            <AppButton design="circle" icon="vial" iconColor="white" />
          </AppFlex>
          {/* small */}
          <AppFlex>
            <AppButton
              text="Small 1"
              color="primary"
              design="small"
              onClick={() => console.log("Sm button 1 clicked")}
            />
            <AppButton text="Small 2" color="secondary" design="small" icon="vial" iconPosition="left" />
            <AppButton
              text="Small 3"
              color="tertiary"
              design="small"
              icon="vial"
              onClick={() => console.log("Sm button 3 clicked")}
            />
            <AppButton text="Small 4" icon="vial" color="none" design="small" linkTo="/doesnotexist" />
            <AppButton design="small" icon="vial" iconColor="white" />
          </AppFlex>
        </AppFlex>
      </AppCard>
    </AppSection>
  );
}

function TestIcons() {
  return (
    <AppSection width="medium" height="auto">
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

function TestTooltips() {
  return (
    <AppSection width="big" height="auto">
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
        <AppButton design="circle" icon="vial" color="primary" id="tooltip-bottom" />

        <Tooltip content="Tooltip content" place="right" anchorSelect="#tooltip-right" />
        <AppButton design="small" icon="vial" color="primary" id="tooltip-right" />
      </AppFlex>

      <AppFlex>
        <Tooltip content="FA icon with tooltip" anchorSelect="#tooltip-icon" />
        <AppIcon icon="vial" id="tooltip-icon" />
        <Tooltip content="Custom icon with tooltip" anchorSelect="#custom-tooltip-icon" />
        <AppIcon icon="logo" id="custom-tooltip-icon" />
      </AppFlex>

      <Tooltip content="I'm interactible! You can click inside me." anchorSelect="#tooltip-text" clickable />
      <p id="tooltip-text">Hover over me too.</p>
    </AppSection>
  );
}

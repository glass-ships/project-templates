import { library, type IconDefinition } from "@fortawesome/fontawesome-svg-core";
import * as fab from "@fortawesome/free-brands-svg-icons";
import * as far from "@fortawesome/free-regular-svg-icons";
import * as fas from "@fortawesome/free-solid-svg-icons";

const icons = [
  fab.faGithub,
  fab.faLinkedin,
  fab.faPython,
  far.faPaperPlane,
  far.faSquare,
  fas.faAngleDown,
  fas.faAngleLeft,
  fas.faAngleRight,
  fas.faAngleUp,
  fas.faAnglesDown,
  fas.faAnglesLeft,
  fas.faAnglesRight,
  fas.faAnglesUp,
  fas.faArrowUpRightFromSquare,
  fas.faBars,
  fas.faCloudArrowUp,
  fas.faCode,
  fas.faCodeBranch,
  fas.faDiagramProject,
  fas.faDisplay,
  fas.faEnvelope,
  fas.faFileArrowDown,
  fas.faFilter,
  fas.faMagnifyingGlass,
  fas.faSquareCheck,
  fas.faTerminal,
  fas.faTrash,
  fas.faUpload,
  fas.faUserAstronaut,
  fas.faVial,
  fas.faXmark,
] satisfies IconDefinition[];

library.add(...icons);

const faIcons = Object.fromEntries(icons.map((icon) => [icon.iconName, icon])) as Record<string, IconDefinition>;
export default faIcons;

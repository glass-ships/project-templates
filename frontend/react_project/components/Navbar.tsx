"use client";

import Image from "next/image";
import {
  useEffect,
  useId,
  // useMemo,
  useState,
  // useTransition
} from "react";
// import { matchSorter } from "match-sorter";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import Logo from "@/assets/images/logo.svg";
import { getAllTags } from "@/api/tags";
// import AppIcon from "./AppIcon";
import styles from "./Navbar.module.scss";

const animatedComponents = makeAnimated();

export default function Navbar({ onTagsUpdate }: { onTagsUpdate: (tags: string[]) => void }) {
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    getAllTags().then((data) => {
      setTags(data);
    });
  }, []);

  // const [isPending, startTransition] = useTransition();
  // const [searchValue, setSearchValue] = useState("");
  const [selectedValues, setSelectedValues] = useState([] as string[]);
  // const matches = useMemo(() => matchSorter(tags, searchValue), [tags, searchValue]);

  return (
    <nav className={styles.navbar}>
      {/* <a href="#" rel="noopener noreferrer"> */}
      <a href="http://localhost:3000" rel="noopener noreferrer">
        <Image src={Logo} alt="Logo" className={styles.logo} priority />
      </a>

      {selectedValues.length !== 0 && (
        <span>
          <b>Selected Tags:</b> {selectedValues.join(", ")}
        </span>
      )}

      <Select
        instanceId={useId()}
        className={styles.combobox}
        isMulti
        closeMenuOnSelect={false}
        components={animatedComponents}
        options={tags.sort().map((tag) => ({ value: tag, label: tag }))}
        value={selectedValues.map((tag) => ({ value: tag, label: tag }))}
        onChange={(selectedValues: any) => {
          setSelectedValues((selectedValues as { value: string }[]).map((option) => option.value));
          onTagsUpdate((selectedValues as { value: string }[]).map((option) => option.value));
        }}
        placeholder={`Select tags ${tags.length ? `(${tags.length})` : ""}`}
        isSearchable
        isClearable
      />
    </nav>
  );
}

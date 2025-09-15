import SearchBar from "../SearchBar/SearchBar";
import styles from "./Hero.module.css";
export default function Hero() {
  return (
    <div>
      <header
        className={`relative w-full h-[200px] ${styles.bgGrainy} rounded-b-[60%_40%] z-[-1]`}
      ></header>
      <SearchBar />
    </div>
  );
}

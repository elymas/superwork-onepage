import { ScrollProgress } from "./components/ScrollProgress";
import { Hero } from "./sections/Hero";
import { Ideathon } from "./sections/Ideathon";
import { Workflow } from "./sections/Workflow";
import { Showcase } from "./sections/Showcase";
import { OneMoreThing } from "./sections/OneMoreThing";
import { Outro } from "./sections/Outro";

export function App() {
  return (
    <>
      <ScrollProgress />
      <main>
        <Hero />
        <Ideathon />
        <Workflow />
        <Showcase />
        <Outro />
        <OneMoreThing />
      </main>
    </>
  );
}

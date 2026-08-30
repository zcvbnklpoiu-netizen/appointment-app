import Hero from "./_component/Hero";
import Experience from "./_component/Experience";
import Doctors from "./_component/Doctors";
import CategorySearch from "./_component/CategorySearch";
import WhyChooseMediaBook from "./_component/WhyChooseMediaBook";
import SocialMedia from "./_component/SocialMedia";

export default function Home() {
  return (
    <>

      <Hero />
      <Experience />
      <CategorySearch />
      <Doctors />
      <WhyChooseMediaBook />
      <SocialMedia />
    </>
  );
}
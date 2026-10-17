import Hero from "./_component/Hero";
import Experience from "./_component/Experience";
import Doctors from "./_component/Doctors";
import CategorySearch from "./_component/CategorySearch";
import WhyChooseMediaBook from "./_component/WhyChooseMediaBook";
import SocialMedia from "./_component/SocialMedia";
import ScrollVideoExperience from "./_component/ScrollVideoExperience";
import Link from "next/link";

export default function Home() {
  return (
    <>

      <Hero />
      <Experience />
      <ScrollVideoExperience />
      <CategorySearch />
      <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-[#344B72]">Care professionals</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Explore care by specialty</h2>
          </div>
          <Link href="/explore" className="text-sm font-semibold text-[#344B72] hover:text-[#263F3A]">View all doctors →</Link>
        </div>
      </section>
      <Doctors limit={6} />
      <WhyChooseMediaBook />
      <SocialMedia />
    </>
  );
}

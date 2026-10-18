import Link from "next/link";
import DoctorPortrait from "@/app/_component/DoctorPortrait";

const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function lines(value) {
  if (Array.isArray(value)) return value.filter((item) => typeof item === "string" && item.trim());
  return typeof value === "string" ? value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean) : [];
}

function profileFields(doctor) {
  const databaseRecord = Boolean(doctor.displayName);
  const serviceItems = Array.isArray(doctor.services)
    ? doctor.services
    : lines(doctor.services).map((title) => ({ title }));
  return {
    id: doctor.slug ?? doctor.id,
    name: doctor.displayName ?? doctor.name ?? "Clinician profile",
    specialty: typeof doctor.specialty === "string" ? doctor.specialty : doctor.specialty?.name,
    image: doctor.imageUrl ?? doctor.image,
    introduction: doctor.summary ?? doctor.biography ?? doctor.bio,
    biography: doctor.biography ?? doctor.bio,
    experienceYears: doctor.experienceYears,
    education: Array.isArray(doctor.education) ? doctor.education : [],
    certifications: Array.isArray(doctor.certifications) ? doctor.certifications : [],
    qualifications: lines(databaseRecord ? doctor.qualifications : []),
    experience: Array.isArray(doctor.experience) ? doctor.experience : [],
    services: serviceItems.map((service) => typeof service === "string" ? { title: service } : service).filter((service) => service && typeof service.title === "string" && service.title.trim()),
    professionalTitle: doctor.professionalTitle,
    university: doctor.university,
    training: lines(doctor.training),
    subSpecialties: lines(doctor.subSpecialties),
    languages: lines(doctor.languages),
    procedures: lines(doctor.procedures),
    practiceStartYear: doctor.practiceStartYear,
    clinicName: doctor.clinicName,
    location: doctor.location,
    consultationModes: databaseRecord ? lines(doctor.consultationModes?.split(",")) : lines(doctor.consultationType),
    timeZone: doctor.timeZone,
    availabilities: Array.isArray(doctor.availabilities) ? doctor.availabilities.filter((item) => item?.isActive !== false) : [],
  };
}

function hasValue(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function SectionHeading({ eyebrow, title, description, id }) {
  return (
    <div className="mb-6">
      {eyebrow && <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-800">{eyebrow}</p>}
      <h2 id={id} className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">{title}</h2>
      {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{description}</p>}
    </div>
  );
}

export default function DatabaseDoctorProfile({ doctor, isDemo = false }) {
  const profile = profileFields(doctor);
  const years = typeof profile.experienceYears === "number"
    ? profile.experienceYears > 0 ? `${profile.experienceYears}+` : ""
    : hasValue(profile.experienceYears) ? profile.experienceYears : "";
  const biography = profile.biography || profile.introduction;
  const hasQualifications = profile.education.length > 0 || profile.certifications.length > 0 || profile.qualifications.length > 0 || profile.training.length > 0 || hasValue(profile.university);
  const hasExperience = profile.experience.some((item) => item && (item.role || item.facility || item.duration || item.description));

  return (
    <main className="min-h-screen bg-[#F6F8F6] px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6 sm:space-y-8">
        <Link href="/explore" className="inline-flex min-h-10 items-center gap-2 rounded-lg text-sm font-semibold text-[#344B72] transition hover:text-teal-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-800">
          <span aria-hidden="true">←</span> Back to clinicians
        </Link>

        <section id="profile" aria-labelledby="doctor-name" className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
            <div className="relative min-h-[20rem] bg-[#E8EFEB] sm:min-h-[28rem] lg:min-h-[34rem]">
              <DoctorPortrait src={profile.image} alt={`Portrait of ${profile.name}`} fill sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover object-center transition-transform duration-500 motion-safe:hover:scale-[1.02]" priority />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/20 to-transparent" aria-hidden="true" />
            </div>

            <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-12">
              {isDemo && <p className="mb-5 w-fit rounded-full border border-[#E9D7B7] bg-[#FBF5EA] px-3 py-1.5 text-xs font-bold text-[#684B37]">Sample profile · illustrative details · not accepting bookings</p>}
              {profile.specialty && <p className="w-fit rounded-full bg-[#EAF2EE] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-teal-900">{profile.specialty}</p>}
              <h1 id="doctor-name" className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">{profile.name}</h1>
              {profile.professionalTitle && <p className="mt-2 text-lg font-semibold text-[#344B72]">{profile.professionalTitle}</p>}
              {profile.introduction && <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">{profile.introduction}</p>}

              <div className="mt-6 flex flex-wrap gap-2">
                {years && <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700">{years} years of experience listed</span>}
                {profile.practiceStartYear && <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700">Practicing since {profile.practiceStartYear}</span>}
                {profile.clinicName && <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700">{profile.clinicName}</span>}
                {profile.consultationModes.map((mode) => <span key={mode} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700">{mode === "VIDEO" ? "Video consultation" : mode === "IN_PERSON" ? "In-person care" : mode}</span>)}
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <Link href="#about" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-center font-semibold text-slate-800 transition hover:border-teal-700 hover:bg-[#F6F8F6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-800">View Profile</Link>
                <Link href={`/doctors/${profile.id}/appointment`} className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#263F3A] px-5 py-3 text-center font-semibold text-white shadow-sm transition hover:bg-[#1D302D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#263F3A]">Book Appointment</Link>
              </div>
              {isDemo && <p className="mt-3 text-xs leading-5 text-slate-500">Booking information for sample profiles explains that online appointment requests are not enabled.</p>}
            </div>
          </div>
        </section>

        <section id="about" aria-labelledby="about-heading" className="scroll-mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
          <SectionHeading id="about-heading" eyebrow="About the clinician" title={`About ${profile.name}`} />
          {biography ? <p className="max-w-4xl whitespace-pre-line text-base leading-8 text-slate-600">{biography}</p> : <p className="text-sm leading-6 text-slate-500">A professional biography has not been provided for this profile.</p>}
          {profile.subSpecialties.length > 0 && <div className="mt-6 border-t border-slate-100 pt-5"><h3 className="text-sm font-semibold text-slate-800">Areas of focus</h3><ul className="mt-3 flex flex-wrap gap-2">{profile.subSpecialties.map((item) => <li key={item} className="rounded-full bg-[#EAF2EE] px-3 py-1.5 text-sm text-slate-700">{item}</li>)}</ul></div>}
        </section>

        {hasQualifications && <section aria-label="Education and credentials" className="grid gap-6 md:grid-cols-2">
          {(profile.education.length > 0 || profile.qualifications.length > 0 || hasValue(profile.university)) && <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <SectionHeading eyebrow="Academic background" title="Education & qualifications" />
            {profile.university && <p className="mb-4 rounded-xl bg-[#F6F8F6] p-4 text-sm leading-6 text-slate-700"><span className="font-semibold text-slate-900">University</span><br />{profile.university}</p>}
            {profile.education.length > 0 && <ul className="space-y-3">{profile.education.map((item, index) => <li key={`${item.institution}-${index}`} className="rounded-xl border border-slate-100 bg-slate-50/70 p-4"><p className="font-semibold text-slate-900">{item.degree}</p><p className="mt-1 text-sm text-slate-600">{item.institution}{item.year ? ` · ${item.year}` : ""}</p></li>)}</ul>}
            {profile.qualifications.length > 0 && <ul className="mt-4 space-y-2">{profile.qualifications.map((item) => <li key={item} className="flex gap-2 text-sm leading-6 text-slate-700"><span className="text-teal-800" aria-hidden="true">✓</span><span>{item}</span></li>)}</ul>}
            {profile.training.length > 0 && <div className="mt-5 border-t border-slate-100 pt-4"><h3 className="font-semibold text-slate-900">Additional training</h3><ul className="mt-2 space-y-2">{profile.training.map((item) => <li key={item} className="text-sm leading-6 text-slate-700">{item}</li>)}</ul></div>}
          </article>}
          {profile.certifications.length > 0 && <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <SectionHeading eyebrow="Credentials" title="Certifications" />
            <ul className="grid gap-3">{profile.certifications.map((item) => <li key={item} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-4 text-sm leading-6 text-slate-700"><span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#EAF2EE] font-bold text-teal-900" aria-hidden="true">✓</span><span>{item}</span></li>)}</ul>
          </article>}
        </section>}

        {hasExperience && <section aria-label="Professional experience" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
          <SectionHeading eyebrow="Career" title="Professional experience" />
          <ol className="grid gap-4 md:grid-cols-2">{profile.experience.filter((item) => item && (item.role || item.facility || item.duration || item.description)).map((item, index) => <li key={`${item.role ?? "experience"}-${index}`} className="relative rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
            {item.duration && <p className="text-xs font-bold uppercase tracking-wide text-teal-800">{item.duration}</p>}
            {item.role && <h3 className="mt-2 font-bold text-slate-950">{item.role}</h3>}
            {item.facility && <p className="mt-1 text-sm text-slate-600">{item.facility}</p>}
            {item.description && <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>}
          </li>)}</ol>
        </section>}

        {profile.services.length > 0 && <section aria-label="Services" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
          <SectionHeading eyebrow="Care provided" title="Areas of care & services" />
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{profile.services.map((service, index) => <li key={`${service.title}-${index}`} className="rounded-2xl border border-slate-200 bg-[#FBFCFB] p-5 transition hover:border-[#B7C9B0] hover:shadow-sm"><h3 className="font-semibold text-slate-900">{service.title}</h3>{service.description && <p className="mt-2 text-sm leading-6 text-slate-600">{service.description}</p>}</li>)}</ul>
        </section>}

        {(profile.languages.length > 0 || profile.procedures.length > 0) && <section aria-label="Additional practice information" className="grid gap-6 md:grid-cols-2">
          {profile.languages.length > 0 && <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><SectionHeading title="Languages" /><ul className="flex flex-wrap gap-2">{profile.languages.map((item) => <li key={item} className="rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700">{item}</li>)}</ul></article>}
          {profile.procedures.length > 0 && <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><SectionHeading title="Procedures" /><ul className="grid gap-2 sm:grid-cols-2">{profile.procedures.map((item) => <li key={item} className="rounded-xl bg-slate-50 p-3 text-sm leading-6 text-slate-700">{item}</li>)}</ul></article>}
        </section>}

        {!isDemo && (profile.clinicName || profile.location || profile.availabilities.length > 0) && <section aria-label="Clinic and schedule" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
          <SectionHeading eyebrow="Visit information" title="Clinic & schedule" />
          <dl className="grid gap-4 sm:grid-cols-2">{profile.clinicName && <div className="rounded-xl bg-slate-50 p-4"><dt className="text-xs font-bold uppercase tracking-wide text-slate-500">Clinic</dt><dd className="mt-1 font-medium text-slate-800">{profile.clinicName}</dd></div>}{profile.location && <div className="rounded-xl bg-slate-50 p-4"><dt className="text-xs font-bold uppercase tracking-wide text-slate-500">Location</dt><dd className="mt-1 font-medium text-slate-800">{profile.location}</dd></div>}</dl>
          {profile.availabilities.length > 0 && <div className="mt-6"><h3 className="text-sm font-bold text-slate-800">Regular working hours</h3><ul className="mt-3 grid gap-3 sm:grid-cols-2">{profile.availabilities.map((item) => <li key={item.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm"><p className="font-semibold text-slate-800">{weekdays[item.weekday]}</p><p className="mt-1 text-slate-600">{item.startTime}–{item.endTime} · {item.slotMinutes}-minute appointments</p><p className="mt-1 text-xs text-slate-500">{item.timeZone}</p></li>)}</ul></div>}
        </section>}

        {isDemo && <p className="text-xs leading-5 text-slate-500">Illustrative sample profile information only. This profile does not represent an enrolled clinician or a live appointment schedule.</p>}
        {!isDemo && <section className="rounded-3xl bg-[#263F3A] p-7 text-center text-white shadow-sm sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#D6E6DC]">Book your visit</p>
          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Find a time with {profile.name}</h2>
          <p className="mx-auto mt-3 max-w-xl leading-6 text-teal-50">View the appointment times currently published by the practice.</p>
          <Link href={`/doctors/${profile.id}/appointment`} className="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl bg-white px-7 py-3 font-bold text-[#263F3A] transition hover:bg-[#EEF2EB] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Book Appointment</Link>
        </section>}
      </div>
    </main>
  );
}

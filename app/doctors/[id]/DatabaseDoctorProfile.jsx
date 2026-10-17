import Link from "next/link";
import DoctorPortrait from "@/app/_component/DoctorPortrait";

const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function profileFields(doctor) {
  const databaseRecord = Boolean(doctor.displayName);
  const education = doctor.education ?? [];
  const certifications = doctor.certifications ?? [];
  const services = (doctor.services ?? []).map((service) => typeof service === "string" ? { title: service } : service);
  const qualifications = databaseRecord ? (doctor.qualifications ?? "").split(/\r?\n/).map((item) => item.trim()).filter(Boolean) : [];
  const training = (doctor.training ?? "").split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
  const subSpecialties = (doctor.subSpecialties ?? "").split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
  const languages = (doctor.languages ?? "").split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
  const procedures = (doctor.procedures ?? "").split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
  const modes = databaseRecord
    ? doctor.consultationModes.split(",").map((mode) => mode.trim()).filter(Boolean)
    : [doctor.consultationType].filter(Boolean);

  return {
    id: doctor.slug ?? doctor.id,
    name: doctor.displayName ?? doctor.name,
    specialty: typeof doctor.specialty === "string" ? doctor.specialty : doctor.specialty?.name,
    image: doctor.imageUrl ?? doctor.image,
    introduction: doctor.summary ?? doctor.biography ?? doctor.bio,
    biography: doctor.biography ?? doctor.bio,
    experienceYears: doctor.experienceYears,
    education,
    certifications,
    qualifications,
    experience: doctor.experience ?? [],
    services: databaseRecord && typeof doctor.services === "string" ? doctor.services.split(/\r?\n/).map((title) => title.trim()).filter(Boolean).map((title) => ({ title })) : services,
    professionalTitle: doctor.professionalTitle,
    university: doctor.university,
    training,
    subSpecialties,
    languages,
    procedures,
    procedureCount: doctor.procedureCount,
    practiceStartYear: doctor.practiceStartYear,
    clinicName: doctor.clinicName,
    location: doctor.location,
    consultationModes: modes,
    timeZone: doctor.timeZone,
    availabilities: doctor.availabilities ?? [],
  };
}

function hasValue(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export default function DatabaseDoctorProfile({ doctor, isDemo = false }) {
  const profile = profileFields(doctor);
  const years = typeof profile.experienceYears === "number"
    ? profile.experienceYears > 0 ? `${profile.experienceYears}+` : ""
    : hasValue(profile.experienceYears) ? profile.experienceYears : "";
  const hasQualifications = profile.education.length > 0 || profile.certifications.length > 0 || profile.qualifications.length > 0 || profile.training.length > 0 || hasValue(profile.university);

  return <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
    <div className="mx-auto max-w-6xl space-y-7 sm:space-y-9">
      <Link href="/explore" className="inline-flex items-center gap-2 text-sm font-semibold text-[#344B72] transition hover:text-[#263F3A]">← Back to doctors</Link>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="grid lg:grid-cols-[minmax(18rem,0.8fr)_1.2fr]">
          <div className="relative min-h-80 bg-[#EEF2EB] sm:min-h-[26rem]">
            <DoctorPortrait src={profile.image} alt={`${profile.name} portrait`} fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover object-center" priority />
          </div>
          <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-12">
            {isDemo && <p className="mb-3 w-fit rounded-full bg-[#F3E8D5] px-3 py-1.5 text-xs font-bold text-[#684B37]">Sample profile · not accepting bookings</p>}
            {profile.specialty && <p className="w-fit rounded-full bg-[#EEF2EB] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[#344B72]">{profile.specialty}</p>}
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">{profile.name}</h1>
            {profile.professionalTitle && <p className="mt-2 text-lg font-semibold text-[#344B72]">{profile.professionalTitle}</p>}
            {profile.introduction && <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">{profile.introduction}</p>}

            <div className="mt-6 flex flex-wrap gap-2">
              {!isDemo && years && <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700">{years} years of experience listed</span>}
              {!isDemo && profile.practiceStartYear && <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700">Practicing since {profile.practiceStartYear}</span>}
              {profile.clinicName && <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700">{profile.clinicName}</span>}
              {!isDemo && profile.consultationModes.map((mode) => <span key={mode} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700">{mode === "VIDEO" ? "Video consultation" : mode === "IN_PERSON" ? "In-person care" : mode}</span>)}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {!isDemo && <Link href={`/doctors/${profile.id}/appointment`} className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#263F3A] px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-[#1D302D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#263F3A]">View available appointments</Link>}
            </div>
          </div>
        </div>
      </section>

      {(profile.biography || profile.introduction) && <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-bold uppercase tracking-wider text-[#344B72]">Profile</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900">About {profile.name}</h2>
        <p className="mt-4 max-w-4xl whitespace-pre-line leading-7 text-slate-600">{profile.biography || profile.introduction}</p>
      </section>}

      {!isDemo && profile.experience.length > 0 && <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-2xl font-bold text-slate-900">Professional experience</h2>
        <ol className="mt-6 space-y-5">
          {profile.experience.map((item, index) => <li key={`${item.role}-${index}`} className="border-l-2 border-blue-600 pl-5">
            {item.duration && <p className="text-xs font-semibold uppercase tracking-wide text-[#344B72]">{item.duration}</p>}
            {item.role && <h3 className="mt-1 font-bold text-slate-900">{item.role}</h3>}
            {item.facility && <p className="mt-1 text-sm text-slate-600">{item.facility}</p>}
            {item.description && <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>}
          </li>)}
        </ol>
      </section>}

      {!isDemo && hasQualifications && <div className="grid gap-6 md:grid-cols-2">
        {(profile.education.length > 0 || profile.qualifications.length > 0 || hasValue(profile.university)) && <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-bold text-slate-900">Education & qualifications</h2>
          {profile.university && <p className="mt-4 text-sm leading-6 text-slate-700"><span className="font-semibold">University:</span> {profile.university}</p>}
          {profile.education.length > 0 && <ul className="mt-5 space-y-3">{profile.education.map((item, index) => <li key={`${item.institution}-${index}`} className="rounded-xl bg-slate-50 p-4">
            <p className="font-semibold text-slate-900">{item.degree}</p>
            <p className="mt-1 text-sm text-slate-600">{item.institution}{item.year ? ` · ${item.year}` : ""}</p>
          </li>)}</ul>}
          {profile.qualifications.length > 0 && <ul className="mt-5 space-y-2">{profile.qualifications.map((item, index) => <li key={`${item}-${index}`} className="text-sm leading-6 text-slate-700">{item}</li>)}</ul>}
          {profile.training.length > 0 && <div className="mt-5"><h3 className="font-semibold text-slate-900">Additional training</h3><ul className="mt-2 space-y-2">{profile.training.map((item, index) => <li key={`${item}-${index}`} className="text-sm leading-6 text-slate-700">{item}</li>)}</ul></div>}
        </section>}
        {profile.certifications.length > 0 && <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-bold text-slate-900">Certifications</h2>
          <ul className="mt-5 space-y-3">{profile.certifications.map((item, index) => <li key={`${item}-${index}`} className="flex gap-3 text-sm leading-6 text-slate-700"><span aria-hidden="true" className="text-[#344B72]">✓</span><span>{item}</span></li>)}</ul>
        </section>}
      </div>}

      {!isDemo && profile.services.length > 0 && <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-2xl font-bold text-slate-900">Areas of care & services</h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {profile.services.map((service, index) => <li key={`${service.title}-${index}`} className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
            <h3 className="font-semibold text-slate-900">{service.title}</h3>
            {service.description && <p className="mt-2 text-sm leading-6 text-slate-600">{service.description}</p>}
          </li>)}
        </ul>
      </section>}

      {!isDemo && (profile.subSpecialties.length > 0 || profile.languages.length > 0 || profile.procedures.length > 0 || profile.procedureCount !== null && profile.procedureCount !== undefined) && <section className="grid gap-6 md:grid-cols-2">
        {profile.subSpecialties.length > 0 && <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><h2 className="text-xl font-bold text-slate-900">Subspecialties</h2><ul className="mt-4 flex flex-wrap gap-2">{profile.subSpecialties.map((item) => <li key={item} className="rounded-full bg-[#EEF2EB] px-3 py-1.5 text-sm text-slate-700">{item}</li>)}</ul></div>}
        {profile.languages.length > 0 && <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><h2 className="text-xl font-bold text-slate-900">Languages</h2><ul className="mt-4 flex flex-wrap gap-2">{profile.languages.map((item) => <li key={item} className="rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700">{item}</li>)}</ul></div>}
        {profile.procedures.length > 0 && <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><h2 className="text-xl font-bold text-slate-900">Procedures</h2><ul className="mt-4 list-inside list-disc space-y-2 text-sm leading-6 text-slate-700">{profile.procedures.map((item) => <li key={item}>{item}</li>)}</ul></div>}
        {profile.procedureCount !== null && profile.procedureCount !== undefined && <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><h2 className="text-xl font-bold text-slate-900">Procedure count</h2><p className="mt-3 text-sm text-slate-700">{profile.procedureCount.toLocaleString()} recorded</p></div>}
      </section>}

      {!isDemo && (profile.clinicName || profile.location || profile.availabilities.length > 0) && <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-2xl font-bold text-slate-900">Clinic & schedule</h2>
        <dl className="mt-5 grid gap-4 sm:grid-cols-2">
          {profile.clinicName && <div><dt className="text-xs font-bold uppercase tracking-wide text-slate-500">Clinic</dt><dd className="mt-1 font-medium text-slate-800">{profile.clinicName}</dd></div>}
          {profile.location && <div><dt className="text-xs font-bold uppercase tracking-wide text-slate-500">Location</dt><dd className="mt-1 font-medium text-slate-800">{profile.location}</dd></div>}
        </dl>
        {profile.availabilities.length > 0 && <div className="mt-6">
          <h3 className="text-sm font-bold text-slate-800">Working days</h3>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {profile.availabilities.map((item) => <li key={item.id} className="rounded-xl bg-slate-50 p-4 text-sm">
              <p className="font-semibold text-slate-800">{weekdays[item.weekday]}</p>
              <p className="mt-1 text-slate-600">{item.startTime}–{item.endTime} · {item.slotMinutes}-minute appointments</p>
              <p className="mt-1 text-xs text-slate-500">{item.timeZone}</p>
            </li>)}
          </ul>
        </div>}
      </section>}

      <p className="text-xs leading-5 text-slate-500">{isDemo ? "Illustrative profile content only. It does not represent an enrolled clinician or a live appointment schedule." : "Contact the practice to confirm credentials, services, and current appointment availability."}</p>
      {!isDemo && <section className="rounded-3xl bg-[#263F3A] p-7 text-center text-white shadow-sm sm:p-10">
        <h2 className="text-2xl font-bold sm:text-3xl">Plan your visit</h2>
        <p className="mx-auto mt-3 max-w-xl leading-6 text-blue-100">Choose from appointment times published by the clinic for {profile.name}.</p>
        <Link href={`/doctors/${profile.id}/appointment`} className="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl bg-white px-7 py-3 font-bold text-[#263F3A] transition hover:bg-[#EEF2EB] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">View appointment calendar</Link>
      </section>}
    </div>
  </main>;
}

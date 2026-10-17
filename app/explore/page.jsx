import React from 'react'
import ClinicHero from "./component/ClinicHero";
import ClinicReception from "./component/ClinicReception";
import ClinicWaiting from "./component/ClinicWaiting";
import ClinicFacilities from "./component/ClinicFacilities";
import DoctorDirectory from "./DoctorDirectory";
import { doctors } from "@/lib/doctor-data";






async function page({ searchParams }) {
  const params = await searchParams;
  const specialty = typeof params?.specialty === "string" ? params.specialty : "";
  return (
    <div>
      <main className="bg-slate-50 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold text-[#344B72]">Find a clinician</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">Find care that fits your needs</h1>
          <p className="mt-3 max-w-2xl text-slate-600">Explore clinician profiles and care options by specialty. Contact the practice to confirm credentials, services, and current appointment availability.</p>
          <DoctorDirectory doctors={doctors} initialSpecialty={specialty} />
        </div>
      </main>
      <ClinicHero />
      <ClinicReception/>
      <ClinicWaiting/>
      <ClinicFacilities />

    </div>
  )
}

export default page

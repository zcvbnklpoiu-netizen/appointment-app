import React from 'react'
import ClinicHero from "./component/ClinicHero";
import ClinicReception from "./component/ClinicReception";
import ClinicWaiting from "./component/ClinicWaiting";
import ClinicFacilities from "./component/ClinicFacilities";






function page() {
  return (
    <div>
      <ClinicHero />
      <ClinicReception/>
      <ClinicWaiting/>
      <ClinicFacilities />

    </div>
  )
}

export default page

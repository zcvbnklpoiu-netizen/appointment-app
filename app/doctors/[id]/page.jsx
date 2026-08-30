import Image from 'next/image';
import Link from 'next/link';

export function generateStaticParams() {
  return [
    { id: 'james-anderson' },
    { id: 'michael-carter' },
    { id: 'daniel-wilson' },
    { id: 'ethan-brown' },
    { id: 'william-taylor' },
    { id: 'alexander-moore' },
    { id: 'oliver-smith' },
    { id: 'sophia-williams' },
    { id: 'olivia-davis' },
    { id: 'emma-thompson' },
    { id: 'charlotte-miller' },
    { id: 'emily-johnson' },
  ];
}

const doctorsData = {
  'james-anderson': {
    id: 'james-anderson',
    name: 'Dr. James Anderson',
    specialty: 'Orthopedic Surgeon',
    image: '/doctor1.png',
    experienceYears: '15+',
    patientsServed: '4,500+',
    clinicName: 'Apex Orthopedic & Joint Center',
    location: 'Building A, Suite 300, Medical Arts District',
    availability: 'Mon - Thu (8:00 AM - 4:00 PM)',
    consultationType: 'In-Person & Surgical Consults',

    contact: {
      phone: '+201000000001',
      email: 'james.anderson@example.com',
    },

    bio: 'Dr. James Anderson is a highly dedicated Orthopedic Surgeon specializing in minimally invasive joint preservation, sports injury recovery, and advanced reconstructive surgery. With over 15 years of surgical experience, he focuses on restoring joint mobility and improving long-term quality of life.',

    experience: [
      {
        role: 'Senior Orthopedic Surgeon',
        facility: 'Apex Orthopedic Center',
        duration: '2018 - Present',
        description:
          'Leading complex joint reconstruction and arthroscopic sports medicine procedures.',
      },
      {
        role: 'Attending Surgeon',
        facility: 'Metropolitan Surgical Hospital',
        duration: '2012 - 2018',
        description:
          'Managed acute musculoskeletal trauma and reconstructive limb procedures.',
      },
    ],

    education: [
      {
        degree: 'Doctor of Medicine (M.D.)',
        institution: 'Harvard Medical School',
        year: '2008',
      },
      {
        degree: 'Orthopedic Surgery Residency',
        institution: 'Johns Hopkins Hospital',
        year: '2013',
      },
    ],

    certifications: [
      'Board Certified by the American Board of Orthopaedic Surgery',
      'Fellow of the American Academy of Orthopaedic Surgeons (FAAOS)',
    ],

    services: [
      {
        title: 'Orthopedic Consultation',
        description:
          'Comprehensive evaluation of joint pain, bone injuries, and functional mobility limitations.',
      },
      {
        title: 'Joint Assessment',
        description:
          'Advanced diagnostic imaging and structural evaluation for surgical or non-surgical intervention.',
      },
      {
        title: 'Musculoskeletal Evaluation',
        description:
          'Detailed functional screening for chronic muscle, tendon, and ligament conditions.',
      },
      {
        title: 'Recovery Planning',
        description:
          'Customized post-operative rehabilitation and physical therapy recovery pathways.',
      },
    ],

    expertise: [
      'Joint Preservation',
      'Arthroscopic Surgery',
      'Sports Injury Rehabilitation',
      'Complex Fracture Care',
      'Rotator Cuff Repair',
    ],

    achievements: [
      'Pioneered advanced minimally invasive knee preservation procedures.',
      'Recipient of the Regional Healthcare Award for Surgical Excellence (2023).',
    ],

    patientCareApproach:
      'My objective is to evaluate non-surgical alternatives first and reserve surgical intervention for when it truly provides the best path back to an active lifestyle.',
  },

  'michael-carter': {
    id: 'michael-carter',
    name: 'Dr. Michael Carter',
    specialty: 'Cardiologist',
    image: '/doctor2.png',
    experienceYears: '14+',
    patientsServed: '5,200+',
    clinicName: 'Heart & Vascular Health Institute',
    location: 'Suite 402, Central Cardiology Plaza',
    availability: 'Mon - Fri (8:30 AM - 5:00 PM)',
    consultationType: 'In-Person & Virtual Consultation',

    contact: {
      phone: '+201000000002',
      email: 'michael.carter@example.com',
    },

    bio: 'Dr. Michael Carter is a board-certified Cardiologist focused on preventive cardiology, heart failure management, and non-invasive cardiovascular diagnostics. He emphasizes early cardiovascular risk detection and holistic lifestyle modifications.',

    experience: [
      {
        role: 'Chief of Clinical Cardiology',
        facility: 'Heart & Vascular Institute',
        duration: '2017 - Present',
        description:
          'Overseeing diagnostic echocardiography programs and hypertension clinical pathways.',
      },
      {
        role: 'Staff Cardiologist',
        facility: 'St. Jude Medical Center',
        duration: '2011 - 2017',
        description:
          'Managed inpatient coronary care units and preventative cardiac screening clinics.',
      },
    ],

    education: [
      {
        degree: 'Doctor of Medicine (M.D.)',
        institution: 'Columbia University College of Physicians',
        year: '2007',
      },
      {
        degree: 'Cardiology Fellowship',
        institution: 'Mayo Clinic School of Medicine',
        year: '2012',
      },
    ],

    certifications: [
      'Board Certified in Cardiovascular Disease (ABIM)',
      'Certified Specialist in Adult Comprehensive Echocardiography',
    ],

    services: [
      {
        title: 'Cardiac Consultation',
        description:
          'Comprehensive cardiac health screening, ECG evaluation, and cardiovascular risk assessment.',
      },
      {
        title: 'Heart Health Assessment',
        description:
          'In-depth functional screening including lipid profiling, stress testing, and vascular checks.',
      },
      {
        title: 'Preventive Cardiology',
        description:
          'Targeted lifestyle and clinical management plans to prevent coronary artery disease.',
      },
      {
        title: 'Blood Pressure Management',
        description:
          'Personalized treatment protocols for resistant hypertension and vascular wellness.',
      },
    ],

    expertise: [
      'Preventive Cardiology',
      'Echocardiography',
      'Hypertension Management',
      'Heart Failure Care',
      'Lipidology',
    ],

    achievements: [
      'Author of multiple clinical publications on preventative cardiovascular health.',
      'Named Top Regional Cardiologist for Patient Satisfaction.',
    ],

    patientCareApproach:
      'Clear communication and proactive risk management are the foundation of cardiac longevity. I partner with patients to keep their heart health on track.',
  },

  'daniel-wilson': {
    id: 'daniel-wilson',
    name: 'Dr. Daniel Wilson',
    specialty: 'Neurologist',
    image: '/doctor3.png',
    experienceYears: '12+',
    patientsServed: '3,800+',
    clinicName: 'NeuroScience & Brain Health Clinic',
    location: 'Building C, Suite 105, Medical Plaza',
    availability: 'Tue - Fri (9:00 AM - 4:00 PM)',
    consultationType: 'In-Person & Telehealth',

    contact: {
      phone: '+201000000003',
      email: 'daniel.wilson@example.com',
    },

    bio: 'Dr. Daniel Wilson specializes in clinical neurology, focusing on the diagnosis and long-term care of migraines, nerve health, epilepsy, and neurodegenerative conditions through cutting-edge, patient-focused protocols.',

    experience: [
      {
        role: 'Consulting Neurologist',
        facility: 'NeuroScience Center',
        duration: '2018 - Present',
        description:
          'Leading outpatient clinical assessments for chronic migraine and neuromuscular disorders.',
      },
      {
        role: 'Neurology Clinical Fellow',
        facility: 'Massachusetts General Hospital',
        duration: '2013 - 2018',
        description:
          'Conducted electroencephalography (EEG) research and nerve conduction studies.',
      },
    ],

    education: [
      {
        degree: 'Doctor of Medicine (M.D.)',
        institution: 'Yale School of Medicine',
        year: '2009',
      },
      {
        degree: 'Neurology Residency',
        institution: 'NYU Langone Health',
        year: '2014',
      },
    ],

    certifications: [
      'Board Certified by the American Board of Psychiatry and Neurology',
      'Clinical Neurophysiology Certified Specialist',
    ],

    services: [
      {
        title: 'Neurological Consultation',
        description:
          'Thorough assessment of central and peripheral nervous system symptoms and motor functions.',
      },
      {
        title: 'Migraine & Headache Evaluation',
        description:
          'Specialized therapeutic protocols for recurring, treatment-resistant chronic headaches.',
      },
      {
        title: 'Nerve Health Screening',
        description:
          'Diagnostic motor skill, sensory, and reflex evaluations for peripheral neuropathy.',
      },
      {
        title: 'Cognitive & Memory Assessment',
        description:
          'Early screening protocols for cognitive changes and memory health tracking.',
      },
    ],

    expertise: [
      'Migraine Management',
      'Epilepsy & Seizures',
      'Peripheral Neuropathy',
      'Parkinson’s Care',
      'Neuroimaging Interpretation',
    ],

    achievements: [
      'Developed standardized clinical guidelines for outpatient migraine management.',
      'Invited speaker at the National Neurological Association Conference.',
    ],

    patientCareApproach:
      'Neurological symptoms require methodical diagnostic rigor combined with empathetic reassurance so patients understand every step of their treatment plan.',
  },

  'ethan-brown': {
    id: 'ethan-brown',
    name: 'Dr. Ethan Brown',
    specialty: 'Pediatrician',
    image: '/doctor4.png',
    experienceYears: '10+',
    patientsServed: '6,000+',
    clinicName: 'Bright Futures Pediatric Care',
    location: 'Suite 201, Family Health Center',
    availability: 'Mon - Fri (8:00 AM - 4:30 PM)',
    consultationType: 'In-Person & Telehealth',

    contact: {
      phone: '+201000000004',
      email: 'ethan.brown@example.com',
    },

    bio: 'Dr. Ethan Brown provides comprehensive pediatric medical care from infancy through adolescence. His practice prioritizes developmental milestone monitoring, preventive wellness, and child-friendly care environments.',

    experience: [
      {
        role: 'Lead Pediatrician',
        facility: 'Bright Futures Pediatrics',
        duration: '2017 - Present',
        description:
          'Managing well-child developmental evaluations, childhood immunizations, and acute care.',
      },
      {
        role: 'Pediatric Resident Physician',
        facility: 'Boston Children’s Hospital',
        duration: '2014 - 2017',
        description:
          'Delivered pediatric inpatient care and emergency pediatric evaluations.',
      },
    ],

    education: [
      {
        degree: 'Doctor of Medicine (M.D.)',
        institution: 'University of Pennsylvania',
        year: '2011',
      },
      {
        degree: 'Pediatric Residency',
        institution: 'Children’s Hospital of Philadelphia',
        year: '2014',
      },
    ],

    certifications: [
      'Board Certified by the American Board of Pediatrics',
      'Pediatric Advanced Life Support (PALS) Certified',
    ],

    services: [
      {
        title: 'Pediatric Consultation',
        description:
          'Routine healthcare evaluations, physical checkups, and growth assessments for children.',
      },
      {
        title: 'Developmental Assessment',
        description:
          'Monitoring behavioral, physical, and cognitive milestones from infancy through teens.',
      },
      {
        title: 'Childhood Immunizations',
        description:
          'Administering standard childhood vaccination schedules following public health guidelines.',
      },
      {
        title: 'Acute Pediatric Care',
        description:
          'Prompt evaluation for common childhood illnesses, ear infections, and minor injuries.',
      },
    ],

    expertise: [
      'Childhood Wellness',
      'Growth & Development',
      'Pediatric Asthma Care',
      'Immunizations',
      'Adolescent Medicine',
    ],

    achievements: [
      'Community Advocate for Pediatric Literacy and Preventative Healthcare.',
      'Awarded "Compassionate Pediatrician of the Year" (2022).',
    ],

    patientCareApproach:
      'Children thrive in environments where they feel safe. I focus on creating a gentle, positive healthcare experience for young patients and their families.',
  },

  'william-taylor': {
    id: 'william-taylor',
    name: 'Dr. William Taylor',
    specialty: 'Dermatologist',
    image: '/doctor5.png',
    experienceYears: '11+',
    patientsServed: '4,100+',
    clinicName: 'ClearSkin Dermatology Center',
    location: 'Suite 304, Wellness Pavilion',
    availability: 'Mon - Thu (9:00 AM - 5:00 PM)',
    consultationType: 'In-Person Consultation',

    contact: {
      phone: '+201000000005',
      email: 'william.taylor@example.com',
    },

    bio: 'Dr. William Taylor is a board-certified Dermatologist focusing on medical dermatology, skin cancer screening, acne management, and inflammatory skin condition therapies.',

    experience: [
      {
        role: 'Staff Dermatologist',
        facility: 'ClearSkin Dermatology',
        duration: '2016 - Present',
        description:
          'Providing dermoscopic skin cancer exams and clinical care for chronic skin diseases.',
      },
      {
        role: 'Dermatology Resident',
        facility: 'Stanford University Medical Center',
        duration: '2013 - 2016',
        description:
          'Performed outpatient dermatologic procedures and skin biopsies.',
      },
    ],

    education: [
      {
        degree: 'Doctor of Medicine (M.D.)',
        institution: 'Stanford University School of Medicine',
        year: '2010',
      },
      {
        degree: 'Dermatology Residency',
        institution: 'UCLA Medical Center',
        year: '2014',
      },
    ],

    certifications: [
      'Board Certified by the American Board of Dermatology',
      'Fellow of the American Academy of Dermatology (FAAD)',
    ],

    services: [
      {
        title: 'Dermatological Consultation',
        description:
          'Evaluation of skin rashes, moles, acne, rosacea, and general skin health concerns.',
      },
      {
        title: 'Skin Cancer Screening',
        description:
          'Full-body dermoscopic examinations for early detection of dysplastic nevi and skin lesions.',
      },
      {
        title: 'Acne & Rosacea Management',
        description:
          'Customized therapeutic management plans for resistant inflammatory skin conditions.',
      },
      {
        title: 'Eczema & Psoriasis Care',
        description:
          'Targeted biological and topical regimens for chronic inflammatory skin relief.',
      },
    ],

    expertise: [
      'Skin Cancer Screening',
      'Acne Management',
      'Eczema & Psoriasis',
      'Dermoscopy',
      'Surgical Excision',
    ],

    achievements: [
      'Lead author on clinical studies regarding early detection of skin lesions.',
      'Active member of the International Society of Dermatology.',
    ],

    patientCareApproach:
      'Dermatology requires precision and attention to detail. I work closely with patients to restore healthy skin function and confidence.',
  },

  'alexander-moore': {
    id: 'alexander-moore',
    name: 'Dr. Alexander Moore',
    specialty: 'Ophthalmologist',
    image: '/doctor6.png',
    experienceYears: '13+',
    patientsServed: '3,900+',
    clinicName: 'ClearVision Eye & Laser Institute',
    location: 'Building B, Suite 102, Vision Plaza',
    availability: 'Mon - Fri (8:30 AM - 4:00 PM)',
    consultationType: 'In-Person Evaluation',

    contact: {
      phone: '+201000000006',
      email: 'alexander.moore@example.com',
    },

    bio: 'Dr. Alexander Moore provides advanced medical eye care, specializing in cataract evaluation, glaucoma management, laser vision correction, and total ocular health.',

    experience: [
      {
        role: 'Attending Ophthalmologist',
        facility: 'ClearVision Eye Institute',
        duration: '2016 - Present',
        description:
          'Managing corneal evaluations, glaucoma therapies, and surgical cataract consults.',
      },
      {
        role: 'Ophthalmology Fellow',
        facility: 'Wills Eye Hospital',
        duration: '2012 - 2016',
        description:
          'Specialized in anterior segment procedures and refractive surgery techniques.',
      },
    ],

    education: [
      {
        degree: 'Doctor of Medicine (M.D.)',
        institution: 'UC San Francisco School of Medicine',
        year: '2009',
      },
      {
        degree: 'Ophthalmology Residency',
        institution: 'Wills Eye Hospital',
        year: '2013',
      },
    ],

    certifications: [
      'Board Certified by the American Board of Ophthalmology',
      'Member of the American Society of Cataract and Refractive Surgery',
    ],

    services: [
      {
        title: 'Eye Consultation',
        description:
          'Comprehensive vision exams, intraocular pressure testing, and retinal evaluations.',
      },
      {
        title: 'Cataract Assessment',
        description:
          'Pre-operative diagnostic planning and advanced intraocular lens selection.',
      },
      {
        title: 'Glaucoma Screening',
        description:
          'Early detection protocols and medical therapies for intraocular pressure control.',
      },
      {
        title: 'Corneal Health Care',
        description:
          'Therapeutic management for chronic dry eye and corneal surface disorders.',
      },
    ],

    expertise: [
      'Cataract Care',
      'Glaucoma Management',
      'Laser Vision Evaluation',
      'Dry Eye Therapy',
      'Corneal Health',
    ],

    achievements: [
      'Recognized for excellence in clinical intraocular diagnostics.',
      'Pioneered local outpatient dry-eye therapy clinics.',
    ],

    patientCareApproach:
      'Preserving vision requires meticulous diagnostic accuracy and gentle patient interactions to ensure lifetime ocular health.',
  },

  'oliver-smith': {
    id: 'oliver-smith',
    name: 'Dr. Oliver Smith',
    specialty: 'Internal Medicine',
    image: '/doctor7.png',
    experienceYears: '16+',
    patientsServed: '7,100+',
    clinicName: 'Premier Internal Medicine Associates',
    location: 'Suite 500, Health Alliance Building',
    availability: 'Mon - Fri (8:00 AM - 5:00 PM)',
    consultationType: 'In-Person & Virtual Consultation',

    contact: {
      phone: '+201000000007',
      email: 'oliver.smith@example.com',
    },

    bio: 'Dr. Oliver Smith is an experienced Internist managing complex adult health conditions, chronic disease prevention, diagnostic health evaluations, and primary adult healthcare.',

    experience: [
      {
        role: 'Senior Internist',
        facility: 'Premier Internal Medicine',
        duration: '2014 - Present',
        description:
          'Providing continuous adult primary care, metabolic screening, and disease prevention.',
      },
      {
        role: 'Attending Physician',
        facility: 'University Hospital Center',
        duration: '2008 - 2014',
        description:
          'Managed inpatient internal medicine wards and resident teaching programs.',
      },
    ],

    education: [
      {
        degree: 'Doctor of Medicine (M.D.)',
        institution: 'Duke University School of Medicine',
        year: '2005',
      },
      {
        degree: 'Internal Medicine Residency',
        institution: 'Johns Hopkins Bayview',
        year: '2008',
      },
    ],

    certifications: [
      'Board Certified in Internal Medicine (ABIM)',
      'Fellow of the American College of Physicians (FACP)',
    ],

    services: [
      {
        title: 'Internal Medicine Consultation',
        description:
          'In-depth comprehensive health physicals and multi-system organ health evaluations.',
      },
      {
        title: 'Chronic Disease Management',
        description:
          'Coordinated long-term management for diabetes, cholesterol, and blood pressure.',
      },
      {
        title: 'Adult Wellness Physical',
        description:
          'Preventative health screenings, blood panels, and age-appropriate wellness plans.',
      },
      {
        title: 'Diagnostic Evaluation',
        description:
          'Investigation of complex, unexplained symptoms requiring holistic medical inquiry.',
      },
    ],

    expertise: [
      'Preventive Medicine',
      'Metabolic Syndrome Care',
      'Hypertension Control',
      'Geriatric Health',
      'Diagnostic Assessment',
    ],

    achievements: [
      'Fellowship status granted by the American College of Physicians.',
      'Over 15 years of dedicated primary adult care service.',
    ],

    patientCareApproach:
      'Internal medicine is like fitting together a complex medical puzzle. I focus on understanding the whole patient rather than isolated symptoms.',
  },

  'sophia-williams': {
    id: 'sophia-williams',
    name: 'Dr. Sophia Williams',
    specialty: 'Dentist',
    image: '/doctor9.png',
    experienceYears: '9+',
    patientsServed: '3,200+',
    clinicName: 'Aesthetic & Preventative Dental Studio',
    location: 'Suite 101, Dental Arts Building',
    availability: 'Mon - Thu (8:30 AM - 4:30 PM)',
    consultationType: 'In-Person Consultation',

    contact: {
      phone: '+201000000009',
      email: 'sophia.williams@example.com',
    },

    bio: 'Dr. Sophia Williams offers comprehensive general and preventative dental care. She focuses on patient comfort, gentle oral care procedures, and maintaining healthy smiles.',

    experience: [
      {
        role: 'Lead Dentist',
        facility: 'Dental Studio',
        duration: '2018 - Present',
        description:
          'Delivering preventative oral health checks, restorative treatments, and dental hygiene care.',
      },
      {
        role: 'Associate Dentist',
        facility: 'City Dental Care',
        duration: '2015 - 2018',
        description:
          'Performed routine restorative procedures and preventative patient consultations.',
      },
    ],

    education: [
      {
        degree: 'Doctor of Dental Surgery (D.D.S.)',
        institution: 'NYU College of Dentistry',
        year: '2013',
      },
      {
        degree: 'General Practice Residency',
        institution: 'Mount Sinai Hospital',
        year: '2014',
      },
    ],

    certifications: [
      'Licensed by the State Dental Board',
      'Active Member of the American Dental Association (ADA)',
    ],

    services: [
      {
        title: 'Dental Consultation',
        description:
          'Comprehensive oral examinations, digital radiography, and gum health checks.',
      },
      {
        title: 'Oral Health Assessment',
        description:
          'Screening for enamel wear, periodontal conditions, and structural tooth integrity.',
      },
      {
        title: 'Preventive Dental Care',
        description:
          'Professional teeth cleanings, fluoride applications, and plaque prevention protocols.',
      },
      {
        title: 'Dental Follow-up',
        description:
          'Post-treatment oral health checks and long-term hygiene routine planning.',
      },
    ],

    expertise: [
      'Preventative Dentistry',
      'Restorative Oral Care',
      'Periodontal Health',
      'Patient Comfort Care',
      'Dental Hygiene',
    ],

    achievements: [
      'Recognized for exceptional gentle care in patient satisfaction surveys.',
      'Active participant in community oral health awareness events.',
    ],

    patientCareApproach:
      'Dental visits should be anxiety-free. I prioritize gentle care and clear communication to make every visit as comfortable as possible.',
  },

  'olivia-davis': {
    id: 'olivia-davis',
    name: 'Dr. Olivia Davis',
    specialty: 'ENT Specialist',
    image: '/doctor10.png',
    experienceYears: '12+',
    patientsServed: '4,000+',
    clinicName: 'Ear, Nose & Throat Care Specialists',
    location: 'Suite 203, Medical Tower West',
    availability: 'Tue - Fri (9:00 AM - 4:30 PM)',
    consultationType: 'In-Person Evaluation',

    contact: {
      phone: '+201000000010',
      email: 'olivia.davis@example.com',
    },

    bio: 'Dr. Olivia Davis is an Otolaryngologist specializing in disorders of the ear, nose, and throat. She provides targeted medical evaluations for sinus issues, hearing health, and throat disorders.',

    experience: [
      {
        role: 'Consulting Otolaryngologist',
        facility: 'ENT Care Specialists',
        duration: '2017 - Present',
        description:
          'Managing sinus pathologies, chronic vertigo, and voice/swallowing disorders.',
      },
      {
        role: 'ENT Clinical Fellow',
        facility: 'Northwestern Memorial Hospital',
        duration: '2012 - 2017',
        description:
          'Provided endoscopic sinus assessments and otologic evaluations.',
      },
    ],

    education: [
      {
        degree: 'Doctor of Medicine (M.D.)',
        institution: 'Georgetown University School of Medicine',
        year: '2009',
      },
      {
        degree: 'Otolaryngology Residency',
        institution: 'Northwestern University',
        year: '2014',
      },
    ],

    certifications: [
      'Board Certified by the American Board of Otolaryngology',
      'Member of the American Academy of Otolaryngology-Head and Neck Surgery',
    ],

    services: [
      {
        title: 'ENT Consultation',
        description:
          'Evaluation of persistent sinus symptoms, throat irritation, and auditory concerns.',
      },
      {
        title: 'Sinus & Allergy Assessment',
        description:
          'Nasal endoscopy and airway assessments for chronic sinusitis and nasal blockages.',
      },
      {
        title: 'Hearing & Balance Evaluation',
        description:
          'Otologic screening for tinnitus, age-related hearing changes, and vertigo symptoms.',
      },
      {
        title: 'Throat & Voice Care',
        description:
          'Clinical examination of vocal cord function, swallowing issues, and throat discomfort.',
      },
    ],

    expertise: [
      'Sinus Pathology',
      'Nasal Endoscopy',
      'Otology & Balance',
      'Voice Disorders',
      'Allergy Management',
    ],

    achievements: [
      'Pioneered outpatient endoscopic sinus screening protocols.',
      'Published researcher on vocal cord management.',
    ],

    patientCareApproach:
      'Upper airway and sensory health directly affect daily comfort. I aim to provide clear diagnostic answers and targeted relief.',
  },

  'emma-thompson': {
    id: 'emma-thompson',
    name: 'Dr. Emma Thompson',
    specialty: 'General Surgeon',
    image: '/doctor11.png',
    experienceYears: '15+',
    patientsServed: '3,600+',
    clinicName: 'Surgical Associates & Hernia Center',
    location: 'Building A, 4th Floor, Surgical Pavilion',
    availability: 'Mon - Thu (8:00 AM - 3:30 PM)',
    consultationType: 'In-Person Surgical Consultation',

    contact: {
      phone: '+201000000011',
      email: 'emma.thompson@example.com',
    },

    bio: 'Dr. Emma Thompson is an experienced General Surgeon specializing in laparoscopic procedures, hernia repair, abdominal wall reconstruction, and outpatient surgical management.',

    experience: [
      {
        role: 'Attending General Surgeon',
        facility: 'Surgical Associates Center',
        duration: '2016 - Present',
        description:
          'Specializing in minimally invasive laparoscopic surgery and soft tissue repairs.',
      },
      {
        role: 'Staff General Surgeon',
        facility: 'City General Hospital',
        duration: '2010 - 2016',
        description:
          'Managed acute surgical cases and outpatient surgical evaluations.',
      },
    ],

    education: [
      {
        degree: 'Doctor of Medicine (M.D.)',
        institution: 'Washington University School of Medicine',
        year: '2006',
      },
      {
        degree: 'General Surgery Residency',
        institution: 'Barnes-Jewish Hospital',
        year: '2011',
      },
    ],

    certifications: [
      'Board Certified by the American Board of Surgery',
      'Fellow of the American College of Surgeons (FACS)',
    ],

    services: [
      {
        title: 'Surgical Consultation',
        description:
          'In-depth consultation to determine surgical necessity and pre-operative preparation.',
      },
      {
        title: 'Abdominal Wall Assessment',
        description:
          'Evaluation for inguinal, umbilical, and incisional hernia management options.',
      },
      {
        title: 'Laparoscopic Evaluation',
        description:
          'Minimally invasive diagnostic assessments for gallstones and abdominal pain.',
      },
      {
        title: 'Post-Surgical Follow-up',
        description:
          'Structured post-operative care, wound healing checks, and recovery tracking.',
      },
    ],

    expertise: [
      'Laparoscopic Surgery',
      'Hernia Repair',
      'Abdominal Surgery',
      'Wound Management',
      'Surgical Pre-care',
    ],

    achievements: [
      'Over 15 years of dedicated surgical service with high safety ratings.',
      'Fellow of the American College of Surgeons.',
    ],

    patientCareApproach:
      'Surgery can be intimidating. I ensure patients fully understand their procedures, risks, and recovery pathways beforehand.',
  },

  'charlotte-miller': {
    id: 'charlotte-miller',
    name: 'Dr. Charlotte Miller',
    specialty: 'Psychiatrist',
    image: '/doctor12.png',
    experienceYears: '11+',
    patientsServed: '2,900+',
    clinicName: 'MindCare Behavioral Health Center',
    location: 'Suite 305, Serenity Health Building',
    availability: 'Mon - Fri (9:00 AM - 5:00 PM)',
    consultationType: 'In-Person & Telehealth',

    contact: {
      phone: '+201000000012',
      email: 'charlotte.miller@example.com',
    },

    bio: 'Dr. Charlotte Miller provides empathetic psychiatric care, specializing in mood disorders, anxiety management, stress resilience, and adult behavioral health.',

    experience: [
      {
        role: 'Consulting Psychiatrist',
        facility: 'MindCare Behavioral Health',
        duration: '2018 - Present',
        description:
          'Delivering adult psychiatric assessments and personalized psychopharmacological care.',
      },
      {
        role: 'Psychiatry Resident',
        facility: 'NYU School of Medicine',
        duration: '2014 - 2018',
        description:
          'Provided clinical psychiatric evaluations and crisis intervention services.',
      },
    ],

    education: [
      {
        degree: 'Doctor of Medicine (M.D.)',
        institution: 'Cornell University Weill Medicine',
        year: '2011',
      },
      {
        degree: 'Psychiatry Residency',
        institution: 'NYU Langone Health',
        year: '2015',
      },
    ],

    certifications: [
      'Board Certified by the American Board of Psychiatry and Neurology',
      'Member of the American Psychiatric Association (APA)',
    ],

    services: [
      {
        title: 'Psychiatric Consultation',
        description:
          'Comprehensive mental health diagnostic evaluations and personalized treatment plans.',
      },
      {
        title: 'Mood & Anxiety Assessment',
        description:
          'Clinical screening for depression, generalized anxiety, and stress disorders.',
      },
      {
        title: 'Medication Management',
        description:
          'Precise psychotropic medication evaluation and ongoing safety monitoring.',
      },
      {
        title: 'Mental Wellness Follow-up',
        description:
          'Regular consultations to track clinical progress and emotional resilience.',
      },
    ],

    expertise: [
      'Anxiety Disorders',
      'Mood Disorders',
      'Adult ADHD Management',
      'Psychopharmacology',
      'Stress Management',
    ],

    achievements: [
      'Advocate for accessible mental healthcare and public wellness outreach.',
      'Recognized for exceptional compassionate care in patient feedback.',
    ],

    patientCareApproach:
      'Mental wellness requires a supportive, non-judgmental environment. I prioritize active listening and collaborative treatment planning.',
  },

  'emily-johnson': {
    id: 'emily-johnson',
    name: 'Dr. Emily Johnson',
    specialty: 'Gynecologist',
    image: '/doctor8.png',
    experienceYears: '14+',
    patientsServed: '4,800+',
    clinicName: 'Women’s Comprehensive Health Center',
    location: 'Suite 400, Women’s Care Pavilion',
    availability: 'Mon - Fri (8:30 AM - 4:30 PM)',
    consultationType: 'In-Person Care',

    contact: {
      phone: '+201000000008',
      email: 'emily.johnson@example.com',
    },

    bio: 'Dr. Emily Johnson provides comprehensive women’s reproductive healthcare, preventative annual wellness checks, hormonal health support, and specialized gynecological evaluations.',

    experience: [
      {
        role: 'Attending Gynecologist',
        facility: 'Women’s Care Pavilion',
        duration: '2015 - Present',
        description:
          'Managing preventative wellness exams, reproductive health, and hormone therapy.',
      },
      {
        role: 'OB/GYN Resident',
        facility: 'Northwestern Memorial Hospital',
        duration: '2010 - 2015',
        description:
          'Delivered clinical gynecological care and outpatient procedures.',
      },
    ],

    education: [
      {
        degree: 'Doctor of Medicine (M.D.)',
        institution: 'Georgetown University',
        year: '2008',
      },
      {
        degree: 'OB/GYN Residency',
        institution: 'Northwestern Memorial Hospital',
        year: '2012',
      },
    ],

    certifications: [
      'Board Certified by the American Board of Obstetrics and Gynecology (ABOG)',
      'Fellow of the American College of Obstetricians and Gynecologists (FACOG)',
    ],

    services: [
      {
        title: 'Gynecological Consultation',
        description:
          'Comprehensive wellness exams, cervical screenings, and reproductive health discussions.',
      },
      {
        title: 'Hormonal Health Assessment',
        description:
          'Diagnostic evaluation for hormonal transitions, PCOS, and menstrual irregularities.',
      },
      {
        title: 'Preventative Wellness Exam',
        description:
          'Annual health physicals including Pap smears and pelvic clinical exams.',
      },
      {
        title: 'Reproductive Care Follow-up',
        description:
          'Targeted care plans for long-term reproductive health and wellness support.',
      },
    ],

    expertise: [
      'Preventative Wellness',
      'Hormonal Health',
      'Reproductive Care',
      'Pelvic Health',
      'Menopause Support',
    ],

    achievements: [
      'Community Speaker on Women’s Health Education.',
      'Recipient of the Outstanding Women’s Caregiver Award.',
    ],

    patientCareApproach:
      'Women’s healthcare should be grounded in comfort, trust, and continuous guidance across every stage of life.',
  },
};

export default async function DoctorPortfolioPage({ params }) {
  const { id } = await params;

  const doctor = doctorsData[id];

  if (!doctor) {
    return (
      <main className="min-h-[80vh] flex items-center justify-center bg-slate-50 px-4 py-16">
        <div className="max-w-md w-full text-center bg-white p-8 rounded-3xl border border-slate-200 shadow-md">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-2xl">
            !
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Doctor Not Found
          </h1>

          <p className="text-slate-600 text-sm mb-6">
            The doctor profile you are searching for does not exist or may have
            been updated.
          </p>

          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            ← Back to Doctors List
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-slate-50 min-h-screen py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8 md:space-y-12">

        {/* Navigation */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Back to All Doctors
          </Link>
        </div>

        {/* HERO */}
        <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 lg:p-10 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-56 h-56 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner">
                <Image
                  src={doctor.image}
                  alt={doctor.name}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover object-center"
                />
              </div>
            </div>

            <div className="lg:col-span-7 text-center lg:text-left space-y-4">

              <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-xs tracking-wide uppercase">
                {doctor.specialty}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
                {doctor.name}
              </h1>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                {doctor.bio}
              </p>

              <div className="pt-2 grid grid-cols-2 sm:grid-cols-3 gap-3 text-left">

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-xs font-medium">
                    Experience
                  </span>

                  <span className="font-bold text-slate-800 text-sm">
                    {doctor.experienceYears} Years
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-xs font-medium">
                    Degree
                  </span>

                  <span className="font-bold text-slate-800 text-sm">
                    {doctor.education[0]?.degree.split('(')[0]}
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 col-span-2 sm:col-span-1">
                  <span className="text-slate-400 block text-xs font-medium">
                    Primary Clinic
                  </span>

                  <span className="font-bold text-slate-800 text-sm truncate block">
                    {doctor.clinicName}
                  </span>
                </div>

              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">

                <Link
                  href={`/appointment?doctor=${doctor.id}`}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all shadow-md text-center"
                >
                  Book Appointment
                </Link>

                <a
                  href={`mailto:${doctor.contact.email}`}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition-all text-center"
                >
                  Contact Doctor
                </a>

              </div>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-3">
          <h2 className="text-2xl font-bold text-slate-900">
            About {doctor.name}
          </h2>

          <p className="text-slate-600 leading-relaxed">
            {doctor.bio}
          </p>
        </section>

        {/* EXPERIENCE */}
        <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">

          <h2 className="text-2xl font-bold text-slate-900">
            Professional Experience
          </h2>

          <div className="space-y-6">
            {doctor.experience.map((exp, idx) => (
              <div
                key={idx}
                className="border-l-2 border-blue-600 pl-4 space-y-1"
              >
                <span className="text-xs font-semibold text-blue-600">
                  {exp.duration}
                </span>

                <h3 className="text-lg font-bold text-slate-800">
                  {exp.role}
                </h3>

                <p className="text-sm font-medium text-slate-500">
                  {exp.facility}
                </p>

                <p className="text-sm text-slate-600 mt-1">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* EDUCATION + CERTIFICATIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">

            <h2 className="text-2xl font-bold text-slate-900">
              Education & Training
            </h2>

            <ul className="space-y-4">
              {doctor.education.map((edu, idx) => (
                <li
                  key={idx}
                  className="bg-slate-50 p-4 rounded-xl space-y-1 border border-slate-100"
                >
                  <span className="text-xs text-slate-400 font-semibold">
                    {edu.year}
                  </span>

                  <h3 className="font-bold text-slate-800">
                    {edu.degree}
                  </h3>

                  <p className="text-sm text-slate-600">
                    {edu.institution}
                  </p>
                </li>
              ))}
            </ul>

          </section>

          <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">

            <h2 className="text-2xl font-bold text-slate-900">
              Certifications
            </h2>

            <ul className="space-y-3">
              {doctor.certifications.map((cert, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 text-slate-700 text-sm"
                >
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>{cert}</span>
                </li>
              ))}
            </ul>

          </section>

        </div>

        {/* SERVICES */}
        <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">

          <h2 className="text-2xl font-bold text-slate-900">
            Medical Services
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {doctor.services.map((service, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl border border-slate-200/70 bg-slate-50/50 hover:bg-slate-50 transition-colors"
              >
                <h3 className="font-bold text-slate-800 text-base mb-1">
                  {service.title}
                </h3>

                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}

          </div>
        </section>

        {/* EXPERTISE */}
        <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">

          <h2 className="text-2xl font-bold text-slate-900">
            Areas of Expertise
          </h2>

          <div className="flex flex-wrap gap-2">
            {doctor.expertise.map((item, idx) => (
              <span
                key={idx}
                className="px-4 py-2 bg-blue-50 text-blue-800 font-semibold text-xs sm:text-sm rounded-xl"
              >
                {item}
              </span>
            ))}
          </div>

        </section>

        {/* ACHIEVEMENTS + APPROACH */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">

            <h2 className="text-2xl font-bold text-slate-900">
              Professional Achievements
            </h2>

            <ul className="space-y-3">
              {doctor.achievements.map((achieve, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 text-slate-600 text-sm"
                >
                  <span className="text-amber-500 font-bold">★</span>
                  <span>{achieve}</span>
                </li>
              ))}
            </ul>

          </section>

          <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">

            <h2 className="text-2xl font-bold text-slate-900">
              Patient-Care Approach
            </h2>

            <p className="text-slate-600 text-sm leading-relaxed italic border-l-4 border-blue-500 pl-4 py-1">
              "{doctor.patientCareApproach}"
            </p>

          </section>

        </div>

        {/* STATISTICS */}
        <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">

          <div className="flex items-center justify-between">

            <h2 className="text-2xl font-bold text-slate-900">
              Clinical Highlights
            </h2>

            <span className="text-xs font-semibold text-slate-400">
              Sample Statistics
            </span>

          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="block text-2xl font-extrabold text-blue-600">
                {doctor.experienceYears}
              </span>

              <span className="text-xs text-slate-500 font-medium">
                Years Experience
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="block text-2xl font-extrabold text-blue-600">
                {doctor.patientsServed}
              </span>

              <span className="text-xs text-slate-500 font-medium">
                Patients Served
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="block text-2xl font-extrabold text-blue-600">
                {doctor.services.length}
              </span>

              <span className="text-xs text-slate-500 font-medium">
                Core Services
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="block text-2xl font-extrabold text-blue-600">
                {doctor.expertise.length}
              </span>

              <span className="text-xs text-slate-500 font-medium">
                Specializations
              </span>
            </div>

          </div>
        </section>

        {/* CLINIC */}
        <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">

          <h2 className="text-2xl font-bold text-slate-900">
            Clinic & Practice Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-xs text-slate-400 block font-medium">
                Clinic Name
              </span>

              <span className="font-semibold text-slate-800">
                {doctor.clinicName}
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-xs text-slate-400 block font-medium">
                Location
              </span>

              <span className="font-semibold text-slate-800">
                {doctor.location}
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-xs text-slate-400 block font-medium">
                Schedule
              </span>

              <span className="font-semibold text-slate-800">
                {doctor.availability}
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-xs text-slate-400 block font-medium">
                Consultation Type
              </span>

              <span className="font-semibold text-slate-800">
                {doctor.consultationType}
              </span>
            </div>

          </div>
        </section>

        {/* FINAL CTA */}
        <section
          id="book-appointment"
          className="bg-blue-600 rounded-3xl p-8 sm:p-12 text-center text-white space-y-6 shadow-lg"
        >

          <div className="max-w-2xl mx-auto space-y-2">

            <h2 className="text-3xl font-extrabold">
              Ready to Book Your Appointment?
            </h2>

            <p className="text-blue-100 text-sm sm:text-base">
              Schedule a consultation with {doctor.name} today for personalized medical care.
            </p>

          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">

            <Link
              href={`/appointment?doctor=${doctor.id}`}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-blue-600 font-semibold hover:bg-blue-50 transition-all shadow-md text-center"
            >
              Book Appointment
            </Link>

            <a
              href={`tel:${doctor.contact.phone}`}
              className="w-full sm:w-auto px-8 py-3.5 bg-blue-700 text-white font-semibold rounded-xl hover:bg-blue-800 transition-colors border border-blue-500 text-center"
            >
              Contact Doctor
            </a>

          </div>

        </section>

      </div>
    </main>
  );
}
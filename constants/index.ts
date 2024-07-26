export const GenderOptions = ["male", "female", "other"];

const CreateAppointmentDefaultValues = {
  selectedDoctor: "",
  scheduledTime: new Date(),
  notes: "",
  visitReason: "",
};

const CancelAppointmentDefaultValues = {
  selectedDoctor: "",
  scheduledTime: new Date(),
  cancellationReason: "",
};

export function getAppointmentDefaultValues(type: string) {
  switch (type) {
    case "create":
      return CreateAppointmentDefaultValues;
    case "cancel":
      return CancelAppointmentDefaultValues;
    default:
      return CreateAppointmentDefaultValues;
  }
}

export const PatientFormDefaultValues = {
  name: "",
  email: "",
  phone: "",
  birthDate: new Date("1990-01-01"),
  gender: "female" as Gender,
  address: "",
  occupation: "",
  emergencyContactName: "",
  emergencyContactNumber: "",
  primaryDoctor: "",
  insuranceProvider: "",
  insurancePolicyNumber: "",
  allergies: "",
  currentMedication: "",
  familyMedicalHistory: "",
  pastMedicalHistory: "",
  identificationType: "National ID Card",
  identificationNumber: "",
  identificationDocument: [],
  privacyConsent: false,
};

export const IdentificationTypes = [
  "National ID Card",
  "Passport",
  "Birth Certificate",
  "Driver's License",
];

export const Doctors = [
  {
    image: "/assets/images/dr-green.png",
    name: "John Green",
  },
  {
    image: "/assets/images/dr-cameron.png",
    name: "Leila Cameron",
  },
  {
    image: "/assets/images/dr-livingston.png",
    name: "David Livingston",
  },
  {
    image: "/assets/images/dr-peter.png",
    name: "Evan Peter",
  },
  {
    image: "/assets/images/dr-powell.png",
    name: "Jane Powell",
  },
  {
    image: "/assets/images/dr-remirez.png",
    name: "Alex Ramirez",
  },
  {
    image: "/assets/images/dr-lee.png",
    name: "Jasmine Lee",
  },
  {
    image: "/assets/images/dr-cruz.png",
    name: "Alyana Cruz",
  },
  {
    image: "/assets/images/dr-sharma.png",
    name: "Hardik Sharma",
  },
];

export const StatusIcon = {
  scheduled: "/assets/icons/check.svg",
  pending: "/assets/icons/pending.svg",
  cancelled: "/assets/icons/cancelled.svg",
};

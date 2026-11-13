export type Role = "admin" | "analyst";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  zoneId: string;
  org?: string;
}

export const DEMO_ACCOUNTS: { email: string; password: string; user: AppUser }[] = [
  {
    email: "admin@urbansense.ai",
    password: "demo1234",
    user: {
      id: "u-1",
      name: "Meera Deshpande",
      email: "admin@urbansense.ai",
      role: "admin",
      zoneId: "Z-04",
      org: "Municipal Command Centre",
    },
  },
  {
    email: "analyst@urbansense.ai",
    password: "demo1234",
    user: {
      id: "u-2",
      name: "Dr. Vikram Nair",
      email: "analyst@urbansense.ai",
      role: "analyst",
      zoneId: "Z-01",
      org: "Urban Climate Research Lab",
    },
  },
];

export type User = {
  id: number;
  name: string;
  role: string;
};

/**
 * Mock fetch function that simulates an API call returning a list of users.
 * Returns a Promise that resolves after a short timeout.
 */
export const fetchUsers = (): Promise<User[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: "Meera Deshpande", role: "admin" },
        { id: 2, name: "Dr. Vikram Nair", role: "analyst" },
      ]);
    }, 500);
  });
};

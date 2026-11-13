import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/layouts/AppLayout";
import { fetchUsers, User } from "@/services/UserService";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/admin/users")({
  component: UserManagement,
});

function UserManagement() {
  const {
    data: users,
    isLoading,
    error,
  } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  if (isLoading) {
    return (
      <AppLayout title="User Management">
        <Card className="border-none shadow-premium bg-primary text-white rounded-[2rem] overflow-hidden">
          <CardHeader>
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent>Loading users...</CardContent>
        </Card>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout title="User Management">
        <Card className="border-none shadow-premium bg-primary text-white rounded-[2rem] overflow-hidden">
          <CardHeader>
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent>Error loading users.</CardContent>
        </Card>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="User Management">
      <Card className="border-none shadow-premium bg-primary text-white rounded-[2rem] overflow-hidden">
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm border-collapse">
            <thead className="bg-[var(--admin-primary)] text-white">
              <tr>
                <th className="p-2 text-left">ID</th>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Role</th>
              </tr>
            </thead>
            <tbody className="bg-white text-foreground">
              {users?.map((user) => (
                <tr key={user.id} className="border-b last:border-0">
                  <td className="p-2">{user.id}</td>
                  <td className="p-2">{user.name}</td>
                  <td className="p-2 capitalize">{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
export default UserManagement;

'use client';

import { useUser } from '@clerk/nextjs';
import AdminDashboard from "@/components/AdminDashboard";
import EcommerceLanding from "@/components/UserDashboard";

export default function Home() {
  const { user, isLoaded } = useUser();

  // Show loading state while user data is being fetched
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-600 border-t-transparent"></div>
          <p className="text-gray-600 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user has admin role
  const isAdmin = user?.publicMetadata?.role === 'admin';

  // Render based on user role
  if (isAdmin) {
    return <AdminDashboard />;
  } else {
    return <EcommerceLanding />;
  }
}

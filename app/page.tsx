'use client';

import { useUser } from '@clerk/nextjs';
import AdminDashboard from "@/components/AdminDashboard";
import EcommerceLanding from "@/components/UserDashboard"; 

export default function Home() {
  const {  user, isLoaded } = useUser();

  // Show loading state while user data is being fetched
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
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
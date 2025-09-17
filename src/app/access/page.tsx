export default function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4 text-red-600">Access Denied</h1>
      <p className="text-lg mb-6">
        You do not have permission to view this page.
      </p>
    </div>
  );
}

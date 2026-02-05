const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6 mx-auto space-y-10 max-w-7xl">

        {/* ================= WELCOME ================= */}
        <div>
          <h2 className="text-3xl font-semibold">
            Welcome back, {user?.name || "User"} 👋
          </h2>
          <p className="mt-2 text-gray-600">
            Manage your services, track jobs, and stay updated.
          </p>
        </div>

        {/* ================= STATS ================= */}
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="p-6 bg-white shadow-sm rounded-xl">
            <h3 className="text-sm text-gray-500">Total Jobs Posted</h3>
            <p className="mt-2 text-3xl font-bold">12</p>
          </div>

          <div className="p-6 bg-white shadow-sm rounded-xl">
            <h3 className="text-sm text-gray-500">Active Requests</h3>
            <p className="mt-2 text-3xl font-bold text-blue-600">3</p>
          </div>

          <div className="p-6 bg-white shadow-sm rounded-xl">
            <h3 className="text-sm text-gray-500">Completed Jobs</h3>
            <p className="mt-2 text-3xl font-bold text-green-600">9</p>
          </div>

          <div className="p-6 bg-white shadow-sm rounded-xl">
            <h3 className="text-sm text-gray-500">Average Rating</h3>
            <p className="mt-2 text-3xl font-bold text-yellow-500">4.6★</p>
          </div>
        </section>

        {/* ================= RECENT JOBS ================= */}
        <section className="p-6 bg-white shadow-sm rounded-xl">
          <h3 className="mb-4 text-xl font-semibold">Recent Job Requests</h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b">
              <div>
                <p className="font-medium">Electrician Service</p>
                <p className="text-sm text-gray-500">Location: Patna</p>
              </div>
              <span className="font-medium text-blue-600">In Progress</span>
            </div>

            <div className="flex items-center justify-between pb-3 border-b">
              <div>
                <p className="font-medium">Plumbing Repair</p>
                <p className="text-sm text-gray-500">Location: Delhi</p>
              </div>
              <span className="font-medium text-green-600">Completed</span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Home Cleaning</p>
                <p className="text-sm text-gray-500">Location: Lucknow</p>
              </div>
              <span className="font-medium text-yellow-600">Scheduled</span>
            </div>
          </div>
        </section>

        {/* ================= PROFILE SUMMARY ================= */}
        <section className="grid gap-6 p-6 bg-white shadow-sm rounded-xl md:grid-cols-2">
          <div>
            <h3 className="mb-2 text-xl font-semibold">Profile Overview</h3>
            <p className="text-sm text-gray-600">
              Keep your profile updated to get better service matches.
            </p>

            <ul className="mt-4 space-y-2 text-sm">
              <li><strong>Name:</strong> {user?.name || "Demo User"}</li>
              <li><strong>Email:</strong> {user?.email || "demo@hhc.com"}</li>
              <li><strong>Role:</strong> Customer</li>
              <li><strong>Member Since:</strong> Jan 2024</li>
            </ul>
          </div>

          <div className="flex items-center justify-center">
            <button className="px-6 py-3 text-white bg-blue-600 rounded-lg">
              Edit Profile
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Dashboard;

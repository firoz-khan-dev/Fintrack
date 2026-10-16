import { useEffect, useState } from "react";
import api from "../services/api";
import {
  FaUsers,
  FaUserEdit,
  FaTrash,
  FaEnvelope,
  FaSignInAlt,
  FaSignOutAlt,
  FaSearch,
} from "react-icons/fa";

function Admin() {
  const [contactDate, setContactDate] = useState("");
  const [activeMenu, setActiveMenu] = useState("overview");

  // USERS
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [userSearch, setUserSearch] = useState("");
  const [usersLoading, setUsersLoading] = useState(false);

  // EDIT USER
  const [editingUser, setEditingUser] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  // CONTACT
  const [contactMessages, setContactMessages] = useState([]);
  const [contactLoading, setContactLoading] = useState(false);

  // ACTIVITY
  const [activities, setActivities] = useState([]);
  const [activityLoading, setActivityLoading] = useState(false);
  const [activityFilter, setActivityFilter] = useState("all");
  const [activityDate, setActivityDate] = useState("");
  const [activitySearch, setActivitySearch] = useState("");

  const [loading, setLoading] = useState(true);

  // ---------- API ----------
  async function handleDeleteContact(id) {
    if (!window.confirm("Are you sure you want to delete this message?"))
      return;
    try {
      await api.delete(`/contact/delete/${id}`);
      getContactMessages();
    } catch (error) {
      console.log("Delete contact error:", error);
      console.log("Server error:", error.response?.data);
      alert(error.response?.data?.message || "Something went wrong");
    }
  }

  async function handleDeleteActivity(id) {
    if (!window.confirm("Are you sure you want to delete this activity?"))
      return;
    try {
      await api.delete(`/activity/delete/${id}`);
      getActivities();
    } catch (error) {
      console.log("Delete activity error:", error);
      console.log("Server error:", error.response?.data);
    }
  }

  async function getAdminData() {
    try {
      setLoading(true);
      const response = await api.get("/admin/overview");
      setTotalUsers(response.data.totalUsers || 0);
      await getActivities();
    } catch (error) {
      console.log("Admin data error:", error);
      console.log("Server error:", error.response?.data);
    } finally {
      setLoading(false);
    }
  }

  async function getUsers() {
    try {
      setUsersLoading(true);
      const response = await api.get("/admin/users");
      const allUsers = response.data.users || [];
      setUsers(allUsers);
      setTotalUsers(allUsers.length);
    } catch (error) {
      console.log("Users error:", error);
      console.log("Server error:", error.response?.data);
    } finally {
      setUsersLoading(false);
    }
  }

  async function getContactMessages() {
    try {
      setContactLoading(true);
      const response = await api.get("/contact/getAll");
      setContactMessages(response.data.messages || []);
    } catch (error) {
      console.log("Contact messages error:", error);
      console.log("Server error:", error.response?.data);
    } finally {
      setContactLoading(false);
    }
  }

  async function getActivities() {
    try {
      setActivityLoading(true);
      const response = await api.get("/activity/getAll");
      setActivities(response.data.activities || []);
    } catch (error) {
      console.log("Activity error:", error);
      console.log("Server error:", error.response?.data);
    } finally {
      setActivityLoading(false);
    }
  }

  function handleMenuChange(menu) {
    setActiveMenu(menu);
    if (menu === "users") getUsers();
    if (menu === "contact") getContactMessages();
    if (menu === "overview") getAdminData();
  }

  async function handleDeleteUser(id) {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/admin/users/delete/${id}`);
      alert("User deleted successfully");
      getUsers();
    } catch (error) {
      console.log("Delete user error:", error);
      console.log("Server error:", error.response?.data);
    }
  }

  function handleEditUser(user) {
    setEditingUser(user);
    setEditName(user.name || "");
    setEditEmail(user.email || "");
  }

  async function handleUpdateUser(e) {
    e.preventDefault();
    try {
      await api.put(`/admin/users/update/${editingUser._id}`, {
        name: editName,
        email: editEmail,
      });
      alert("User updated successfully");
      setEditingUser(null);
      getUsers();
    } catch (error) {
      console.log("Update user error:", error);
      console.log("Server error:", error.response?.data);
    }
  }

  // ---------- HELPERS ----------
  function formatDate(date) {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function formatTime(date) {
    if (!date) return "-";
    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function formatLastActive(date) {
    if (!date) return "Never";
    const difference = new Date() - new Date(date);
    const minutes = Math.floor(difference / (1000 * 60));
    const hours = Math.floor(difference / (1000 * 60 * 60));
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hr ago`;
    if (days < 7) return `${days} days ago`;
    return formatDate(date);
  }

  const filteredActivities = activities.filter((activity) => {
    const search = activitySearch.toLowerCase();
    const userName = activity.userId?.name?.toLowerCase() || "";
    const userEmail = activity.userId?.email?.toLowerCase() || "";

    if (search && !userName.includes(search) && !userEmail.includes(search))
      return false;
    if (activityFilter !== "all" && activity.type !== activityFilter)
      return false;
    if (activityDate) {
      const d = new Date(activity.createdAt).toLocaleDateString("en-CA");
      if (d !== activityDate) return false;
    }
    return true;
  });

  const filteredUsers = users.filter((user) => {
    const search = userSearch.toLowerCase();
    return (
      user.name?.toLowerCase().includes(search) ||
      user.email?.toLowerCase().includes(search)
    );
  });

  const filteredContactMessages = contactMessages.filter((message) => {
    if (!contactDate) return true;
    return (
      new Date(message.createdAt).toLocaleDateString("en-CA") === contactDate
    );
  });

  useEffect(() => {
    getAdminData();
  }, []);

  // SHARED CLASSES
  const menuBtn = (name) =>
    `shrink-0 whitespace-nowrap text-left px-4 py-2.5 md:py-3 rounded-lg transition ${
      activeMenu === name
        ? "bg-green-500 text-black font-semibold"
        : "text-gray-300 hover:bg-white/5"
    }`;

  const section = "p-4 sm:p-6 lg:p-8 md:flex-1 md:min-h-0 md:flex md:flex-col";
  const card =
    "bg-[#151517] border border-white/10 rounded-2xl overflow-hidden md:flex-1 md:min-h-0 md:flex md:flex-col";
  const cardHeader =
    "shrink-0 p-4 sm:p-6 border-b border-white/10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4";
  const input =
    "rounded-lg border border-white/10 bg-black px-4 py-2 text-white outline-none focus:border-green-500 w-full sm:w-auto";
  const tableWrap =
    "overflow-auto max-h-[65vh] md:max-h-none md:flex-1 md:min-h-0";
  const th = "px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap";
  const td = "px-4 sm:px-6 py-3 sm:py-4";
  const iconBtn =
    "size-9 shrink-0 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition";

  //  UI
  return (
    <div className="min-h-screen md:h-screen md:overflow-hidden bg-[#0F0F10] text-white flex flex-col md:flex-row pt-15 md:pt-0">
      {/* SIDEBAR (top bar on mobile, fixed side panel on md+) */}
      <aside className="w-full md:w-64 bg-[#151517] border-b md:border-b-0 md:border-r border-white/10 md:fixed md:left-0 md:top-15 md:h-[calc(100vh-3.75rem)] z-20">
        <div className="px-4 py-3 md:p-6 md:border-b border-white/10 flex items-baseline justify-between md:block">
          <h1 className="text-xl md:text-2xl font-bold">
            Fin<span className="text-green-500">Track</span>
          </h1>
          <p className="text-gray-300 text-sm md:mt-1">Admin Panel</p>
        </div>

        <div className="px-4 pb-3 md:p-4 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
          <button
            onClick={() => handleMenuChange("overview")}
            className={menuBtn("overview")}
          >
            Overview
          </button>
          <button
            onClick={() => handleMenuChange("users")}
            className={menuBtn("users")}
          >
            Users
          </button>
          <button
            onClick={() => handleMenuChange("contact")}
            className={menuBtn("contact")}
          >
            Contact Messages
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 min-w-0 md:ml-64 md:pt-15 md:h-screen md:flex md:flex-col md:min-h-0">
        {/* OVERVIEW */}
        {activeMenu === "overview" && (
          <section className={section}>
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold">
                Admin <span className="text-blue-500">Overview</span>
              </h1>
              <p className="text-gray-300 mt-1">Monitor user activity</p>
            </div>

            <div className={card}>
              <div className={cardHeader}>
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold">
                    Recent Activity
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">
                    User login and logout activity
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-10">
                  {/* Search */}
                  <div className="relative w-full sm:w-80">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300" />

                    <input
                      type="text"
                      placeholder="Search name or email..."
                      value={activitySearch}
                      onChange={(e) => setActivitySearch(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2 text-black outline-none focus:border-green-500 placeholder:text-gray-500 dark:border-white/10 dark:bg-black/50 dark:text-white dark:placeholder:text-gray-300"
                    />
                  </div>

                  {/* Date */}
                  <input
                    type="date"
                    value={activityDate}
                    onChange={(e) => setActivityDate(e.target.value)}
                    className={`${input} w-full sm:w-56 bg-black/50 text-white [color-scheme:dark] `}
                  />

                  {/* Filter */}
                  <select
                    value={activityFilter}
                    onChange={(e) => setActivityFilter(e.target.value)}
                    className={`${input} w-full sm:w-56 bg-black/50 text-white [color-scheme:white]`}
                  >
                    <option value="all">All Activity</option>
                    <option value="login">Login</option>
                    <option value="logout">Logout</option>
                  </select>
                </div>
              </div>

              {activityLoading ? (
                <div className="p-10 text-center text-gray-400">
                  Loading activities...
                </div>
              ) : filteredActivities.length === 0 ? (
                <div className="p-10 text-center text-gray-400">
                  No activity found
                </div>
              ) : (
                <div className={tableWrap}>
                  <table className="w-full min-w-[640px]">
                    <thead className="bg-[#151517] sticky top-0 z-10">
                      <tr className="text-left text-gray-400 text-sm">
                        <th className={th}>User</th>
                        <th className={`${th} hidden md:table-cell`}>Email</th>
                        <th className={th}>Activity</th>
                        <th className={`${th} hidden sm:table-cell`}>Date</th>
                        <th className={th}>Time</th>
                        <th className={`${th} hidden lg:table-cell`}>
                          Last Active
                        </th>
                        <th className={th}>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredActivities.map((activity) => (
                        <tr
                          key={activity._id}
                          className="border-t border-white/5 hover:bg-white/[0.02]"
                        >
                          <td className={td}>
                            <div className="flex items-center gap-3">
                              <div className="size-9 shrink-0 rounded-full bg-green-500/10 flex items-center justify-center">
                                <FaUsers className="text-green-500" />
                              </div>
                              <div className="min-w-0">
                                <span className="block truncate max-w-[10rem]">
                                  {activity.userId?.name || "Unknown"}
                                </span>
                                <span className="block md:hidden text-xs text-gray-500 truncate max-w-[10rem]">
                                  {activity.userId?.email || "-"}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td
                            className={`${td} hidden md:table-cell text-gray-400`}
                          >
                            {activity.userId?.email || "-"}
                          </td>

                          <td className={td}>
                            {activity.type === "login" ? (
                              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-sm">
                                <FaSignInAlt /> Login
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-sm">
                                <FaSignOutAlt /> Logout
                              </span>
                            )}
                          </td>

                          <td
                            className={`${td} hidden sm:table-cell text-gray-400 whitespace-nowrap`}
                          >
                            {formatDate(activity.createdAt)}
                          </td>

                          <td
                            className={`${td} text-gray-400 whitespace-nowrap`}
                          >
                            {formatTime(activity.createdAt)}
                          </td>

                          <td
                            className={`${td} hidden lg:table-cell text-gray-400 whitespace-nowrap`}
                          >
                            {formatLastActive(activity.createdAt)}
                          </td>

                          <td className={td}>
                            <button
                              onClick={() => handleDeleteActivity(activity._id)}
                              className={`${iconBtn} cursor-pointer`}
                              title="Delete Activity"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        )}

        {/* USERS */}
        {activeMenu === "users" && (
          <section className={section}>
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Users</h1>
                <p className="text-gray-300 mt-1">
                  Manage all registered users
                </p>
              </div>

              {/* TOTAL USERS */}
              <div className="w-full md:w-72 bg-[#151517] border-y border-green-500/50 rounded-2xl p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-200">Total Users</p>
                    <h2 className="text-3xl font-bold mt-2">
                      {usersLoading ? "..." : totalUsers}
                    </h2>
                  </div>
                  <div className="size-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <FaUsers className="text-green-500 size-6" />
                  </div>
                </div>
              </div>
            </div>

            <div className={card}>
              <div className={cardHeader}>
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold">
                    All Users
                  </h2>
                  <p className="text-gray-300 text-sm mt-1">
                    Manage registered users
                  </p>
                </div>

                <div className="relative w-full lg:w-80 mr-10">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300" />

                  <input
                    type="text"
                    placeholder="Search name or email..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="bg-white text-black border border-gray-300 rounded-lg pl-10 pr-4 py-2 w-full outline-none focus:border-green-500 placeholder:text-gray-500 dark:bg-black/50 dark:text-white dark:border-white/10 dark:placeholder:text-gray-300"
                  />
                </div>
              </div>

              {usersLoading ? (
                <div className="p-10 text-center text-gray-400">
                  Loading users...
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="p-10 text-center text-gray-400">
                  No users found
                </div>
              ) : (
                <div className={tableWrap}>
                  <table className="w-full min-w-[520px]">
                    <thead className="bg-[#151517] sticky top-0 z-10">
                      <tr className="text-left text-gray-400 text-sm">
                        <th className={th}>Name</th>
                        <th className={`${th} hidden md:table-cell`}>Email</th>
                        <th className={th}>Role</th>
                        <th className={`${th} hidden sm:table-cell`}>
                          Created
                        </th>
                        <th className={th}>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr
                          key={user._id}
                          className="border-t border-white/5 hover:bg-white/[0.02]"
                        >
                          <td className={td}>
                            <div className="flex items-center gap-3">
                              <div className="size-9 shrink-0 rounded-full bg-green-500/10 flex items-center justify-center">
                                <FaUsers className="text-green-500" />
                              </div>
                              <div className="min-w-0">
                                <span className="block truncate max-w-[10rem]">
                                  {user.name}
                                </span>
                                <span className="block md:hidden text-xs text-gray-500 truncate max-w-[10rem]">
                                  {user.email}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td
                            className={`${td} hidden md:table-cell text-gray-400`}
                          >
                            {user.email}
                          </td>

                          <td className={td}>
                            <span
                              className={`px-3 py-1 rounded-full text-sm ${
                                user.role === "admin"
                                  ? "bg-purple-500/10 text-purple-400"
                                  : "bg-green-500/10 text-green-500"
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>

                          <td
                            className={`${td} hidden sm:table-cell text-gray-400 whitespace-nowrap`}
                          >
                            {formatDate(user.createdAt)}
                          </td>

                          <td className={td}>
                            <div className="flex items-center gap-5">
                              <button
                                onClick={() => handleEditUser(user)}
                                className="size-9 shrink-0 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center hover:bg-blue-500 hover:text-white transition cursor-pointer"
                                title="Edit User"
                              >
                                <FaUserEdit />
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user._id)}
                                className={`${iconBtn} cursor-pointer`}
                                title="Delete User"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        )}

        {/* CONTACT MESSAGES */}
        {activeMenu === "contact" && (
          <section className={section}>
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold">
                Contact <span className="text-green-500">Messages</span>
              </h1>
              <p className="text-gray-300 mt-1">Messages received from users</p>
            </div>

            <div className={card}>
              <div className={cardHeader}>
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold">
                    All Messages
                  </h2>
                  <p className="text-gray-300 text-sm mt-1">
                    Messages received from users
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-5 ">
                  <input
                    type="date"
                    value={contactDate}
                    onChange={(e) => setContactDate(e.target.value)}
                    className={`${input} w-full lg:w-64 bg-black/50 text-white [color-scheme:dark]`}
                  />

                  <button
                    onClick={() => setContactDate("")}
                    className="w-full sm:w-56 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 transition cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {contactLoading ? (
                <div className="p-10 text-center text-gray-400">
                  Loading messages...
                </div>
              ) : filteredContactMessages.length === 0 ? (
                <div className="p-10 text-center text-gray-400">
                  No messages found
                </div>
              ) : (
                <div className={tableWrap}>
                  <table className="w-full min-w-[560px]">
                    <thead className="bg-[#151517] sticky top-0 z-10">
                      <tr className="text-left text-gray-400 text-sm">
                        <th className={th}>Name</th>
                        <th className={`${th} hidden lg:table-cell`}>Email</th>
                        <th className={th}>Subject</th>
                        <th className={th}>Message</th>
                        <th className={`${th} hidden sm:table-cell`}>Date</th>
                        <th className={th}>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredContactMessages.map((message) => (
                        <tr
                          key={message._id}
                          className="border-t border-white/5 hover:bg-white/[0.02] align-top"
                        >
                          <td className={td}>
                            <span className="block">{message.name}</span>
                            <span className="block lg:hidden text-xs text-gray-500 break-all">
                              {message.email}
                            </span>
                          </td>

                          <td
                            className={`${td} hidden lg:table-cell text-gray-400`}
                          >
                            <div className="flex items-center gap-2">
                              <FaEnvelope className="text-green-500 shrink-0" />
                              <span className="break-all">{message.email}</span>
                            </div>
                          </td>

                          <td
                            className={`${td} text-gray-300 max-w-[10rem] md:max-w-xs break-words`}
                          >
                            {message.subject}
                          </td>

                          <td
                            className={`${td} text-gray-300 max-w-[12rem] md:max-w-md break-words`}
                          >
                            {message.message}
                          </td>

                          <td
                            className={`${td} hidden sm:table-cell text-gray-400 whitespace-nowrap`}
                          >
                            {formatDate(message.createdAt)}
                          </td>

                          <td className={td}>
                            <button
                              onClick={() => handleDeleteContact(message._id)}
                              className={`${iconBtn} cursor-pointer`}
                              title="Delete Message"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {/* EDIT USER MODAL */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="w-full max-w-md bg-[#151517] border border-white/10 rounded-2xl p-4 sm:p-6 my-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold">Edit User</h2>
                <p className="text-gray-500 text-sm mt-1">
                  Update user information
                </p>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="text-gray-400 hover:text-white text-2xl px-2"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="space-y-5">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  required
                  className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-green-500"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="flex-1 rounded-lg bg-white/10 px-4 py-3 hover:bg-white/20 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-green-500 text-black font-semibold px-4 py-3 hover:bg-green-400 transition"
                >
                  Update User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;

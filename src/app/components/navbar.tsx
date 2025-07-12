"use client";

import Link from "next/link";
import {
  LoginLink,
  RegisterLink,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { KindeProvider, useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import { ApplicationStatus } from "@/db/retrieveApplicationStatuses";

export default function Navbar() {
  const { isAuthenticated, getUser } = useKindeAuth();
  const user = getUser();
  const [statuses, setStatuses] = useState<ApplicationStatus[]>([]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const fetchStatuses = async () => {
      if (!user.username) {
        return;
      }
      try {
        const params = new URLSearchParams({ username: user.username });
        const res = await fetch(`/api/applicationStatuses?${params}`, {
          method: "GET",
        });
        const jsonData = await res.json();
        console.log(jsonData);
        if (!jsonData.success) {
          console.error("Server error", jsonData.console.error);
        }
        const applicationStatuses = jsonData.data as ApplicationStatus[];
        console.log(applicationStatuses);
        setStatuses(applicationStatuses);
      } catch (err) {
        console.error("Unexpected error fetching statuses:", err);
      }
    };

    fetchStatuses();
  }, [user]);

  return (
    <nav className="bg-white dark:bg-gray-800 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center">
            {/* <Image
              src="/logo.svg"
              alt="Dev Collaborations Logo"
              width={32}
              height={32}
            /> */}
            <span className="ml-2 text-xl font-bold text-gray-900 dark:text-gray-100">
              OnlyDevs
            </span>
          </Link>

          <div className="flex space-x-4 items-center">
            <Link
              href="/"
              className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            >
              Home
            </Link>
            <Link
              href="/postings/new"
              className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            >
              New Posting
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-x-2">
                <div className="dropdown dropdown-end">
                  <div tabIndex={0} role="button" className="btn btn-ghost m-1">
                    <FaBell />
                  </div>
                  <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-80 mt-2 right-0">
                    {statuses.length === 0 ? (
                      <li className="px-4 py-2 text-gray-500 text-center">
                        No new notifications
                      </li>
                    ) : (
                      statuses.map((notif) => {
                        let verb = `${notif.ownerUsername} `;
                        verb +=
                          notif.status === "accepted"
                            ? "accepted your application"
                            : notif.status === "declined"
                            ? "declined your application"
                            : "updated your application";
                        const time = new Date(notif.changedAt).toLocaleString();

                        return (
                          <li key={notif.id} className="mb-2 last:mb-0">
                            <Link
                              href={`/applications/${notif.applicationId}`}
                              className="block p-3 rounded-lg hover:bg-base-200 transition-colors"
                            >
                              <div className="flex justify-between items-center">
                                <p className="text-sm font-medium ">
                                  <span className="text-primary">
                                    {verb.split(" ")[0]}
                                  </span>
                                  <span>
                                    {" " +
                                      verb.substring(verb.indexOf(" ") + 1)}
                                  </span>
                                </p>
                                <time className="text-xs text-gray-400 text-end">
                                  {time}
                                </time>
                              </div>

                              <p className="mt-1 text-xs text-secondary">
                                Project:{" "}
                                <span className="font-semibold text-base-content">
                                  {notif.postTitle}
                                </span>
                              </p>
                            </Link>
                          </li>
                        );
                      })
                    )}
                  </ul>
                </div>
                <div className="dropdown dropdown-end">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost btn-circle avatar"
                  >
                    <div className="w-10 rounded-full">
                      <img
                        alt="Tailwind CSS Navbar component"
                        src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                      />
                    </div>
                  </div>
                  <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
                  >
                    <li>
                      <Link
                        href={`/profile/${user?.username}`}
                        className="justify-between"
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link href="/settings">Settings</Link>
                    </li>
                    <li>
                      <LogoutLink className="px-3 py-2 text-sm font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                        Log Out
                      </LogoutLink>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div>
                <LoginLink
                  postLoginRedirectURL="/"
                  className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                >
                  Sign in
                </LoginLink>
                <RegisterLink className="px-3 py-2 text-sm font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                  Sign up
                </RegisterLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

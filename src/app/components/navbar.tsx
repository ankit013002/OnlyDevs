"use client";

import Link from "next/link";
import {
  LoginLink,
  RegisterLink,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { KindeProvider, useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import { useEffect } from "react";

export default function Navbar() {
  const { isAuthenticated, getUser } = useKindeAuth();
  const user = getUser();

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

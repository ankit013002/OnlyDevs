"use client";

import { ApplicationWithUser } from "@/db/retrieveApplicationsByPostId";
import Link from "next/link";
import { motion } from "framer-motion";
import { applicationStatusEnum, SelectUser } from "@/db/schema";
import React, { useState } from "react";
import { MdEmail } from "react-icons/md";
import { FaDiscord, FaPhone, FaTwitter } from "react-icons/fa";
import { FiLink } from "react-icons/fi";
import { SiLinkedin } from "react-icons/si";
import { IoIosAddCircleOutline } from "react-icons/io";

export type ContactType = { type: string; link: string };

type ContactOption = {
  type: ContactType["type"];
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
};

const CONTACT_OPTIONS: ContactOption[] = [
  { type: "Email", Icon: MdEmail },
  { type: "Discord", Icon: FaDiscord },
  { type: "Phone", Icon: FaPhone },
  { type: "LinkedIn", Icon: SiLinkedin },
  { type: "Twitter", Icon: FaTwitter },
  { type: "Website", Icon: FiLink },
];

interface ApplicationCardInterface {
  application: ApplicationWithUser;
  currUser: SelectUser;
}

const ApplicationCard = ({
  application,
  currUser,
}: ApplicationCardInterface) => {
  const [expandApp, setExtendApp] = useState(false);
  const [modeOfContact, setModeOfContact] = useState("");

  const handleAccept = async () => {
    console.log("Accept clicked for", application.applications_table.id);
    const res = await fetch("/api/applications/accept", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postId: application.applications_table.postId,
        applicationId: application.applications_table.id,
        status: applicationStatusEnum.enumValues[1],
        contactMethod: modeOfContact,
        postUser: currUser,
      }),
    });
    console.log(res);
    const json = await res.json();
    if (!json.success) console.error(json.error);
    setExtendApp(false);
  };

  const handleDecline = async () => {
    console.log("Decline clicked for", application.applications_table.id);
    setExtendApp(false);
  };

  const Icon = modeOfContact
    ? CONTACT_OPTIONS.find((opt) => opt.type == modeOfContact)
    : undefined;

  if (expandApp) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div
          className="absolute inset-0 bg-black opacity-50"
          onClick={() => setExtendApp(false)}
        />

        <div className="relative bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2 p-6">
          <button
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
            onClick={() => setExtendApp(false)}
          >
            ✕
          </button>

          <h2 className="text-2xl font-bold text-primary mb-4">
            {application.users_table?.name ?? "Applicant"}
          </h2>

          <p className="mb-6 text-black">
            {application.applications_table.introText ||
              "No introduction provided."}
          </p>

          {application.applications_table.portfolioUrl && (
            <a
              href={application.applications_table.portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn mb-4"
            >
              View Portfolio
            </a>
          )}

          <div className="flex items-center">
            <div className="dropdown dropdown-bottom dropdown-center">
              <div tabIndex={0} role="button" className="btn m-1">
                {Icon ? <Icon.Icon /> : "Contact"}
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-1 p-2 shadow-sm  w-fit"
              >
                {currUser.contact.map((contact, index) => {
                  const icon = CONTACT_OPTIONS.find(
                    (opt) => opt.type == contact.type
                  );
                  if (icon)
                    return (
                      <li key={index}>
                        <button
                          onClick={() => setModeOfContact(contact.type)}
                          className="btn btn-ghost"
                        >
                          <icon.Icon className="h-5 w-5" />
                        </button>
                      </li>
                    );
                })}
                <li>
                  <Link className="btn btn-ghost" href={"/profileSettings"}>
                    <IoIosAddCircleOutline className="h-5 w-5" />
                  </Link>
                </li>
              </ul>
            </div>
            <div className="flex w-full justify-end space-x-4">
              <span
                className="tooltip tooltip-bottom"
                data-tip={
                  modeOfContact.length === 0
                    ? "Must select mode of contact"
                    : ""
                }
              >
                <button
                  disabled={modeOfContact.length === 0}
                  onClick={handleAccept}
                  className="btn btn-success disabled:bg-gray-400 disabled:border-gray-400 disabled:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Accept
                </button>
              </span>
              <button className="btn btn-error" onClick={handleDecline}>
                Decline
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      onHoverStart={() => console.log("hover started!")}
    >
      <div
        key={application.applications_table.id}
        className="bg-white rounded-lg shadow p-6 flex flex-col"
      >
        <Link
          href={`/profile/${application.users_table?.username}`}
          className="btn btn-primary bg-transparent p-0 text-primary border-none shadow-none hover:text-secondary transition-colors duration-500 ease-in-out w-fit"
        >
          {application.users_table?.name ?? "Unknown Applicant"}
        </Link>

        <p className="text-gray-700 flex-1 mb-4">
          {application.applications_table.introText ??
            "No introduction provided."}
        </p>

        {application.applications_table.portfolioUrl && (
          <a
            href={application.applications_table.portfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn mb-4"
          >
            View Portfolio
          </a>
        )}

        <div className="text-sm text-gray-500 mb-1">
          <span className="font-medium">Applied:</span>{" "}
          {new Date(application.applications_table.appliedAt).toLocaleString()}
        </div>

        <div className="text-sm w-full flex">
          <div className="flex items-center">
            <span className="font-medium text-primary">Status:</span>{" "}
            <span
              className={`capitalize ml-1 ${
                application.applications_table.status === "pending"
                  ? "text-yellow-500"
                  : application.applications_table.status === "accepted"
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {application.applications_table.status.replace("_", " ")}
            </span>
          </div>
          <div className="w-full flex justify-end">
            <button onClick={() => setExtendApp(true)} className="btn">
              Expand
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ApplicationCard;

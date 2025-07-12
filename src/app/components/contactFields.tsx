"use client";

import React, { useState } from "react";

type Contact = { type: string; link: string };

const CONTACT_OPTIONS = [
  "Email",
  "Discord",
  "Phone",
  "LinkedIn",
  "Twitter",
  "Website",
];

interface Props {
  initial?: Contact[];
}

export default function ContactFields({ initial = [] }: Props) {
  const [items, setItems] = useState<Contact[]>(initial);

  const add = () => setItems((cur) => [...cur, { type: "", link: "" }]);

  const updateType = (idx: number, type: string) => {
    setItems((cur) => {
      const nxt = [...cur];
      nxt[idx].type = type;
      return nxt;
    });
  };

  const updateLink = (idx: number, link: string) => {
    setItems((cur) => {
      const nxt = [...cur];
      nxt[idx].link = link;
      return nxt;
    });
  };

  const remove = (idx: number) =>
    setItems((cur) => cur.filter((_, i) => i !== idx));

  return (
    <div className="flex flex-col">
      <label className="label">Contact methods</label>
      {items.map((item, i) => (
        <div key={i} className="flex my-2 items-center">
          <select
            name="contactType"
            value={item.type}
            onChange={(e) => updateType(i, e.target.value)}
            className="select select-bordered flex-1"
          >
            <option value="">Select type…</option>
            {CONTACT_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <input
            name="contactLink"
            type="text"
            placeholder="URL or handle"
            value={item.link}
            onChange={(e) => updateLink(i, e.target.value)}
            className="input input-bordered flex-2"
          />
          <button
            type="button"
            onClick={() => remove(i)}
            className="btn btn-sm btn-error ml-2"
          >
            Remove
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        className="btn btn-sm btn-outline w-fit my-2"
      >
        + Add contact
      </button>
    </div>
  );
}

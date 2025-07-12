"use client";

import React, { useState, Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { MdEmail } from "react-icons/md";
import { FaDiscord, FaPhone, FaTwitter } from "react-icons/fa";
import { FiLink } from "react-icons/fi";
import { SiLinkedin } from "react-icons/si";

type Contact = { type: string; link: string };

type ContactOption = {
  type: Contact["type"];
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

interface Props {
  initial?: Contact[];
}

export default function ContactFields({ initial = [] }: Props) {
  const [items, setItems] = useState<Contact[]>(initial);

  const availableOptions = CONTACT_OPTIONS.filter(
    (opt) => !items.some((item) => item.type === opt.type)
  );

  const add = () => setItems((cur) => [...cur, { type: "", link: "" }]);

  const update = (idx: number, field: Partial<Contact>) =>
    setItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[idx] = { ...updatedItems[idx], ...field };
      return updatedItems;
    });

  const remove = (idx: number) =>
    setItems((prevItems) => prevItems.filter((_, i) => i !== idx));

  const optionByType = (t: string) => CONTACT_OPTIONS.find((o) => o.type === t);

  return (
    <div className="flex flex-col">
      <label className="label">Contact methods</label>

      {items.map((item, i) => {
        const selected = optionByType(item.type);

        return (
          <div key={i} className="flex my-2 items-center space-x-2">
            <Listbox
              name="contactType"
              value={item.type}
              onChange={(val) => update(i, { type: val })}
            >
              {() => (
                <div className="relative w-28">
                  <Listbox.Button className="btn btn-outline w-full flex justify-center">
                    {selected ? (
                      <selected.Icon className="h-5 w-5" />
                    ) : (
                      <span className="text-xs">Pick one</span>
                    )}
                  </Listbox.Button>

                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-base-100 shadow-lg">
                      {availableOptions.map((opt) => {
                        return (
                          <Listbox.Option
                            key={opt.type}
                            value={opt.type}
                            className={({ active }) =>
                              `flex items-center justify-center py-2 cursor-pointer ${
                                active ? "bg-base-200" : ""
                              }`
                            }
                          >
                            <opt.Icon className="h-5 w-5" />
                            <span className="sr-only">{opt.type}</span>
                          </Listbox.Option>
                        );
                      })}
                    </Listbox.Options>
                  </Transition>
                </div>
              )}
            </Listbox>

            <input
              name="contactLink"
              type="text"
              disabled={selected === undefined}
              placeholder="URL or handle"
              value={item.link}
              onChange={(e) => update(i, { link: e.target.value })}
              className="input input-bordered flex-1"
            />

            <button
              type="button"
              onClick={() => remove(i)}
              className="btn btn-sm btn-error"
            >
              Remove
            </button>
          </div>
        );
      })}

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

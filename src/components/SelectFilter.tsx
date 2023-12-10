import { useEffect, useRef, useState } from "react";

import expandDownIcon from "../assets/Expand_down.svg";

const SelectFilter = ({
  selectedFilter,
  onChange,
}: {
  selectedFilter: string;
  onChange: (filter: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const filters = ["Population", "Name", "Area"];
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleOnClick = (e: MouseEvent) => {
    if (buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleOnClick);

    return () => window.removeEventListener("click", handleOnClick);
  }, []);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-xl border-2 border-[#282B30] px-4 py-2 md:max-w-[350px]"
      >
        {selectedFilter || filters[0]}
        <img width={20} src={expandDownIcon} />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full w-full max-w-[350px] bg-[#282B30]">
          {filters.map((i) => (
            <button
              className="block w-full px-2 py-2 text-start hover:bg-[#4E80EE] hover:text-[#D2D5DA]"
              key={i}
              onClick={() => {
                onChange(i);
                setIsOpen(false);
              }}
            >
              {i}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectFilter;

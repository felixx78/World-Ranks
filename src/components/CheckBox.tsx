import { useState } from "react";

import doneIcon from "../assets/Done_round.svg";

const CheckBox = ({
  label,
  onChange,
}: {
  label: string;
  onChange: () => void;
}) => {
  const [isSelected, setIsSelected] = useState(false);

  return (
    <button
      onClick={() => {
        setIsSelected(!isSelected);
        onChange();
      }}
      className="flex items-center gap-4"
    >
      <div
        className={`box-border h-[30px] w-[30px] rounded border-2 pl-[1px] pt-[1px] transition-colors ${
          isSelected ? "border-[#4E80EE] bg-[#4E80EE]" : "border-[#6C727F] "
        }`}
      >
        <img
          className={`transition-opacity ${isSelected ? "" : "opacity-0"}`}
          src={doneIcon}
          alt=""
        />
      </div>
      <div className="text-[#D2D5DA]">{label}</div>
    </button>
  );
};

export default CheckBox;

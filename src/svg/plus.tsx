import { memo } from "react";

function Plus() {
  return (
    <svg
      enableBackground="new 0 0 50 50"
      height="30px"
      id="Layer_1"
      version="1.1"
      viewBox="0 -1 50 50"
      width="30px"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        fill="none"
        stroke="#def"
        strokeWidth="3"
        x1="9"
        x2="41"
        y1="25"
        y2="25"
      />
      <line
        fill="none"
        stroke="#def"
        strokeWidth="3"
        x1="25"
        x2="25"
        y1="9"
        y2="41"
      />
    </svg>
  );
}

export default memo(Plus);

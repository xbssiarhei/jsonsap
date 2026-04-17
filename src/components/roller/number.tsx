// function getRndInteger(min, max) {
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }

import { Roller } from "./roller";

function numberWithSpaces(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

type NumericRoller = {
  value: number;
};

export const NumericRoller = ({ value, ...props }: NumericRoller) => {
  const parts = numberWithSpaces(value).split(" ");

  return (
    <div className="Numeric">
      {parts.map((part, index) => (
        <Roller key={index} size={24} value={part} {...props} />
      ))}
    </div>
  );
};

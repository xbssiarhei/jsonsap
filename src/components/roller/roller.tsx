import { useMemo, type FC } from "react";

import "./style.scss";

const alpha = Array.from(Array(97)).map((_v, i) => i + 32);
const ALPHABET = alpha.map((x) => String.fromCharCode(x).toLowerCase());

const NUMBERS = Array.from(new Array(10)).map((_v, index) => String(index));

interface RollerBase<A = string> {
  chars?: A[];
  size: number;
}

interface RollerChar extends RollerBase {
  index: number;
}

export const RollerChar = ({ chars, index, size }: RollerChar) => {
  const style = {
    marginTop: `calc(-${size}px * ${index})`,
  };

  return (
    <div className="CharRolling" style={{ height: size }}>
      <div className="CharRolling-Chars" style={style}>
        {chars?.map((v, index) => (
          <div
            key={index}
            className="CharRolling-Chars-Item"
            style={{ minHeight: size }}
          >
            {v}
          </div>
        ))}
      </div>
    </div>
  );
};

interface RollerNumeric extends RollerBase {
  char: string;
}

export const RollerNumeric = ({
  char,
  chars = NUMBERS,
  ...props
}: RollerNumeric) => {
  const index = chars.indexOf(char);
  return <RollerChar chars={chars} {...props} index={index} />;
};

interface RollerString extends RollerBase {
  char: string;
}

const RollerString = ({
  char = "",
  chars = ALPHABET,
  ...props
}: RollerString) => {
  const index = chars.indexOf(char.toLowerCase());
  return <RollerChar chars={chars} {...props} index={index} />;
};

export type Roller = {
  size: number;
  variant?: "numeric" | "number" | "string" | "text";
  value: number | string;
};

export const Roller = ({ value, size = 24, variant = "numeric" }: Roller) => {
  const parts = String(value).split("");
  const RollerComponent = useMemo((): FC<RollerString | RollerNumeric> => {
    switch (variant) {
      case "numeric":
      case "number":
        return RollerNumeric;
      case "string":
      case "text":
        return RollerString;
      default:
        return () => null;
    }
  }, [variant]);

  return (
    <div className="AnimationRoller" style={{ fontSize: size }}>
      {parts.map((char, index) => (
        <RollerComponent size={size} key={parts.length - index} char={char} />
      ))}
    </div>
  );
};

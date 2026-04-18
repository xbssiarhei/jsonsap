import { Input } from "../../components/ui/input";
import { useState, useEffect, useRef } from "react";

interface ControlledInputProps {
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  placeholder?: string;
  style?: React.CSSProperties;
  className?: string;
  type?: string;
}

export function ControlledInput({
  value: externalValue,
  onChange,
  onBlur,
  ...props
}: ControlledInputProps) {
  const [internalValue, setInternalValue] = useState(externalValue);
  const isTypingRef = useRef(false);

  // Update internal value when external value changes (but not while typing)
  useEffect(() => {
    if (!isTypingRef.current) {
      setInternalValue(externalValue);
    }
  }, [externalValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    isTypingRef.current = true;
    setInternalValue(newValue);

    // Call onChange immediately to update store
    if (onChange) {
      onChange(e);
    }
  };

  const handleBlur = () => {
    isTypingRef.current = false;
    if (onBlur) {
      onBlur();
    }
  };

  return (
    <Input
      {...props}
      value={internalValue}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
}

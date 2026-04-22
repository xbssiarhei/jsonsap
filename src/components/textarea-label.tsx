import type { ComponentProps } from "react";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";

type TextareaProps = ComponentProps<typeof Textarea>;

interface TextareaLabelProps extends TextareaProps {
  label?: string;
  description?: string;
}

export default function TextareaLabel({
  id,
  label,
  description,
  ...props
}: TextareaLabelProps) {
  return (
    <Field>
      {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
      {description && <FieldDescription>{description}</FieldDescription>}
      <Textarea id={id} {...props} />
    </Field>
  );
}

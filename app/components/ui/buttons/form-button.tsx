import { useFormStatus } from "react-dom";
import { memo } from "react";

type FormButtonProps = {
  buttonText: string;
  buttonPendingText: string;
  className?: string;
  isPending?: boolean;
  type?: "submit" | "button" | "reset";
};

const FormButton: React.FC<FormButtonProps> = ({
  buttonText,
  buttonPendingText,
  className,
  isPending,
  type,
}) => {
  const { pending } = useFormStatus();
  const isButtonPending = isPending !== undefined ? isPending : pending;
  const defaultClassName =
    "rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500";
  const buttonClassName =
    className !== undefined ? className : defaultClassName;

  return (
    <button type={type} disabled={isButtonPending} className={buttonClassName}>
      {isButtonPending ? buttonPendingText : buttonText}
    </button>
  );
};

export default memo(FormButton);

import { ReactNode, useMemo } from "react";
import clsxm from "../../lib/clsxm";
import { ButtonPrimary } from "../buttons/tailwind/Button";

export default function SubmitButton(props) {
  const { className, children, state, disabled, ...rest } = props;

  function getIcon() {
    return children;
  }

  return (
    <ButtonPrimary
      className={clsxm("w-full font-bold", className)}
      type="submit"
      {...rest}
      disabled={disabled}
    >
      {getIcon()}
    </ButtonPrimary>
  );
}

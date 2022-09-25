import React from "react";
import clsxm from "../../../lib/clsxm";
import Link from "next/link";

export function ButtonBase(props) {
  const { children, className, ...rest } = props;
  return (
    <button className={clsxm("btn", className)} {...rest}>
      {children}
    </button>
  );
}

export function ButtonPrimary(props) {
  const { children, className, ...rest } = props;
  return (
    <ButtonBase className={clsxm("btn-primary", className)} {...rest}>
      {children}
    </ButtonBase>
  );
}
const ButtonLinkBase = (props, ref) => {
  const { onClick, href, children, className } = props;

  return (
    <a href={href} onClick={onClick} ref={ref}>
      <ButtonPrimary className={className}>{children}</ButtonPrimary>
    </a>
  );
};
export function ButtonLink(props) {
  const { as, href, children, className } = props;
  const Ref = React.forwardRef(ButtonLinkBase);
  return (
    <Link as={as} href={href} passHref>
      <Ref className={clsxm("btn-link", className)}>{children}</Ref>
    </Link>
  );
}

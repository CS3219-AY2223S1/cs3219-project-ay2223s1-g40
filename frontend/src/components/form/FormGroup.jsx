import { Form } from "formik";
import React from "react";

export default function FormGroup(props) {
  const { children, className } = props;

  const childArray = React.Children.toArray(children);
  return (
    <Form className={className}>
      {childArray.map((child, i) => {
        return (
          <div key={i} className="w-full">
            {child}
          </div>
        );
      })}
    </Form>
  );
}

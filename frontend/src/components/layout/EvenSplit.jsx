import React from "react";
import clsxm from "../../lib/clsxm";

export default function EvenSplit(props) {
  const {
    className,
    children,
    hideLeft,
    hideRight,
    leftClassName,
    rightClassName,
  } = props;
  const childrenArray = React.Children.toArray(children);

  if (childrenArray.length !== 2) {
    return <p> please provide only 2 children </p>;
  }

  const left = childrenArray[0];
  const right = childrenArray[1];

  return (
    <div className={clsxm("flex flex-row h-full w-full", className)}>
      <div
        className={clsxm(
          "flex grow w-1/2 justify-center item-center",
          {
            "invisible md:visible w-0 md:w-1/2": hideLeft,
            "w-full md:w-1/2": hideRight,
          },
          leftClassName
        )}
      >
        {left}
      </div>
      <div
        className={clsxm(
          "flex grow w-1/2 justify-center item-center",
          {
            "invisible md:visible w-0 md:w-1/2": hideRight,
            "w-full md:w-1/2": hideLeft,
          },
          rightClassName
        )}
      >
        {right}
      </div>
    </div>
  );
}

import { AiOutlineLoading } from "react-icons/ai";
import clsxm from "../../lib/clsxm";

export default function ActivityIndicator({ className }) {
  return (
    <AiOutlineLoading
      data-testid="ai-outline-loading"
      className={clsxm(
        "text-gray-200 animate-spin dark:text-gray-600 fill-primary-100",
        className
      )}
    />
  );
}

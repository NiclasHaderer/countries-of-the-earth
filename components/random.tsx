import { Generate } from "@/components/generate";
import { FC } from "react";

export const Random: FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <>
      <button
        className="p-4 rounded-2xl bg-surface shadow-2xl absolute bottom-4 left-1/2 -translate-x-1/2 z-1000"
        onClick={onClick}
      >
        <Generate />
      </button>
    </>
  );
};

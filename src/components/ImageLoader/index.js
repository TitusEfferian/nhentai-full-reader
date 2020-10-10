import React, { memo } from "react";
import ClipLoader from "react-spinners/ClipLoader";

const ImageLoader = () => {
  return (
    <div
      style={{
        position: "absolute",
        transform: "translate(-50%,-50%)",
        top: "50%",
        left: "50%",
      }}
    >
      <ClipLoader />
    </div>
  );
};

export default memo(ImageLoader);

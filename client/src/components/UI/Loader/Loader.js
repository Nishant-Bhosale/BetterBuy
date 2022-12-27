import { ClimbingBoxLoader, GridLoader, MoonLoader } from "react-spinners";

const Loader = () => {
  let loaders = [ClimbingBoxLoader, GridLoader, MoonLoader];
  const loaderIndex = Math.floor(Math.random() * (2 - 0 + 1));

  const RandomLoader = loaders[loaderIndex];

  return (
    <div
      style={{
        margin: "auto",
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <RandomLoader color="#7064e5" />
    </div>
  );
};

export default Loader;

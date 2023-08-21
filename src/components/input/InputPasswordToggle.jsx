import { useState } from "react";
import Input from "./Input";
import { IconEyeClose, IconEyeOpen } from "components/icon";

const InputPasswordToggle = ({ control }) => {
  const [togglePassword, setTogglePassword] = useState(false);
  if (!control) return null;
  return (
    <>
      <Input
        type={togglePassword === true ? "text" : "password"}
        name="password"
        placeholder="Enter your password"
        control={control}
      >
        {togglePassword ? (
          <IconEyeClose onClick={() => setTogglePassword(false)}></IconEyeClose>
        ) : (
          <IconEyeOpen onClick={() => setTogglePassword(true)}></IconEyeOpen>
        )}
      </Input>
    </>
  );
};

export default InputPasswordToggle;

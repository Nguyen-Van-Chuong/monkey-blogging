import { useAuth } from "contexts/auth-context";
import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import AuthenticationPage from "./AuthenticationPage";
import { useForm } from "react-hook-form";
import { Field } from "components/field";
import { Label } from "components/label";
import { Input } from "components/input";
import { Button } from "components/button";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "firebase-app/firebase-config";
import InputPasswordToggle from "components/input/InputPasswordToggle";
const schema = yup.object({
  email: yup
    .string()
    .email("please enter valid email address")
    .required("Please enter your email"),
  password: yup
    .string()
    .min(8, "Your password must be at leat 8 characters or greater")
    .required("Please enter your password"),
});

const SignInPage = () => {
  const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    formState: { isSubmitting, errors, isValid },
  } = useForm({ mode: "onChange", resolver: yupResolver(schema) });

  // Context
  const { userInfo } = useAuth();
  // Effect
  useEffect(() => {
    document.title = "Login Page";
    if (userInfo?.email) navigate("/");
  }, [userInfo]);

  const handleSignIn = async (values) => {
    if (!isValid) return;
    await signInWithEmailAndPassword(auth, values.email, values.password);
    navigate("/");
  };
  return (
    <AuthenticationPage>
      <form
        action=""
        className="form"
        onSubmit={handleSubmit(handleSignIn)}
        autoComplete="off"
      >
        <Field>
          <Label htmlFor="email">Email address</Label>

          <Input
            type="text"
            name="email"
            placeholder="Enter your email"
            control={control}
          ></Input>
        </Field>
        <Field>
          <Label htmlFor="password">Password</Label>

          <InputPasswordToggle control={control}></InputPasswordToggle>
        </Field>
        <div className="have-account">
          You have not had an account?{" "}
          <NavLink to={"/sign-up"}>Register an account</NavLink>
        </div>
        <Button
          type="submit"
          isLoading={isSubmitting}
          disabled={isSubmitting}
          className="w-full max-w-[300px] mx-auto"
        >
          Sign In
        </Button>
      </form>
    </AuthenticationPage>
  );
};

export default SignInPage;

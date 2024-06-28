import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import _ from "lodash";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Link, Router, useNavigate } from "react-router-dom";
import { useAuth } from "src/app/auth/AuthRouteProvider";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ReCAPTCHA from "react-google-recaptcha";

import { decryptFeature, encryptFeature } from "./featureEncryption";

/**
 * Form Validation Schema
 */
const schema = z.object({
  userName: z.string().nonempty("You must enter an email"),
  mFAOtp: z.string(),
  password: z
    .string()
    .min(4, "Password is too short - must be at least 4 chars.")
    .nonempty("Please enter your password."),
});
const defaultValues = {
  userName: "",
  password: "",
  mFAOtp: "",
  rememberMe: true,
  recaptchaToken: "",
  remember: true,
};

function jwtSignInTab() {
  const [showMFA, setShowMFA] = useState(false);
  const [recaptchaTokens, setRecaptchaToken] = useState("");
  const [logindata, setLoginData] = useState();
  const [reAuth, setReAuth] = useState(false);
  const navigate = useNavigate();

  const handleResolved = (token) => {
    // Handle the resolved reCAPTCHA token here
    console.log("ReCAPTCHA token:", token);
    localStorage.setItem("recap", token);
    setRecaptchaToken(token);
  };

  const { axiosService } = useAuth();
  const { control, formState, handleSubmit, setValue, setError } = useForm({
    mode: "onChange",
    defaultValues,
    resolver: zodResolver(schema),
  });
  const { isValid, dirtyFields, errors } = formState;

  useEffect(() => {
    setValue("userName", "J0230643", {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("password", "Password123@", {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("mFAOtp", "", {
      shouldDirty: true,
    });
  }, [setValue]);

  useEffect(() => {
    console.log("reAuth state has changed: ", reAuth);
  }, [reAuth]);

  async function onSubmit(formData) {
    const { userName, password, mFAOtp } = formData;
    const params = {
      userName: userName,
      password: password,
      rememberMe: true,
      recaptchaToken: localStorage.getItem("recap"),
      mFAOtp: mFAOtp,
    };

    try {
      const user = await axiosService.signIn(params);
      if (user.statusCode === 202) {
        setReAuth(true);
        console.log("reAuth set to true");
      }
      if (user.statusCode === 200) {
        localStorage.setItem("jwt_access_token", user.data.jwt);
        try {
          encryptFeature(user.data.features);
        } catch (error) {
          console.error("Encryption/Decryption error:", error);
        }
        navigate("/dashboards/project");
      }

      // You can now use the user data as needed
    } catch (error) {
      const errorData = error.response.data;
      errorData.forEach((err) => {
        setError(err.type, {
          type: "manual",
          message: err.message,
        });
      });
    }
  }

  return (
    <div className="w-full">
      <form
        name="loginForm"
        noValidate
        className="mt-32 flex w-full flex-col justify-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Controller
          name="userName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              className="mb-24"
              label="User Name"
              autoFocus
              type="email"
              error={!!errors.userName}
              helperText={errors?.userName?.message}
              variant="outlined"
              required
              fullWidth
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              className="mb-24"
              label="Password"
              type="password"
              error={!!errors.password}
              helperText={errors?.password?.message}
              variant="outlined"
              required
              fullWidth
            />
          )}
        />

        {!showMFA && (
          <div className="inline-flex items-end justify-between w-full mt-1.5 mb-5">
            <ReCAPTCHA
              id="recaptcha"
              name="recaptcha"
              sitekey="6LcxxIwkAAAAANNS-Sa_iID5qmTCbv9kCZc-sPdr"
              onChange={handleResolved}
            />
          </div>
        )}

        <Controller
          name="mFAOtp"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              className="mb-24 mt-4"
              label="mFAOtp"
              type="number"
              // error={!!errors.mFAOtp}
              // helperText={errors?.password?.mFAOtp}
              variant="outlined"
              required
              fullWidth
            />
          )}
        />
        {reAuth && <h1>hello</h1>}

        <div className="flex flex-col items-center mt-4 justify-center sm:flex-row sm:justify-between">
          <Controller
            name="remember"
            control={control}
            render={({ field }) => (
              <FormControl>
                <FormControlLabel
                  label="Remember me"
                  control={<Checkbox size="small" {...field} />}
                />
              </FormControl>
            )}
          />

          <Link className="text-md font-medium" to="/forgot-password">
            Forgot password?
          </Link>
        </div>

        <Button
          variant="contained"
          color="secondary"
          className=" mt-16 w-full"
          aria-label="Sign in"
          // disabled={_.isEmpty(dirtyFields) || !isValid}
          type="submit"
          size="large"
        >
          Sign in
        </Button>
      </form>
    </div>
  );
}

export default jwtSignInTab;

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
import Cookies from "js-cookie";
import { encryptFeature } from "./featureEncryption";
import { apiAuth, apiTicketAuth } from "src/utils/http";
import { ToastContainer, toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import axios from "axios";

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

const JwtSignInTab = () => {
  const [showMFA, setShowMFA] = useState(false);
  const [recaptchaTokens, setRecaptchaToken] = useState("");
  const [logindata, setLoginData] = useState();
  const [reAuth, setReAuth] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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
  }, []);

  // useEffect(() => {
  //   console.log("reAuth state has changed: ", reAuth);
  // }, [reAuth]);

  // useEffect(() => {
  //   console.log("showMFA state has changed: ", showMFA);
  // }, [showMFA]);

  async function onSubmit(formData) {
    const { userName, password, mFAOtp } = formData;
    const params = {
      userName: userName,
      password: password,
      rememberMe: true,
      recaptchaToken: localStorage.getItem("recap"),
      mFAOtp: mFAOtp,
    };
    setLoading(true);
    try {
      apiAuth.post("/Account/Login", params).then(async (resp) => {
        if (resp.data.statusCode === 202) {
          console.log("Setting showMFA to true", resp);
          toast?.success("Otp Required");
          setShowMFA(true);
          setLoading(false);
          return;
        } else {
        }
        if (resp.data.statusCode === 200) {
          Cookies.remove("MOC_Features");
          const ticketResp = await apiTicketAuth.post("/Account/access-token", {
            userName: "MOC_CLIENT",
            password: "M@c_3#21c_ukl",
            deviceId: "string",
          });

          console.log("Ticket access token response:", ticketResp);
          localStorage.setItem(
            "jwt_access_ticket_token",
            ticketResp.data.accessToken
          );

          localStorage.setItem("jwt_access_token", resp.data.data.jwt);
          localStorage.setItem("username", resp.data.data.name);

          try {
            const enData = encryptFeature(resp.data.data.features);

            if (enData) {
              // Store the access token in local storage

              toast?.success("Successfully Logined");
              setLoading(false);
              navigate("/dashboards/project");
              location.reload();
            }
          } catch (error) {
            console.error("Encryption/Decryption error:", error);
          }
        } else {
          toast?.error("Some Error Occured");
        }
      });
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
      <ToastContainer className="toast-container" />
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
              label="User Name (JID)"
              autoFocus
              type="string"
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

        {showMFA && (
          <Controller
            name="mFAOtp"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                className="mb-24 mt-4"
                label="OTP"
                type="string"
                // error={!!errors.mFAOtp}
                // helperText={errors?.password?.mFAOtp}
                variant="outlined"
                required
                fullWidth
              />
            )}
          />
        )}

        <div className="flex flex-col items-center mt-4 justify-center sm:flex-row sm:justify-between">
          <Controller
            name="remember"
            control={control}
            defaultValue={true} // Set default value here
            render={({ field }) => (
              <FormControl>
                <FormControlLabel
                  label="Remember me"
                  control={
                    <Checkbox
                      size="small"
                      {...field}
                      checked={field.value || false} // Ensure the checkbox reflects the current value
                    />
                  }
                />
              </FormControl>
            )}
          />

          <Link className="text-md font-medium text-blue" to="/forgot-password">
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
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Sign in"}
        </Button>
      </form>
    </div>
  );
};

export default JwtSignInTab;

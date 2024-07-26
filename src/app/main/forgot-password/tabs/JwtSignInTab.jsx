import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import _ from "@lodash";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Link } from "react-router-dom";
import { useAuth } from "src/app/auth/AuthRouteProvider";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiAuth } from "src/utils/http";
import { toast, ToastContainer } from "react-toastify";
/**
 * Form Validation Schema
 */
const schema = z.object({
  email: z
    .string()
    .email("You must enter a valid email")
    .nonempty("You must enter an email address"),
  OTP: z.string().optional(),
  password: z
    .string()
    .min(10, "Password must be at least 10 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[!@#$%&*]/,
      "Password must contain at least one special character (!@#$%&*)"
    )
    .optional(),
  confirmPassword: z
    .string()
    .min(10, "Password must be at least 10 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[!@#$%&*]/,
      "Password must contain at least one special character (!@#$%&*)"
    )
    .optional(),
});
const defaultValues = {
  email: "",
  remember: true,
};

function jwtSignInTab() {
  const { axiosService } = useAuth();
  const { control, formState, handleSubmit, setValue, setError } = useForm({
    mode: "onChange",
    defaultValues,
    resolver: zodResolver(schema),
  });
  const { isValid, dirtyFields, errors } = formState;
  const [otpTrue, SetOtpTrue] = useState(false);
  const [reset, SetReset] = useState({
    password: "",
    confirmPassword: "",
    token: "",
    email: "",
  });

  useEffect(() => {
    setValue("email", "", { shouldDirty: true, shouldValidate: false });
  }, [setValue]);
  const handleChange = (name, value) => {
    SetReset((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  console.log(reset, "reeeee");
  function onSubmit(formData) {
    const { email } = formData;
    if (!otpTrue) {
      // Send OTP
      apiAuth
        .post(`/Account/ForgotPassword`, { email })
        .then((resp) => {
          if (resp.data.statusCode === 400) {
            toast.error("Some error has occurred");
          } else {
            toast.success("OTP Sent Successfully");
            SetOtpTrue(true);
          }
        })
        .catch((err) => {
          console.error("Error sending OTP:", err);
          toast.error("Failed to send OTP");
        });
    } else {
      // Reset Password
      const payload = {
        ...reset,
        email: formData.email,
      };

      apiAuth
        .post(`/Account/ResetPassword`, payload)
        .then((resp) => {
          // Handle success response
          toast.success("Password reset successfully");
          // Optionally redirect or handle success UI state
        })
        .catch((err) => {
          console.error("Error resetting password:", err);
          toast.error("Failed to reset password");
        });
    }
  }

  return (
    <div className="w-full">
      <ToastContainer className="toast-container " />
      <form
        name="loginForm"
        noValidate
        className="mt-32 flex w-full flex-col justify-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        {!otpTrue && (
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                className="mb-24"
                label="Email address"
                autoFocus
                type="text"
                error={!!errors.email}
                helperText={errors?.email?.message}
                variant="outlined"
                required
                fullWidth
              />
            )}
          />
        )}
        {otpTrue && (
          <>
            <Controller
              name="OTP"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Enter OTP"
                  autoFocus
                  type="text"
                  error={!!errors.OTP}
                  helperText={errors?.OTP?.message}
                  variant="outlined"
                  required
                  fullWidth
                  onChange={(e) => handleChange("token", e.target.value)}
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
                  label="New Password "
                  autoFocus
                  type="text"
                  error={!!errors.password}
                  helperText={errors?.password?.message}
                  variant="outlined"
                  required
                  fullWidth
                  onChange={(e) => handleChange("password", e.target.value)}
                />
              )}
            />
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Confirm Password "
                  autoFocus
                  type="text"
                  error={!!errors.password}
                  helperText={errors?.password?.message}
                  variant="outlined"
                  required
                  fullWidth
                  onChange={(e) =>
                    handleChange("confirmPassword", e.target.value)
                  }
                />
              )}
            />
          </>
        )}

        <Button
          variant="contained"
          color="secondary"
          className=" mt-16 w-full"
          aria-label="Sign in"
          disabled={otpTrue ? !isValid : _.isEmpty(dirtyFields)}
          type="submit"
          size="large"
        >
          {otpTrue ? "Submit" : "Send OTP"}{" "}
        </Button>
      </form>
    </div>
  );
}

export default jwtSignInTab;

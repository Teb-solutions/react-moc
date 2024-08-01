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
  OTP: z.string().nonempty("OTP is required").optional(),
  password: z
    .string()
    .min(
      10,
      "Password should contain a minimum 10 characters, at least 1 Uppercase, 1 lowercase letter, 1 number and special character (!@#$%&*)"
    )
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
    .min(10, "Confirm Password is required")
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

function JwtSignInTab() {
  const { axiosService } = useAuth();
  const { control, formState, handleSubmit, setValue, setError, trigger } =
    useForm({
      mode: "onChange", // Ensure validation is triggered on change
      defaultValues,
      resolver: zodResolver(schema),
    });

  const { isValid, dirtyFields, errors, touchedFields } = formState;
  const [otpTrue, setOtpTrue] = useState(false);
  const [reset, setReset] = useState({
    password: "",
    confirmPassword: "",
    token: "",
    email: "",
  });

  useEffect(() => {
    setValue("email", "", { shouldDirty: true, shouldValidate: false });
  }, [setValue]);

  const handleChange = (name, value) => {
    setReset((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  console.log(reset, "reeeee");

  const onSubmit = async (formData) => {
    // Trigger validation for all fields before proceeding
    const isValidForm = await trigger(); // This will validate all fields

    if (!isValidForm) {
      return; // If validation fails, stop the submission
    }

    const { email } = formData;
    if (!otpTrue) {
      // Send OTP
      apiAuth
        .post(`/Account/ForgotPassword`, { email })
        .then((resp) => {
          if (resp.data.statusCode === 400) {
            toast?.error("Some error has occurred");
          } else {
            toast?.success("OTP Sent Successfully");
            setOtpTrue(true);
          }
        })
        .catch((err) => {
          console.error("Error sending OTP:", err);
          toast?.error("Failed to send OTP");
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
          if (resp.data.statusCode === 400) {
            toast?.error(resp.data.message);
          } else {
            toast?.success("Password reset successfully");
          }
          // Handle success response

          // Optionally redirect or handle success UI state
        })
        .catch((err) => {
          console.error("Error resetting password:", err);
          toast?.error("Failed to reset password");
        });
    }
  };

  return (
    <div className="w-full">
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
                helperText={
                  errors.email
                    ? errors.email.message
                    : touchedFields.email
                      ? ""
                      : ""
                }
                variant="outlined"
                required
                fullWidth
                onChange={(e) => {
                  field.onChange(e);
                  handleChange("email", e.target.value);
                  trigger("email"); // Trigger validation on change
                }}
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
                  helperText={
                    errors.OTP
                      ? errors.OTP.message
                      : touchedFields.OTP
                        ? ""
                        : ""
                  }
                  variant="outlined"
                  required
                  fullWidth
                  onChange={(e) => {
                    field.onChange(e);
                    handleChange("token", e.target.value);
                    trigger("OTP"); // Trigger validation on change
                  }}
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
                  label="New Password"
                  autoFocus
                  type="password"
                  error={!!errors.password}
                  helperText={
                    errors.password
                      ? errors.password.message
                      : touchedFields.password
                        ? ""
                        : ""
                  }
                  variant="outlined"
                  required
                  fullWidth
                  onChange={(e) => {
                    field.onChange(e);
                    handleChange("password", e.target.value);
                    trigger("password"); // Trigger validation on change
                  }}
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
                  label="Confirm Password"
                  autoFocus
                  type="password"
                  error={!!errors.confirmPassword}
                  helperText={
                    errors.confirmPassword
                      ? errors.confirmPassword.message
                      : touchedFields.confirmPassword
                        ? ""
                        : ""
                  }
                  variant="outlined"
                  required
                  fullWidth
                  onChange={(e) => {
                    field.onChange(e);
                    handleChange("confirmPassword", e.target.value);
                    trigger("confirmPassword"); // Trigger validation on change
                  }}
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
          disabled={
            otpTrue
              ? !isValid ||
                !reset.token ||
                !reset.password ||
                !reset.confirmPassword
              : _.isEmpty(dirtyFields)
          }
          type="submit"
          size="large"
        >
          {otpTrue ? "Submit" : "Send OTP"}
        </Button>
      </form>
    </div>
  );
}

export default JwtSignInTab;

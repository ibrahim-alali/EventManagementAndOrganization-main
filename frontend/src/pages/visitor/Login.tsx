import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useLogin } from "../../hooks/useAuth";
import { motion } from "framer-motion";
import { Mail, Lock, Facebook, Apple, Chrome } from "lucide-react";
import toast from "react-hot-toast";
import { AuthForm, type AuthField } from "../../components/common/AuthForm";
import { getRedirectPathByRole } from "../../utils/roleRedirect";
import { getRole } from "../../utils/authRole";

const LoginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginType = z.infer<typeof LoginSchema>;

export const Login: React.FC = () => {
  const [shake, setShake] = useState(false);
  const navigate = useNavigate();
  const { mutate, isPending, isError, error } = useLogin();

  const fields: AuthField[] = [
    { name: "email", label: "Email", type: "email", placeholder: "example@mail.com", icon: <Mail /> },
    { name: "password", label: "Password", type: "password", placeholder: "********", icon: <Lock /> },
  ];

  const submit = (data: LoginType) => {
    const toastId = toast.loading("Logging in...");
    mutate(data, {
      onSuccess: () => {
        toast.success("Welcome back 👋", { id: toastId });
        const role = getRole();
        if (!role) return;
        const path = getRedirectPathByRole(role);
        navigate(path, { replace: true });
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message ||
            error?.response?.data?.error ||
            "Invalid email or password",
          { id: toastId }
        );
        setShake(true);
        setTimeout(() => setShake(false), 400);
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex min-h-screen w-full items-center justify-center bg-violet-50 p-4"
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-3xl bg-white shadow-lg md:grid-cols-2"
      >
        {/* Left Side */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.0, ease: "easeOut" }}
          className="flex flex-col justify-between rounded-r-3xl bg-gradient-to-br from-indigo-300 via-purple-300 to-pink-300 p-10 text-black"
        >
          <div className="font-nata-sans-bd text-2xl">
            <span className="text-[#5a2ea6]">List</span>
            <span className="bg-gradient-to-r from-[#5a2ea6] to-[#db2777] bg-clip-text text-transparent">
              EMO
            </span>
          </div>

          <div className="mt-20">
            <h1 className="mb-4 font-nata-sans-bd text-3xl">Welcome back</h1>
            <p className="font-nata-sans-md text-lg opacity-80">
              Access your events, tasks, and schedules easily.
            </p>
          </div>
        </motion.div>

        {/* Right Side */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.0, ease: "easeOut" }}
          className="flex flex-col justify-center p-10"
        >
          <h2 className="mb-2 font-nata-sans-bd text-3xl">Login</h2>
          <p className="mb-6 font-nata-sans-md text-gray-600">
            Enter your credentials to access your dashboard.
          </p>

          <AuthForm
            schema={LoginSchema}
            fields={fields}
            onSubmit={submit}
            submitLabel="Login"
            isPending={isPending}
            serverError={
              isError ? (error as any)?.response?.data?.message : undefined
            }
            shake={shake}
          />

          {/* OR */}
          <div className="my-6 flex items-center font-nata-sans-rg">
            <div className="h-px flex-1 bg-gray-300"></div>
            <span className="px-4 text-gray-500">or</span>
            <div className="h-px flex-1 bg-gray-300"></div>
          </div>

          {/* Socials */}
          <div className="flex gap-4 font-nata-sans-md">
            <motion.button
              whileHover={{ scale: 1.03 }}
              className="flex w-full items-center justify-center gap-2 rounded-lg border py-2 transition hover:bg-gray-100"
            >
              <Chrome className="h-5 w-5" />
              Google
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              className="flex w-full items-center justify-center gap-2 rounded-lg border py-2 transition hover:bg-gray-100"
            >
              <Facebook className="h-5 w-5" />
              Facebook
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              className="flex w-full items-center justify-center gap-2 rounded-lg border py-2 transition hover:bg-gray-100"
            >
              <Apple className="h-5 w-5" />
              Apple
            </motion.button>
          </div>

          <p className="mt-6 text-center font-nata-sans-rg text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup/client"
              className="font-medium text-black hover:underline"
            >
              Sign up
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

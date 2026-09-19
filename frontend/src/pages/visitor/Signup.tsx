import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useSignup } from "../../hooks/useAuth";
import { motion } from "framer-motion";
import { Mail, Lock, User, Phone } from "lucide-react";
import toast from "react-hot-toast";
import { AuthForm, type AuthField } from "../../components/common/AuthForm";
import { getRedirectPathByRole } from "../../utils/roleRedirect";
import { getRole } from "../../utils/authRole";

const SignupSchema = z.object({
  fullName: z.string().min(3, "Full name is too short"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(8, "Invalid phone number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignupType = z.infer<typeof SignupSchema>;

interface SignupProps {
  role?: "client" | "provider" | "organizer";
}

export const Signup: React.FC<SignupProps> = ({ role = "client" }) => {
  const [shake, setShake] = useState(false);
  const navigate = useNavigate();

  const { mutate, isPending, isError, error } = useSignup();

  const fields: AuthField[] = [
    {
      name: "fullName",
      label: "Full Name",
      placeholder: "John Doe",
      icon: <User />,
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "example@email.com",
      icon: <Mail />,
    },
    {
      name: "phone",
      label: "Phone Number",
      placeholder: "+1 234 567",
      icon: <Phone />,
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "********",
      icon: <Lock />,
    },
  ];

  const submit = (data: SignupType) => {
    const toastId = toast.loading("Logging in...");
    mutate(
      {
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role,
      },
      {
        onSuccess: () => {
          toast.success("Account created successfully 🎉", { id: toastId });
          const role = getRole();
          if (!role) return;
          const path = getRedirectPathByRole(role);
          navigate(path, { replace: true });
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message ||
              error?.response?.data?.error ||
              "Signup failed",
            { id: toastId }
          );
          setShake(true);
          setTimeout(() => setShake(false), 400);
        },
      }
    );
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
          className={`flex flex-col justify-between rounded-r-3xl p-10 text-black ${
            role === "client"
              ? "bg-gradient-to-br from-indigo-300 via-purple-300 to-pink-300"
              : role === "provider"
              ? "bg-gradient-to-br from-green-300 via-emerald-200 to-teal-100"
              : "bg-gradient-to-br from-yellow-300 via-orange-200 to-orange-100"
          }`}
        >
          <div className="font-nata-sans-bd text-2xl">
            <span className="text-[#5a2ea6]">List</span>
            <span className="bg-gradient-to-r from-[#5a2ea6] to-[#db2777] bg-clip-text text-transparent">
              EMO
            </span>
          </div>

          <div className="mt-20">
            <h1 className="mb-4 font-nata-sans-bd text-3xl md:whitespace-nowrap">
              {role === "client"
                ? "Create your account"
                : role === "provider"
                ? "Register as a Venue Provider"
                : "Register as an Event Organizer"}
            </h1>
            <p className="font-nata-sans-md text-lg opacity-80">
              {role === "client"
                ? "Join the platform and start managing your events seamlessly."
                : role === "provider"
                ? "List your venues and manage bookings effortlessly."
                : "Organize events and manage participants easily."}
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
          <h2 className="mb-2 font-nata-sans-bd text-3xl">
            {role === "client"
              ? "Sign Up"
              : role === "provider"
              ? "Venue Provider Sign Up"
              : "Event Organizer Sign Up"}
          </h2>
          <p className="mb-6 font-nata-sans-md text-gray-600">
            Fill in your details to register your account.
          </p>

          <AuthForm
            schema={SignupSchema}
            fields={fields}
            onSubmit={submit}
            submitLabel="Sign Up"
            isPending={isPending}
            serverError={
              isError ? (error as any)?.response?.data?.message : undefined
            }
            shake={shake}
          />

          <p className="mt-6 text-center font-nata-sans-rg text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-black hover:underline"
            >
              Login
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

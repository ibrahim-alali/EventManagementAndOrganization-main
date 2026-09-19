import React, { useState } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { zodResolver} from "@hookform/resolvers/zod";
import { z } from "zod";
import type { ZodTypeAny } from "zod";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

export interface AuthField {
    name: string;
    label: string;
    type?: string; // text, email, password, etc
    placeholder?: string;
    icon?: React.ReactNode;
}

interface AuthFormProps<T extends ZodTypeAny> {
    schema: T;
    fields: AuthField[];
    onSubmit: (data: z.infer<T>) => void;
    submitLabel?: string;
    isPending?: boolean;
    serverError?: string;
    shake?: boolean;
}

export const AuthForm = <T extends ZodTypeAny>({
   schema,
   fields,
   onSubmit,
   submitLabel = "Submit",
   isPending,
   serverError,
   shake = false,
}: AuthFormProps<T>) => {
    const [showPasswordFields, setShowPasswordFields] = useState<Record<string, boolean>>({});

    const {register, handleSubmit, formState: {errors}} = useForm<z.infer<T> & Record<string, any>>({
        resolver: zodResolver(schema as any),
    });

    const toggleShowPassword = (fieldName: string) => {
        setShowPasswordFields(prev => ({...prev, [fieldName]: !prev[fieldName]}));
    };

    const internalSubmit: SubmitHandler<z.infer<T> & Record<string, any>> = (data) => {
        onSubmit(data);
    };

    return (
        <motion.form
            onSubmit={handleSubmit(internalSubmit)}
            animate={shake ? {x: [0, -8, 8, -8, 8, 0]} : {x: 0}}
            transition={{duration: 0.4}}
            className="space-y-5 font-nata-sans-rg"
        >
            {fields.map((field) => {
                const isPassword = field.type === "password";
                const show = showPasswordFields[field.name] ?? false;
                return (
                    <div key={field.name}>
                        <label className="mb-1 flex items-center gap-2 font-medium">
                            {field.icon}
                            {field.label}
                        </label>
                        <div className={isPassword ? "relative" : ""}>
                            <input
                                type={isPassword ? (show ? "text" : "password") : field.type || "text"}
                                {...register(field.name as any)}
                                placeholder={field.placeholder}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-violet-500 focus:ring-1"
                                disabled={isPending}
                            />
                            {isPassword && (
                                <button
                                    type="button"
                                    onClick={() => toggleShowPassword(field.name)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 transform text-gray-500 hover:text-gray-700"
                                    disabled={isPending}
                                >
                                    {show ? <EyeOff className="h-5 w-5"/> : <Eye className="h-5 w-5"/>}
                                </button>
                            )}
                        </div>
                        {errors[field.name as keyof typeof errors] && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors[field.name as keyof typeof errors]?.message as string}
                            </p>
                        )}
                    </div>
                );
            })}

            {serverError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {serverError}
                </div>
            )}

            <motion.button
                type="submit"
                disabled={isPending}
                whileHover={{scale: 1.02}}
                whileTap={{scale: 0.97}}
                className="w-full rounded-lg bg-black py-3 font-nata-sans-md font-semibold text-white shadow-lg transition hover:opacity-90"
            >
                {submitLabel}
            </motion.button>
        </motion.form>
    );
};
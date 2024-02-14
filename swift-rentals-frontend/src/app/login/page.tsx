"use client";

import axios from "axios";
import { log } from "console";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaEyeSlash, FaUserCircle } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ZodError, z } from "zod";
import CustomFormField from "../ui/CustomFormField/CustomFormField";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().refine((password) => password.trim().length > 0, {
    message: "Password cannot be empty",
  }),
});

export default function Page() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorData, setErrorData] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorData((prevErrorData) => ({
      ...prevErrorData,
      email: "",
      password: "",
    }));
    try {
      const validatedData = loginSchema.safeParse(formData);
      console.log("Valid data:", validatedData);
      if (validatedData.success) {
        const response = await axios.post(
          "http://localhost:3001/api/auth/login",
          {
            email: formData.email,
            password: formData.password,
          }
        );
        if (response.status == 200) {
          toast.success("Login Successfull!");
          router.push("/");
        }
      } else {
        for (const error of validatedData.error.errors) {
          console.log(error);
          setErrorData((prev) => ({
            ...prev,
            [error.path.toString()]: error.message,
          }));
        }
      }
    } catch (error: any) {
      console.log(error.response.data.error);

      switch (error.response.data.error) {
        case "Invalid password":
          setErrorData((prev) => ({
            ...prev,
            password: "Incorrect password!",
          }));
          break;
        case "Invalid email":
          setErrorData((prev) => ({
            ...prev,
            email: "Email not recognized. Please signup first!",
          }));
          break;
      }
      toast.error("Login Failed!");
    }
  };

  return (
    <div>
      <div className="w-[75%] min-h-[500px] shadow-2xl rounded-xl m-auto my-14 p-5 flex">
        <div className="w-full md:w-1/2 p-10 mt-4 flex flex-col place-content-center justify-center">
          <h3 className="font-bold text-3xl ">
            Log in <span className="text-blue-600">Swift</span>
          </h3>
          <p className="text-gray-400 mb-2 text-sm">
            Enter details to log into swiftrentals
          </p>
          <form onSubmit={handleSubmit}>
            <CustomFormField
              errorText={errorData.email}
              icon={FaUserCircle}
              placeholder="Enter your email"
              name="email"
              type="text"
              id="userEmail"
              value={formData.email}
              onChange={handleInputChange}
            />
            <CustomFormField
              icon={FaEyeSlash}
              errorText={errorData.password}
              placeholder="Enter your password"
              name="password"
              type="password"
              id="userPassword"
              value={formData.password}
              onChange={handleInputChange}
            />
            <button
              type="submit"
              className="bg-black text-white font-semibold p-3 w-full sm:w-3/4 rounded-full mt-4 hover:opacity-80 transition-opacity"
            >
              Log in
            </button>
          </form>

          <div className="w-3/4 p-1">
            <p className="font-semibold sm:text-md text-center">
              forgot your password?
            </p>
          </div>
          <hr className="w-3/4 border-1 m-2" />
          <div className="w-3/4">
            <p className="text-gray-400 text-center">
              Don&apos;t have an account?
              <span className="text-black font-semibold underline">
                <Link href="/signup">Sign up</Link>
              </span>
            </p>
          </div>
        </div>
        <div className="w-0 md:w-1/2 relative">
          <Image
            src="/images/login1.jpg"
            alt="small login image"
            className="w-full rounded-xl absolute right-20 shadow-xl hidden lg:block  bottom-8"
            width={400}
            height={100}
          />
          <Image
            src="/images/login2.jpg"
            alt="small login image"
            className="hidden md:block h-full lg:w-52 lg:h-auto rounded-xl  absolute right-4 top-0 shadow-2xl"
            width={400}
            height={100}
          />
        </div>
      </div>
    </div>
  );
}
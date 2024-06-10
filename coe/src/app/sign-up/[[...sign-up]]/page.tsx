'use client'
import { useState } from 'react';
import * as Clerk from '@clerk/elements/common';
import * as SignUp from '@clerk/elements/sign-up';

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'student',
    publicMetadata: { role: 'student' }, // Default role is set to student
  });

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSignUp = async () => {
    try {
      // Update the publicMetadata with the selected role
      const result = await SignUp.create({
        username: formData.username,
        password: formData.password,
        metadata: {
          publicMetadata: {
            role: formData.role,
          },
        },
      });

      // Handle the result here
      console.log(result);
    } catch (error) {
      console.error('Sign up failed:', error);
    }
  };

  return (
    <div className="grid w-full flex-grow items-center bg-black px-4 sm:justify-center">
      <SignUp.Root>
        <SignUp.Step
          name="start"
          className="w-full space-y-6 rounded-2xl bg-neutral-900 bg-[radial-gradient(circle_at_50%_0%,theme(colors.white/10%),transparent)] px-4 py-10 ring-1 ring-inset ring-white/5 sm:w-96 sm:px-8"
        >
          <header className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 40 40" className="mx-auto size-10">
                <mask id="a" width="40" height="40" x="0" y="0" maskUnits="userSpaceOnUse">
                  <circle cx="20" cy="20" r="20" fill="#D9D9D9" />
                </mask>
                <g fill="#fff" mask="url(#a)">
                  {/* SVG Paths */}
                </g>
              </svg>
              <h1 className="mt-4 text-xl font-medium tracking-tight text-white">Hello</h1>
          </header>
          <Clerk.GlobalError className="block text-sm text-red-400" />
          <div className="space-y-4">
            <Clerk.Field name="username" className="space-y-2">
              <Clerk.Label className="text-sm font-medium text-white">Username</Clerk.Label>
                <Clerk.Input
                  type="text"
                  required
                  className="w-full rounded-md bg-neutral-900 px-3.5 py-2 text-sm text-white outline-none ring-1 ring-inset ring-zinc-700 hover:ring-zinc-600 focus:bg-transparent focus:ring-[1.5px] focus:ring-blue-400 data-[invalid]:ring-red-400"/>
                <Clerk.FieldError className="block text-sm text-red-400" />
            </Clerk.Field>
            <Clerk.Field name="password" className="space-y-2">
                <Clerk.Label className="text-sm font-medium text-white">Password</Clerk.Label>
                  <Clerk.Input
                    type="password"
                    required
                    className="w-full rounded-md bg-neutral-900 px-3.5 py-2 text-sm text-white outline-none ring-1 ring-inset ring-zinc-700 hover:ring-zinc-600 focus:bg-transparent focus:ring-[1.5px] focus:ring-blue-400 data-[invalid]:ring-red-400"
                  />
                  <Clerk.FieldError className="block text-sm text-red-400" />
            </Clerk.Field>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full rounded-md bg-neutral-900 px-3.5 py-2 text-sm text-white outline-none ring-1 ring-inset ring-zinc-700 hover:ring-zinc-600 focus:bg-transparent focus:ring-[1.5px] focus:ring-blue-400 data-[invalid]:ring-red-400"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>
          </div>
          <SignUp.Action
            submit
            onClick={handleSignUp}
            className="relative isolate w-full rounded-md bg-blue-500 px-3.5 py-1.5 text-center text-sm font-medium text-white shadow-[0_1px_0_0_theme(colors.white/10%)_inset,0_0_0_1px_theme(colors.white/5%)] outline-none before:absolute before:inset-0 before:-z-10 before:rounded-md before:bg-white/5 before:opacity-0 hover:before:opacity-100 focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-blue-400 active:text-white/70 active:before:bg-black/10"
          >
            Sign Up
          </SignUp.Action>
          <p className="text-center text-sm text-zinc-400">
            Have an account?{' '}
            <a
              href="/sign-in"
              className="font-medium text-white decoration-white/20 underline-offset-4 outline-none hover:underline focus-visible:underline"
            >
              Sign in
            </a>
          </p>
        </SignUp.Step>
        {/* Additional Steps Here */}
      </SignUp.Root>
    </div>
  );
}

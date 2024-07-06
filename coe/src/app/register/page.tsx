'use client'
import * as Clerk from '@clerk/elements/common';
import * as SignUp from '@clerk/elements/sign-up';

export default function SignUpPage() {
  return (
    <SignUp.Root>
      <SignUp.Step name="start">
        <h1>i am from registrer</h1>

        {/* Email Address Field */}
        <Clerk.Field name="emailAddress">
          <Clerk.Label>Email Address</Clerk.Label>
          <Clerk.Input />
          <Clerk.FieldError />
        </Clerk.Field>

        {/* Password Field */}
        <Clerk.Field name="password">
          <Clerk.Label>Password</Clerk.Label>
          <Clerk.Input type="password" />
          <Clerk.FieldError />
        </Clerk.Field>

        {/* Role Field */}
        <Clerk.Field name="publicMetadata.role">
          <Clerk.Label>Role</Clerk.Label>
          <select className="clerk-input">
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
          <Clerk.FieldError />
        </Clerk.Field>

        {/* Sign Up Button */}
        <SignUp.Action submit>Sign Up</SignUp.Action>
      </SignUp.Step>
    </SignUp.Root>
  );
}

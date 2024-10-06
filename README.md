# ClassForge

ClassForge is an educational platform designed to streamline the submission and evaluation of coding assignments for both students and teachers. It automates code grading using the Judge0 API and provides a seamless user experience with React, Next.js, and GraphQL.

## Features

### For Students
- **Join Classes**: Students can join classes using a unique code provided by the teacher.
- **Submit Assignments**: Submit coding assignments directly through the platform.
- **Instant Feedback**: Get immediate feedback on code submissions via automated code evaluation using the Judge0 API.

### For Teachers
- **Create Classes**: Teachers can create new classes and generate unique class codes.
- **Post Assignments**: Create assignments by selecting problems from a problem set using the GraphQL API.
- **Automated Evaluation**: Automatically evaluate submitted code using the Judge0 API.
- **Manage Students**: Track and review submissions from students, with options to assign grades.

## Tech Stack
- **Frontend**: Built with React and Next.js for a fast, responsive user interface.
- **Backend**: Uses Node.js, Express, and MongoDB for managing API requests and data storage.
- **Code Evaluation**: Integrated with the Judge0 API to compile and execute code in real-time.
- **Data Retrieval**: GraphQL API is used to fetch coding problems from platforms like LeetCode.

## Usage

### Teachers
1. Create a class.
2. Post assignments by selecting problems.
3. Monitor and evaluate student submissions.

### Students
1. Join a class using the provided code.
2. Solve and submit coding assignments.
3. Receive instant feedback after submission.

## Key Integrations
- **Judge0 API**: Enables real-time code evaluation and feedback.
- **GraphQL API**: Fetches coding problems, allowing for diverse and challenging assignments.
- **MongoDB**: Stores user data, classes, and assignments.


# 5SecondJobs: An Intuitive Job Board and Tracker

Searching for and tracking jobs is a tedious task that for most involves a spreadsheet. The accessibility of spreadsheets makes them the go to tool but they lack integration with other applications and become unmanagable at scale quickly. 

[5SecondJobs](https://5-second-jobs.vercel.app/) empowers a precise search where users can efficently discern job match and seamlessly move a job application's status. Let's delve into the features of the application and the development process.

## Features

The web application is composed of three separate pages including the jobs, saved, and completed pages. Each page has a similar composition with a filter bar at the top and an infinite paginated scroll of job listings below.

The filters include job title search, location, and experience level. Filters are bookmarkable and the URL dynamically changes in response to changes in the filter selection. Additionally, the job listing count regarding a set of filters is displayed on the right of the search bar.

The job listing are displayed in an infinite paginated scroll. Each job card presents available key information about a given job and expands to show additional details. User actions include opening job links, marking listings as saved, completed, or deleted.

The companies a user applied for are also tracked and job listing for the same given company show the last applied date. These pages are only available upon logging in and these routes are protected with authentication.

I plan to add the ability to update the status of a job application beyond completion with a predefined set of options and an additional text field. Further, I will implement an export to csv feature for completed jobs for portability.


## Implementation

I used Next.js as a full-stack framework to build both the React frontend and the serverless backend using its built-in route handlers. For UI, I used Tailwind, Heroicons, and Framer Motion. For authentication, I used Auth.js. For state management, I used React Query. For my database I used PostgreSQL.

I deployed the web application to Vercel using a serverless setup and I'm hosting my serverless Postgres database on Neon Tech.


# Project Overview: Medical Appointment Booking System

This project is a modern web application designed to streamline the process of scheduling and managin medical appointments.
It focused on providing a clean, accessible, and high-performance user interface for both patients and healthcare providers.

## Technical Stack (Frontned & DevOps)
* Framework: Angular 
* UI Components: Angular Material for a professional, consistent, and accessible designe
* State Management: Zustand
* Containerization: Docker
* CI/CD: GitHub Actions

-------------------------------

## UI/UX Description
The user interface is designed with a mobile-first approach, focusing on clarity and ease of use in high-stress
situations (like booking a doctor's visit).

1. Patient Dashboard 
	* Intuitive Search: A prominent search bar to find doctors by specialty, location, or name using Angular Material’s ```Autocomplete```
	* Appointment Calendar: A visual calendar view for selecting dates and time slots, integrated with ```MatDatepicker```
	
2. Doctor/Admin Interface
	* Schedule Management: A comprehensive dashboard to view daily appointments and manage availability.
	* Data Tables: Advanced filtering and sorting of patient records using MatTable with pagination
3. Core UI Features
	* Responsive Design: Fully adaptive layout using Flex Layout/CSS Grid to ensure usability on desktops, tablets, and smartphones
	* State Consistency: Using Zustand to handle user sessions, booking drafts, and UI preferences (like Dark Mode) without the boilerplate of Redux
	* Modern Aesthetics: Clean typography, ample white space, and a calming color palette (blues and teals) appropriate for the healthcare industry

------------------------------

## Infrastructure & Workflow
	* Dockerized Environment: The application is containerized to ensure that the "it works on my machine" problem is eliminated
	* GitHub Actions CI: Every push triggers a pipeline that:
		1. Lints the code for consistency
		2. Runs unit tests to ensure stability
		3. Builds the production Docker image



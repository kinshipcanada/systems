# Kinship's Internal Systems

This folder contains Kinship Canada's internal code, including it's API, report generation, and processing systems. Kinship Canada is a CRA-registered charity, and therefore has obligations to maintain reporting standards, generate CRA-eligible tax receipts, etc. This codebase is where the majority of the backend code lies, including the internal API.

It's open source to allow other charities to easily replicate the functionality without needing to write it from scratch. Together, Kinship's systems offer donors;
- User dashboard to view donations, manage billing, and more
- Recurring and one time donations
- Ways to see where their donation has gona

Charity should be powered by good software.

## Folder Structure
*Tentative, changes quickly*

- `api`: contains the api system allowing the website to interface with the system
- `classes`: main folders containing base objects that the system builds off of
    - `cart`: donation cart object, including functions to see how much to send to each region etc
    - `donation`: main donation object. Encapsulates donor and cart objects
    - `donors`: donor object, which supports both logged in and signed out users
    - `errors`: custom error object with logging
    - `events`: errors, notifications, etc build off the events object
    - `notifications`: sends notifications out, including for donations, refunds, tax receipts, etc
    - `utility_classes`: helpers
- `stripe`: stripe engine and helper classes, including building objects from stripe

## API Reference

**Get Requests (e.g. fetching donations, donors, etc)**
- **GET** `/donation/[id]` - Fetches an individual donation from it's Kinship ID, Stripe charge ID, or Stripe payment intent id
- **GET** `/donation/batch/[list_of_ids]` - Fetches a number of donations. ID types do not need to be the same. Uses promise.all to batch donations (effectively a `/donation/id` wrapper).

## To Do
- [ ] Add full state list
- [ ] Add custom log info
- [ ] Add phone number validation from stripe
- [x] Allow donation retrieval from charge id + payment id
- [ ] Implement fetching donations from Kinship donation ID
- [ ] API key system?
# Kinship's Internal Systems

This folder contains Kinship Canada's internal code, including it's API, report generation, and processing systems.

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
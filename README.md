# Kinship's Internal Systems

This folder contains Kinship Canada's internal code, including it's API, report generation, and processing systems.

## Folder Structure
*Tentative, changes quickly*

- `classes`: main folders containing base objects that the system builds off of
    - `cart`: donation cart object, including functions to see how much to send to each region etc
    - `donation`: main donation object
    - `donors`
    - `errors`
    - `events`
    - `notifications`
    - `utility_classes`
- `notifications`: notification engine, sends out SMS and emails to donors

## To Do
- [ ] Add full state list
- [ ] Add custom log info
- [ ] Add phone number validation from stripe
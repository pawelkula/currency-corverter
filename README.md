# Currency exchange - tech assignment

## Prerequisites
Node version: 16.7.0 (should work on other modern versions as well)

## Setup
2. Checkout the code and run `yarn` to install all dependencies
3. Run `yarn start` to start the project locally

# Possible improvements
Having more time (as I didn't want to spend on this assignment more than 12 hours), I would:
- implement some routes when switching the tabs (probably React Router)
- store the conversion history on the backend side (maybe firebase) instead of localStorage
- implement better error handlers
- use more advanced API to get the rates (instead of calculate every rate based on USD)
- remove the hack that starts with line 87 in `exchange-history.js`. To see the original solution, please chekout the commit `817ce5f` 
- write unit tests

For a reference, the PDF with the task is included in the `task` folder

In any case, feel free to contact me using email:
pawelkula@gmail.com
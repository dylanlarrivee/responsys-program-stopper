# Responsys Program Stopper
A custom solution web app that can be used along side [Oracle Responsys](https://www.oracle.com/marketingcloud/products/cross-channel-orchestration/) marketing software to allow a digital marketer to stop cross channel orchestration programs from anywhere without the need to log into their Responsys account. 

# Technologies used:
Node.js, PostgreSQl, JavaScript, Vue.js and utilizes the
Responsys API functionality.

# Purpose
I built this web app as a proof of concept for a need that was brought up by one of my digital marketing clients. They wanted a way to be able to stop programs in Responsys 

# Note: 
For the demo, I have the web app hardcoded to a test account and wont actually stop any of the programs so that the retrieve running program list functionality can continue working even when multiple people stop a program. When this is used live the settings can be changed to stop programs as expected.

# Getting Set Up

## Running Locally

1. Clone this repo to your local environment.
2. cd into the app_public folder.
3. Run `npm install`.
4. Create a local PostgreSQl database called ss_program_stopper
5. Create your own .env file in the main folder Thant contains the following:
    1. POSTGRES_DB_CREDS= credentials for your local PostgreSQl database. Example: me:password@localhost:5432/ss_program_stopper
    2. riUsername= username for your Responsys account.
    3. riPassword= password for your Responsys account.


## Running on Heroku

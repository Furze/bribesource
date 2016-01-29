# Pimp my story

deploy to openshift with 'grunt buildcontrol:openshift'

to deploy to heroku, read the DEPLOYMENT TO HEROKU section below


## Automatic email sending
- Phil

## Frontend redesign / UI
- Shawn
- Andrew

## Scheduling
- Jeff Yu
- Abizer
- Jason

## Game Controller Logic
- Gerardo

## PEOPLE WHO NEED JOBS (?)
- Rowan
- Mercedeh
- Jackson


## DEPLOYMENT TO HEROKU

not using grunt-build-control yet; please deploy manually with the following steps

1. install Heroku Toolbelt on your machine
2. set/export HEROKU_DIR environment variable to a working directory somewhere outside of the app’s checkout directory
3. run ‘grunt build —-force’ in the checkout directory
4. cd to HEROKU_DIR
5. run ‘git init’
6. run ‘heroku login’
7. run ‘heroku create’ or ‘git remote add heroku https://git.heroku.com/<name of the app you created>.git’
8. commit what’s in HEROKU_DIR and run ‘git push heroku master’

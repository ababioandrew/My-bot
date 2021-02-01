## OPTIMIZATION INSTRUCTIONS

##### HOW TO BUNDLE JS FILES INSIDE ALREADY EXISTING EJS FILES

* STEP 1: Include the your custom js file inside /public/javascripts and write whatever code you want

* STEP 2: Open the gulpfile.js inside the root folder

* STEP 3: Look for the line that says "//====== JS LINKS ARRAY STARTS HERE ======//"

* STEP 4: Scroll down till you find the #{nameofTheEjsFile}ScriptsArray

* STEP 4: Append the url of the js to the array like so [...'/public/javascripts/${nameOfJsDileYouAdded}.js']

* STEP 5: Open your terminal/bash and type in this command {Make Sure You Have Ruby Installed}

```ruby
  rake optimize
```

#Start Both Flask as well as React Servers at the Same Time.

#Start the Flask Starting Script.
wt -w 0 powershell -noExit -Command "& 'The full file path to start_flask.ps1'"

#Start the React Starting Script.
wt -w 0 powershell -noExit -Command "& 'The full file path to start_react.ps1'"
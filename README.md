# eLib

This is a simple library application I wrote using purely Electron and Node.js as a small project.

You can add, remove and open PDFs. It uses a JSON file to keep track of book names, paths, and thumnail images (encoded as base64). 

The interface is clean, although it has a few bugs if the path names become tricky.

## Running

The Node dependencies are `electron`, `electron/remote`, `jquery` and `bowser`. The `bowser` dependencies include `bootstrap` and `font-awesome`.

In addition, the program calls a Python3 script which gets the base64 thumbnail and pages of the PDF, it uses `PyMuPDF` as a dependency.

Once you have the dependencies installed, simply run:

`npm start`


const remote = require('@electron/remote');
const { dialog } = remote;
const { exec } = require('child_process');

var $ = require('jquery');
var path = require('path');
var fs = require('fs');

var booksLeftToAdd = 0;

function createCatalogCard(book_name, book_description, book_image, book_path) {
    var catalog_card = "";
    catalog_card += '<div class="col-3 d-flex align-items-stretch">'
    catalog_card += '<div class="card shadow-sm mb-5" style="width:18rem;">';
    catalog_card += '<img src="data:image/jpeg;charset=utf-8;base64,' + book_image + '" class="card-img-top" alt="...">';
    catalog_card += '<div class="card-body">';
    catalog_card += '<h5 class="card-title">' + book_name + '</h5>';
    catalog_card += '<p class="card-text">' + book_description + '</p>';
    catalog_card += '</div>';
    catalog_card += '<div class="card-footer">'
    catalog_card += '<button class="btn btn-sm btn-success" style="float:left;" onclick="openPDF(\'' + book_path.replaceAll('\\', '\\\\').replaceAll('\'', '\\\'') + '\')">Open PDF</button>';
    catalog_card += '<button class="btn btn-sm btn-danger" style="float:right;" onclick="removeBookFromCatalog(\'' + book_name.replaceAll('\'', '\\\'') + '\')"><span class="fa fa-minus"></span></button>';
    catalog_card += '</div>'
    catalog_card += '</div></div>';
    $("#books_catalog").append(catalog_card);
}

function addToJSON(book_name, book_description, book_thumbnail, book_path) {
    fs.readFile(path.join(__dirname, 'resources/catalog.json'), 'utf-8', (err, data) => {
        if (err) {
            alert("An error occured. " + err);
        }
        else {
            catalog_JSON = JSON.parse(data);
            catalog_JSON[book_name] = { "description": book_description, "thumbnail": book_thumbnail, "path": book_path }
            fs.writeFileSync(path.join(__dirname, 'resources/catalog.json'), JSON.stringify(catalog_JSON), 'utf-8');
            booksLeftToAdd--;

            if (booksLeftToAdd <= 0) {
                booksLeftToAdd = 0;
                loadfromJSON();
            }
        }
    });
}

function loadfromJSON() {
    document.getElementById("books_catalog").innerHTML = '';
    fs.readFile(path.join(__dirname, 'resources/catalog.json'), 'utf-8', (err, data) => {
        if (err) {
            alert("An error occured. " + err);
        }
        else {
            try {
                catalog_JSON = JSON.parse(data);
                for (const book_name in catalog_JSON) {
                    createCatalogCard(book_name, catalog_JSON[book_name]["description"], catalog_JSON[book_name]["thumbnail"], catalog_JSON[book_name]["path"]);
                }
            }
            catch (e) {
                alert("It seems the JSON file is corrupted!");
            }
        }
    });
}

function addBookToCatalog() {
    dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] }).then((files) => {
        // handle files
        pdfFileList = files["filePaths"];
        booksLeftToAdd = pdfFileList.length;
        for (let pdfName of pdfFileList) {
            exec(path.join(__dirname, 'resources/bin/pdf-tnail.exe') + ' \"' + pdfName + "\"", (error, stdout, stderr, fileName = pdfName) => {
                json_data = JSON.parse(stdout)
                var image_thumbail = json_data["thumbnail"];
                var pages = json_data["pages"];
                var desc = '<span class=\'text-muted\'>' + pages + '</span> pages'
                pdfName = path.parse(fileName).base.replace(".pdf", "");
                addToJSON(pdfName, desc, image_thumbail, fileName);
            });
        }
    });
}

function removeBookFromCatalog(book_name)
{
    fs.readFile(path.join(__dirname, 'resources/catalog.json'), 'utf-8', (err, data) => {
        if (err) {
            alert("An error occured. " + err);
        }
        else {
            catalog_JSON = JSON.parse(data);
            delete catalog_JSON[book_name];
            fs.writeFileSync(path.join(__dirname, 'resources/catalog.json'), JSON.stringify(catalog_JSON), 'utf-8');
            loadfromJSON();
        }
    });
}

function openPDF(book_path)
{
    console.log("Received Path: ", book_path);
    window.open(book_path);
}

$(document).ready(() => {
    loadfromJSON();
});

function quitApplication()
{
    var window = remote.getCurrentWindow();
    window.close();
}

function minimizeApplication()
{
    var window = remote.getCurrentWindow();
    window.minimize();
}
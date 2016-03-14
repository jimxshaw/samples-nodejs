var http = require("http");
var querystring = require("querystring");
var fs = require("fs");
var path = require("path");
var url = require("url");

var directory = "./documents";

// Create a simple http web server. It takes a callback that accepts
// a request and returns a response. The server is a stream. To stop
// it, we have to call .end method or it will continue to run indefinitely.
var server = http.createServer(function (req, res) {
    writeIndex(req, res);
});

// This is the function to write out the file contents from the documents
// directory.
function writeIndex(req, res) {
    // It's important to tell the browser that we're going to pass in html
    // so it'll render html. Http response status code of 200 means OK.
    res.writeHead(200, { "Content-Type": "text/html" });

    fs.readdir(directory, function (err, files) {
        // If an error appears, end the server immediately and exit the function.
        if (err) {
            res.end(err);
            return;
        }

        // Declare a variable that will be used in our template string later.
        var fileListHtml = "";
        for (var i = 0; i < files.length; i++) {
            var file = files[i];

            // The ?file is the query string that specifies a particular file.
            // When an a tag has a ?= that means when it's clicked, it'll replace
            // whatever query string that's there with that query string.
            fileListHtml += `<li><a href="?file=${ file }">${ file }</a></li>`;
        }

        // Template strings use backticks, the symbol next to 1 key. Keep in mind
        // that backticks allow for multi-line template strings and javascript
        // // expressions, signified by ${}.
        res.end(`
            <ul>
                ${ fileListHtml }
            </ul>
            <form method="POST">
                <input type="text" name="file"/>
                <textarea name="text"></textarea>
                <input type="submit" />
            </form>
        `);
    });
}

// List the port where the web server will listen to requests.
server.listen(8000, function () {
    console.log("Listening on port 8000...");
});

//# sourceMappingURL=server-compiled.js.map
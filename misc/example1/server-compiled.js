var http = require("http");
var querystring = require("querystring");
var fs = require("fs");
var path = require("path");
var url = require("url");

var directory = "./documents";

// Regular expression to securitize url paths.
var invalidFileRegex = /^[.\/\\]|\.\./;

// Create a simple http web server. It takes a callback that accepts
// a request and returns a response. The server is a stream. To stop
// it, we have to call .end method or it will continue to run indefinitely.
var server = http.createServer(function (req, res) {
    // Detects the method of form submission, either through the url (GET)
    // or submit button (POST) and execute a specific method to handle each.
    if (req.method === "POST") {
        handlePost(req, res);
        return;
    }

    // Parse out the request's url query string.
    var query = url.parse(req.url, true).query;

    if (query.file) {
        writeFile(req, res, query);
        return;
    }

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

function writeFile(req, res, query) {
    // If users try to input a malicious url query string, send back a particular
    // response.
    if (invalidFileRegex.test(query.file)) {
        writeText(res, 400, "Invalid filename");
        return;
    }

    // Create the full filename.
    var filename = path.join(directory, query.file);

    fs.readFile(filename, function (err, buffer) {
        if (err) {
            writeText(res, 400, err);
            return;
        }

        // If no error, write out with a status of 200, OK and get the contents
        // of the file out with buffer.
        writeText(res, 200, buffer.toString());
    });
}

// POST requests are handled here.
function handlePost(req, res) {
    // Capture all of the request body data. The request object is a stream from the browser,
    // it will stream in the data as it happens. We need to handle this asynchronously.
    var body = "";

    // Think of the req stream as the read stream while the res stream is the write stream.
    // Because req is a read stream, we can add an .on method event handler. The event
    // handler of "data" will be invoked every time the browser is sending more data to
    // the server, aggregate the data as it flows in.
    req.on("data", function (data) {
        body += data;
    });

    // When the browser indicates to the server that there's no more data to send, we need
    // to handle and process the data that we accumulated from all these data events.
    req.on("end", function () {
        var form = querystring.parse(body);

        // If the user didn't provide a file name or the file name is tested to be invalid
        // by our security regular expression, send back a status of 400 bad request.
        if (!form.file || invalidFileRegex.test(form.file)) {
            writeText(res, 400, "Invalid Path");
            return;
        }

        // The writeFileSync is wrapped in a try-catch block. If anything goes wrong, the
        // block will proc and an appropriate message is sent back. If it succeeds then
        // kick off the writeIndex function that writes the file into the index page.
        try {
            fs.writeFileSync(path.join(directory, form.file), form.text);
            writeIndex(req, res);
        } catch (ex) {
            writeText(res, 400, "Could not save file");
            console.error(ex);
        }
    });
}

// This is used in case of errors. It will write out a head of a specified http
// status code of content-type plain text and then write out some text.
function writeText(res, status, text) {
    res.writeHead(status, { "Content-Type": "text/plain" });
    res.end(text);
}

// List the port where the web server will listen to requests.
server.listen(8000, function () {
    console.log("Listening on port 8000...");
});

//# sourceMappingURL=server-compiled.js.map
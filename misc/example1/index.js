var fs = require("fs");
var path = require("path");

var directory = "./documents";

// The callback will always be the last parameter of an asynchronous method.
// The callback usually has error as the first parameter followed by any other
// parameters that might be returned.
fs.readdir(directory, function(err, files) {
    if (err) {
        console.log(err);
        return;
    }

    for (var i = 0; i < files.length; i++) {
        var file = files[i];

        console.log(file);

        // Sync is appended to methods that will execute synchronously. This means
        // readFileSync will block all other code execution until itself as finished.
        var fileContentsBuffer = fs.readFileSync(path.join(directory, file));
        console.log(fileContentsBuffer.toString());
    }
});


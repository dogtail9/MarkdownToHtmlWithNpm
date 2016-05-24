var Remarkable = require('remarkable');
var eachFile = require("each-file");
var fs = require('fs');
var glob = require("glob");
var toc = require('markdown-toc');
var replaceExt = require('replace-ext');

var md = new Remarkable().use(function (remarkable) {
    remarkable.renderer.rules.heading_open = function (tokens, idx) {
        return '<h' + tokens[idx].hLevel + ' id=' + toc.slugify(tokens[idx + 1].content) + '>';
    };
});

glob("./Markdown/*.md", function (er, files) {
    for (var index in files) {
        var filename = files[index];
        console.log(filename);
        fs.readFile(filename, function (err, data) {
            if (err)
                throw err;
            if (data)
                var html = md.render(toc.insert(data.toString('utf8')));
                var newFilename = replaceExt(filename, '.html');
            fs.writeFile(newFilename, html, function (err) {
                if (err) return console.log(err);
                console.log('File ' + newFilename +' saved.');
            });

            console.log(html);
        });
    }
});

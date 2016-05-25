var Remarkable = require('remarkable');
var eachFile = require("each-file");
var fs = require('fs');
var glob = require("glob");
var toc = require('markdown-toc');
var replaceExt = require('replace-ext');
var hljs = require('highlight.js')
var img64 = require('img64');
var livereload = require('livereload');

var minPort = 1000;
var maxPort = 1998;
var myPort = Math.floor(Math.random() * (maxPort - minPort + 1) + minPort);

//var server = livereload.createServer({
//    port: myPort
//});
//server.watch('/Markdown');


 console.log('process.argv', process.argv);
 
var md = new Remarkable({
    html: true,
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(lang, str).value;
            } catch (err) { }
        }

        try {
            return hljs.highlightAuto(str).value;
        } catch (err) { }

        return ''; // use external default escaping 
    }
}).use(function (remarkable) {
    remarkable.renderer.rules.heading_open = function (tokens, idx) {
        return '<h' + tokens[idx].hLevel + ' id=' + toc.slugify(tokens[idx + 1].content) + '>';
    };
});

glob("./Markdown/*.md", function (er, files) {
    var template = '';
    fs.readFile('Template.html', function (err, data) {
        if (err)
            throw err;
        template = data.toString('utf8');
    });

    for (var index in files) {
        var filename = files[index];
        console.log(filename);
        fs.readFile(filename, function (err, data) {
            if (err)
                throw err;
            if (data) {
                var html = md.render(toc.insert(data.toString('utf8')));
                
                var BuildNumber, i = process.argv.indexOf("--BuildNumber");
                console.log('i', i);
                if (i > -1) {
                    BuildNumber = '<p class="buildNumber">' + process.argv[i + 1] + '</p>';
                    time = 0;
                }
                else {
                    BuildNumber = '<p class="buildNumber">DevBuild</p>\n<script src="http://localhost:' + myPort + '/livereload.js?snipver=1"></script>';
                    time = 1000;
                }
                
                html = template.replace('@@@HTML@@@', html);
                html = html.replace('@@@BuildName@@@', BuildNumber);
                html = html.replace('.md', '.html');
                
                var htmlWithImg64 = '';

                console.log('innan');
                var test = '<html><body><img src="Media/Image.png"></body></html>';
                var p = __dirname + '/Markdown';
                console.log(p);
                img64.encodeImgs(html, { baseDir: p }, function (err, data) {
                    if (err) {
                        console.log(err);
                        throw err;
                    }
                    htmlWithImg64 = data;
                    console.log('Klar');
                    //console.log(data);

                    var newFilename = replaceExt(filename, '.html');
                    fs.writeFile(newFilename, htmlWithImg64, function (err) {
                        if (err) return console.log(err);
                        console.log('File ' + newFilename + ' saved.');
                    });
                });
                console.log('efter');
            }



            //console.log(html);
        });
    }
});

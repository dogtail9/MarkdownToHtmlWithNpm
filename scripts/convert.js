//var config = require('config.js');
var Promise = require('bluebird');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

var Remarkable = require('remarkable');
var fs = require('fs');
var path = require('path');
var glob = require("glob");
var toc = require('markdown-toc');
var replaceExt = require('replace-ext');
var hljs = require('highlight.js')
var img64 = Promise.promisifyAll(require('img64'));

var md = new Remarkable({
    html: true,
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(lang, str).value;
            } catch (err) {
                console.log(err);
            }
        }

        try {
            return hljs.highlightAuto(str).value;
        } catch (err) {
            console.log(err);
        }

        return ''; // use external default escaping 
    }
}).use(function (remarkable) {
    remarkable.renderer.rules.heading_open = function (tokens, idx) {
        return '<h' + tokens[idx].hLevel + ' id=' + toc.slugify(tokens[idx + 1].content) + '>';
    };
});

function getHtmlTemplate() {
    return fs.readFileSync('./Template.html', 'utf8');
};

function getBuildNumber() {
    var i = process.argv.indexOf("--BuildNumber");
    console.log('i', i);
    if (i > -1) {
        var time = 0;
        return '<p class="buildNumber">' + process.argv[i + 1] + '</p>';
    }
    else {
        var time = 1000;
        var myPort = 9090;
        return '<p class="buildNumber">DevBuild</p>\n<script src="http://localhost:' + myPort + '/livereload.js?snipver=1"></script>';
        //BuildNumber = '<p class="buildNumber">DevBuild</p>';
    }
};

var base64EncodeImg = async(function (html) {
    var p = __dirname + '\\..\\Markdown';
    console.log('p', p);
    var encodedHtml = await(img64.encodeImgsAsync(html, { baseDir: p }));
    return encodedHtml;
});

function convertToMarkdown(filename) {
    var html = fs.readFileSync(filename, 'utf-8');
    html = md.render(toc.insert(html));
    return html;
};

var convertFiles = async(function (filename) {
    var html = convertToMarkdown(filename);
    html = await(base64EncodeImg(html));
    html = getHtmlTemplate().replace('@@@HTML@@@', html);
    html = html.replace('@@@BuildName@@@', getBuildNumber());
    html = html.replace('.md', '.html');

    var dir = './dist';
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    var newFilename = replaceExt(filename, '.html');
    newFilename = './dist/' + path.basename(newFilename);
    var tempFilename = './dist/temp.html';
    
    fs.writeFile(tempFilename, html, function (err) {
        if (err) return console.log(err);
        fs.unlinkSync(newFilename);
        fs.rename(tempFilename, newFilename);
        console.log('File ' + newFilename + ' saved.');
    });

    console.log(html);
});

console.log('START');
glob("./Markdown/*.md", function (er, files) {
    console.log('iterate over files');
    for (var index in files) {
        var filename = files[index];
        console.log(filename);
        convertFiles(filename);
    };
});
console.log('STOP');
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
    var encodedHtml = await(img64.encodeImgsAsync(html, { baseDir: p }));
    return encodedHtml;
});

function convertToMarkdown(filename) {
    var html = fs.readFileSync(filename, 'utf-8');
    html = md.render(toc.insert(html));
    return html;
};

function createDistFolderIfNotExist() {
    var dir = './dist';
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
};

function deleteFileIfExists(filename) {
    if (!fs.existsSync(filename)) {
        fs.unlinkSync(filename);
    }
};

function getDistPath(filename) {
    var newFilename = replaceExt(filename, '.html');
    newFilename = './dist/' + path.basename(newFilename);

    return newFilename;
};

function saveFile(newFilename, html) {
    createDistFolderIfNotExist();
    var tempFilename = './dist/temp.html';

    fs.writeFile(tempFilename, html, function (err) {
        if (err) return console.log(err);
        deleteFileIfExists(tempFilename);
        fs.renameSync(tempFilename, newFilename);

        console.log('File ' + newFilename + ' saved.');
    });
};

function saveFile2(newFilename, html) {
    createDistFolderIfNotExist();
    fs.writeFile(newFilename, html, function (err) {
        if (err) return console.log(err);
        console.log('File ' + newFilename + ' saved.');
    });
};

var convertFile = async(function (filename) {
    var html = convertToMarkdown(filename);
    html = await(base64EncodeImg(html));
    html = getHtmlTemplate().replace('@@@HTML@@@', html);
    html = html.replace('@@@BuildName@@@', getBuildNumber());
    html = html.replace('.md', '.html');

    return html;
});

var processFile = async(function (er, files) {
    for (var index in files) {
        var filename = files[index];
        console.log('Converting ' + filename + 'to HTML');
        var html = await(convertFile(filename));
        var tempFilename = getDistPath(filename);
        saveFile2(tempFilename, html);
    };
});

glob("./Markdown/*.md", processFile);

//console.log('START');
//glob("./Markdown/*.md", function (er, files) {
//    console.log('iterate over files');
//    for (var index in files) {
//        var filename = files[index];
//        console.log(filename);
//        convertFiles(filename);
//    };
//});
//console.log('STOP');
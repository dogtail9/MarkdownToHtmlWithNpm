//var minPort = 1000;
//var maxPort = 1998;
//var myPort = Math.floor(Math.random() * (maxPort - minPort + 1) + minPort);

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

var paths = {
    Template: './Template.html',
    MarkdownFiles: './Markdown/*.md',
    MarkdownFolder: '\\Markdown',
    Dist: './dist'
};

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
    return fs.readFileSync(paths.Template, 'utf8');
};

function getBuildNumber() {
    var i = process.argv.indexOf("--BuildNumber");
    if (i > -1) {
        return '<p class="buildNumber">' + process.argv[i + 1] + '</p>';
    }
    else {
        var myPort = 9090;
        return '<p class="buildNumber">DevBuild</p>\n<script src="http://localhost:' + myPort + '/livereload.js?snipver=1"></script>';
    }
};

var base64EncodeImg = async(function (html) {
    console.log('base64EncodeImg');
    var p = __dirname + paths.MarkdownFolder;
    console.log('p', p);
    var encodedHtml = await(img64.encodeImgsAsync(html, { baseDir: p }));
    return encodedHtml;
});

function convertMarkdownToHtml(filename) {
    console.log('Convert Markdown to HTML');
    var html = fs.readFileSync(filename, 'utf-8');
    html = md.render(toc.insert(html));
    return html;
};

function createDistFolderIfNotExist() {
    if (!fs.existsSync(paths.Dist)) {
        fs.mkdirSync(paths.Dist);
    }
};

function deleteFileIfExists(filename) {
    if (!fs.existsSync(filename)) {
        fs.unlinkSync(filename);
    }
};

function getDistPath(filename) {
    var newFilename = replaceExt(filename, '.html');
    newFilename = paths.Dist + '/' + path.basename(newFilename);

    return newFilename;
};

function saveFile(newFilename, html) {
    createDistFolderIfNotExist();
    var tempFilename = paths.Dist + '/temp.html';

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
    var html = convertMarkdownToHtml(filename);
    html = await(base64EncodeImg(html));
    html = getHtmlTemplate().replace('@@@HTML@@@', html);
    html = html.replace('@@@BuildName@@@', getBuildNumber());
    html = html.replace('.md', '.html');

    return html;
});

var processFile = async(function (er, files) {
    for (var index in files) {
        var filename = files[index];
        console.log('Converting ' + filename + ' to HTML');
        var html = await(convertFile(filename));
        var tempFilename = getDistPath(filename);
        saveFile2(tempFilename, html);
    };
});

glob(paths.MarkdownFiles, processFile);
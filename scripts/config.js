module.exports = function () {
    var config = {};
    config.paths = GetPaths();

    return config;
};

function GetPaths() {
    var paths = {
        Template: "./Template.html",
        MarkdownFiles: "./Markdown/*.md",
        dist: "./dist/"
    };
    
    return paths;
};
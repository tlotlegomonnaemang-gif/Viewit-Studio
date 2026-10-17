(function(exports){
'use strict';

function newProject(id, name){
  return {
    id: id,
    name: name||'Untitled Project',
    files: [
      {id: id+'-f1', path: 'index.html', content: '<!DOCTYPE html>\n<html>\n<head><title>My App</title><link rel="stylesheet" href="style.css"></head>\n<body>\n<h1>Hello ViewIt Dev</h1>\n<script src="script.js"><\/script>\n</body>\n</html>'},
      {id: id+'-f2', path: 'style.css', content: 'body{background:#0e1310;color:#eef4ee;font-family:sans-serif}'},
      {id: id+'-f3', path: 'script.js', content: 'console.log("ViewIt Dev Studio ready");'}
    ],
    created: Date.now(),
    updated: Date.now()
  };
}

exports.newProject=newProject;
})(typeof exports!=='undefined'?exports:(window.DevModule={}));

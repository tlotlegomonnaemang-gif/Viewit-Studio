(function(exports){
'use strict';

function csvToMarkdown(text,delim){
  var d=delim||',';
  var rows=[],cell='',row=[],inQ=false;
  for(var i=0;i<text.length;i++){
    var c=text[i];
    if(inQ){
      if(c==='"'){
        if(text[i+1]==='"'){cell+='"';i++;}
        else inQ=false;
      } else cell+=c;
    } else {
      if(c==='"') inQ=true;
      else if(c===d){row.push(cell);cell='';}
      else if(c==='\n'){row.push(cell);rows.push(row);row=[];cell='';}
      else if(c!=='\r') cell+=c;
    }
  }
  if(cell||row.length){row.push(cell);rows.push(row);}
  if(!rows.length) return '_No data._';
  var maxCols=0;
  rows.forEach(function(r){if(r.length>maxCols)maxCols=r.length;});
  var out=[];
  var head=rows[0]||[];
  while(head.length<maxCols)head.push('');
  out.push('| '+head.join(' | ')+' |');
  out.push('| '+Array.apply(null,{length:maxCols}).map(function(){return '---';}).join(' | ')+' |');
  for(var r=1;r<rows.length;r++){
    var rr=rows[r].slice(0,maxCols);
    while(rr.length<maxCols)rr.push('');
    out.push('| '+rr.join(' | ')+' |');
  }
  return out.join('\n');
}

function jsonToMarkdown(text){
  var data;
  try{data=JSON.parse(text);}catch(e){return '_Invalid JSON_';}
  function render(v){
    if(v===null)return 'null';
    if(typeof v==='string')return v;
    if(typeof v==='number'||typeof v==='boolean')return String(v);
    if(Array.isArray(v))return v.map(function(x){return '- '+render(x);}).join('\n');
    if(typeof v==='object'){
      var keys=Object.keys(v);
      return keys.map(function(k){return '**'+k+'**: '+render(v[k]);}).join('\n');
    }
    return String(v);
  }
  return render(data);
}

exports.csvToMarkdown=csvToMarkdown;
exports.jsonToMarkdown=jsonToMarkdown;
})(typeof exports!=='undefined'?exports:(window.ConvertersModule={}));

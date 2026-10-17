(function(exports){
'use strict';

function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}
function cleanName(s){return String(s||'').trim().replace(/[\\/:*?"<>|]/g,'-').replace(/\s+/g,' ').slice(0,120);}
function uid(p){return(p||'id')+'-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8);}

var ALLOWED={a:1,abbr:1,address:1,article:1,aside:1,b:1,bdi:1,bdo:1,blockquote:1,br:1,caption:1,cite:1,code:1,col:1,colgroup:1,dd:1,del:1,details:1,dfn:1,div:1,dl:1,dt:1,em:1,figcaption:1,figure:1,footer:1,h1:1,h2:1,h3:1,h4:1,h5:1,h6:1,header:1,hgroup:1,hr:1,i:1,img:1,ins:1,kbd:1,li:1,main:1,mark:1,nav:1,ol:1,p:1,picture:1,pre:1,q:1,rp:1,rt:1,ruby:1,s:1,samp:1,section:1,small:1,source:1,span:1,strong:1,sub:1,summary:1,sup:1,table:1,tbody:1,td:1,tfoot:1,th:1,thead:1,time:1,tr:1,u:1,ul:1,var:1,video:1,audio:1,track:1,input:1,button:1,label:1,form:1,select:1,option:1,textarea:1};
var DROP={script:1,style:1,link:1,meta:1,base:1,title:1,iframe:1,object:1,embed:1,noscript:1,svg:1,math:1};

function safeUrl(v,attr){
  if(v==null)return false;
  var s=String(v).trim().replace(/[\u0000-\u001F\u007F]/g,'');
  if(s==='')return true;
  if(/^media:\/\/[A-Za-z0-9_-]+$/.test(s))return true;
  if(/^(https?:|mailto:|tel:|blob:|#|\/|\.\/|\.\.\/)/i.test(s))return true;
  if(/^data:image\/(png|jpe?g|gif|webp|avif|bmp);base64,/i.test(s))return true;
  if(attr==='src'&&/^data:(video|audio)\//i.test(s))return true;
  return false;
}

function unwrap(n){
  var p=n.parentNode;
  if(!p)return;
  while(n.firstChild)p.insertBefore(n.firstChild,n);
  p.removeChild(n);
}

function sanitizeFallback(html){
  var cleaned=String(html||'');
  cleaned=cleaned.replace(/<script[\s\S]*?<\/script>/gi,'');
  cleaned=cleaned.replace(/<style[\s\S]*?<\/style>/gi,'');
  cleaned=cleaned.replace(/\s*on\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi,'');
  cleaned=cleaned.replace(/\s*javascript\s*:\s*("[^"]*"|'[^']*'|[^\s>]+)/gi,'');
  return cleaned;
}

function sanitize(html){
  var doc;
  try{
    if(typeof DOMParser!=='undefined'){
      doc=new DOMParser().parseFromString('<body>'+html+'</body>','text/html');
    } else {
      return sanitizeFallback(html);
    }
  }catch(e){return sanitizeFallback(html);}
  var all=Array.prototype.slice.call(doc.body.querySelectorAll('*'));
  for(var k=0;k<all.length;k++){
    var n=all[k];
    if(!n.parentNode)continue;
    var tag=n.tagName.toLowerCase();
    if(DROP[tag]){n.remove();continue;}
    if(!ALLOWED[tag]){unwrap(n);continue;}
    var at=Array.prototype.slice.call(n.attributes);
    for(var a=0;a<at.length;a++){
      var nm=at[a].name.toLowerCase(),vl=at[a].value;
      if(nm.indexOf('on')===0||nm==='srcdoc'||nm==='formaction'){
        n.removeAttribute(at[a].name);
        continue;
      }
      if(nm==='href'||nm==='src'||nm==='poster'){
        if(!safeUrl(vl,nm))n.removeAttribute(at[a].name);
      }
    }
    if(tag==='a'){
      n.setAttribute('rel','noopener noreferrer');
      if(!n.getAttribute('target'))n.setAttribute('target','_blank');
    }
    if(tag==='input'){
      var it=(n.getAttribute('type')||'').toLowerCase();
      if(it!=='checkbox'){unwrap(n);continue;}
      n.setAttribute('disabled','');
    }
    if(tag==='img'&&!n.hasAttribute('alt'))n.setAttribute('alt','');
    if(tag==='img'&&!n.hasAttribute('loading'))n.setAttribute('loading','lazy');
  }
  return doc.body.innerHTML;
}

function slugify(s){
  return String(s||'').toLowerCase().replace(/[^\w\u00a1-\uffff\s-]/g,'').trim().replace(/\s+/g,'-').slice(0,60)||'section';
}

var slugCounts={};
function uniqueSlug(s){
  var b=slugify(s);
  if(!slugCounts[b]){slugCounts[b]=1;return b;}
  slugCounts[b]++;
  return b+'-'+slugCounts[b];
}

function inlineMd(s){
  var x=esc(s),codes=[];
  x=x.replace(/`([^`]+)`/g,function(_,c){codes.push(c);return '\u0000'+(codes.length-1)+'\u0000';});
  x=x.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g,function(_,a,u){return '<img src="'+u+'" alt="'+a+'" loading="lazy">';});
  x=x.replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g,function(_,t,u){return '<a href="'+u+'" target="_blank" rel="noopener noreferrer">'+t+'</a>';});
  x=x.replace(/(^|[\s(])(https?:\/\/[^\s<)"\']+)/g,function(_,p,u){return p+'<a href="'+u+'" target="_blank" rel="noopener noreferrer">'+u+'</a>';});
  x=x.replace(/\*\*\*(.+?)\*\*\*/g,'<strong><em>$1</em></strong>');
  x=x.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>');
  x=x.replace(/(^|[^\w_])__([^_]+)__(?![\w_])/g,'$1<strong>$2</strong>');
  x=x.replace(/~~(.+?)~~/g,'<del>$1</del>');
  x=x.replace(/(^|[^*\w])\*([^*\n]+?)\*(?!\*)/g,'$1<em>$2</em>');
  x=x.replace(/(^|[^_\w])_([^_\n]+?)_(?![\w_])/g,'$1<em>$2</em>');
  x=x.replace(/\u0000(\d+)\u0000/g,function(_,i){return '<code>'+codes[+i]+'</code>';});
  return x;
}

function isSep(l){
  var t=l.trim();
  return t.indexOf('-')>=0&&/^[|\s:\-]+$/.test(t);
}

function splitRow(l){
  var s=l.trim();
  if(s.charAt(0)==='|')s=s.slice(1);
  if(s.charAt(s.length-1)==='|')s=s.slice(0,-1);
  return s.split('|').map(function(c){return c.trim();});
}

function renderMd(src){
  slugCounts={};
  var lines=String(src==null?'':src).replace(/\r\n?/g,'\n').split('\n'),out=[],i=0,m;
  while(i<lines.length){
    var line=lines[i];
    if(!line.trim()){i++;continue;}
    m=line.match(/^\s*```+\s*([\w+#.-]*)\s*$/);
    if(m){
      var lang=m[1],buf=[];i++;
      while(i<lines.length&&!/^\s*```+\s*$/.test(lines[i]))buf.push(lines[i++]);
      i++;
      out.push('<pre><code'+(lang?' class="language-'+esc(lang)+'"':'')+'>'+esc(buf.join('\n'))+'</code></pre>');
      continue;
    }
    if(/^\s{0,3}(-{3,}|\*{3,}|_{3,})\s*$/.test(line)){out.push('<hr>');i++;continue;}
    m=line.match(/^\s{0,3}(#{1,6})\s+(.*?)\s*#*\s*$/);
    if(m){
      var n=m[1].length,text=m[2],slug=uniqueSlug(text);
      out.push('<h'+n+' id="'+slug+'">'+inlineMd(text)+'</h'+n+'>');
      i++;continue;
    }
    if(line.indexOf('|')>=0&&i+1<lines.length&&isSep(lines[i+1])){
      var heads=splitRow(line);i+=2;var rows='';
      while(i<lines.length&&lines[i].trim()&&lines[i].indexOf('|')>=0){
        rows+='<tr>'+splitRow(lines[i]).map(function(c){return '<td>'+inlineMd(c)+'</td>';}).join('')+'</tr>';
        i++;
      }
      out.push('<table><thead><tr>'+heads.map(function(c){return '<th>'+inlineMd(c)+'</th>';}).join('')+'</tr></thead><tbody>'+rows+'</tbody></table>');
      continue;
    }
    if(/^\s{0,3}>\s?/.test(line)){
      var qb=[];
      while(i<lines.length&&/^\s{0,3}>\s?/.test(lines[i]))qb.push(lines[i++].replace(/^\s{0,3}>\s?/,''));
      out.push('<blockquote>'+renderMd(qb.join('\n'))+'</blockquote>');
      continue;
    }
    if(/^\s*([-*+]|\d+[.)])\s+/.test(line)){
      var ord=/^\s*\d+[.)]\s+/.test(line),tag=ord?'ol':'ul',items='';
      while(i<lines.length&&/^\s*([-*+]|\d+[.)])\s+/.test(lines[i])){
        var raw=lines[i++].replace(/^\s*(?:[-*+]|\d+[.)])\s+/,'');
        while(i<lines.length&&lines[i].trim()&&!/^\s*([-*+]|\d+[.)])\s+/.test(lines[i])&&!/^\s{0,3}(#{1,6}\s|```|>)/.test(lines[i]))raw+=' '+lines[i++].trim();
        var task=raw.match(/^\[([ xX])\]\s*(.*)$/);
        items+='<li>'+(task?'<input type="checkbox" disabled'+(task[1].toLowerCase()==='x'?' checked':'')+'> ':'')+inlineMd(task?task[2]:raw)+'</li>';
      }
      out.push('<'+tag+'>'+items+'</'+tag+'>');
      continue;
    }
    var pb=[line];i++;
    while(i<lines.length&&lines[i].trim()&&!/^\s{0,3}(#{1,6}\s|```|>|-{3,}|\*{3,}|_{3,})/.test(lines[i]))pb.push(lines[i++]);
    out.push('<p>'+pb.map(inlineMd).join('<br>')+'</p>');
  }
  return out.join('\n');
}

exports.sanitize=sanitize;
exports.renderMd=renderMd;
exports.esc=esc;
exports.cleanName=cleanName;
exports.uid=uid;
})(typeof exports!=='undefined'?exports:(window.EditorModule={}));

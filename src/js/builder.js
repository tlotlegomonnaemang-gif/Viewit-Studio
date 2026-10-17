(function(exports){
'use strict';

var ASSET_LIBS=[
  {id:'h1',label:'Heading 1',svg:'<text x="12" y="17" text-anchor="middle" font-size="11" font-weight="800" fill="currentColor">H1</text>'},
  {id:'h2',label:'Heading 2',svg:'<text x="12" y="17" text-anchor="middle" font-size="11" font-weight="800" fill="currentColor">H2</text>'},
  {id:'p',label:'Paragraph',svg:'<path d="M4 6h16M4 10h16M4 14h12M4 18h10"/>'},
  {id:'button',label:'Button',svg:'<rect x="3" y="8" width="18" height="8" rx="4"/><path d="M8 12h8"/>'},
  {id:'link',label:'Link',svg:'<path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/>'},
  {id:'image',label:'Image',svg:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.6"/><path d="M21 16l-5-5L5 21"/>'},
  {id:'video',label:'Video',svg:'<rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l6-3v10l-6-3z"/>'},
  {id:'section',label:'Section',svg:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18"/>'},
  {id:'columns2',label:'2 Columns',svg:'<rect x="3" y="3" width="8" height="18" rx="1.5"/><rect x="13" y="3" width="8" height="18" rx="1.5"/>'},
  {id:'columns3',label:'3 Columns',svg:'<rect x="2" y="3" width="6" height="18" rx="1.5"/><rect x="9" y="3" width="6" height="18" rx="1.5"/><rect x="16" y="3" width="6" height="18" rx="1.5"/>'},
  {id:'card',label:'Card',svg:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18"/>'},
  {id:'navbar',label:'Navbar',svg:'<rect x="3" y="3" width="18" height="6" rx="1.5"/><rect x="3" y="12" width="18" height="9" rx="1.5"/>'},
  {id:'footer',label:'Footer',svg:'<rect x="3" y="3" width="18" height="9" rx="1.5"/><rect x="3" y="15" width="18" height="6" rx="1.5"/>'},
  {id:'ul',label:'Bullet list',svg:'<circle cx="4.5" cy="6.5" r="1.3" fill="currentColor"/><circle cx="4.5" cy="12" r="1.3" fill="currentColor"/><circle cx="4.5" cy="17.5" r="1.3" fill="currentColor"/><path d="M9 6.5h11M9 12h11M9 17.5h11"/>'},
  {id:'form',label:'Form',svg:'<rect x="3" y="3" width="18" height="6" rx="1.5"/><rect x="3" y="12" width="18" height="6" rx="1.5"/>'},
  {id:'input',label:'Input',svg:'<rect x="3" y="8" width="18" height="8" rx="2"/><path d="M7 12h6"/>'},
  {id:'hr',label:'Divider',svg:'<path d="M3 12h18"/>'},
  {id:'spacer',label:'Spacer',svg:'<path d="M12 3v18M8 7l4-4 4 4M8 17l4 4 4-4"/>'},
  {id:'grid',label:'Grid',svg:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>'}
];

function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}

function parseStyleString(styleStr){
  var styles={};
  if(!styleStr)return styles;
  styleStr.split(';').forEach(function(pair){
    var idx=pair.indexOf(':');
    if(idx>0){
      var k=pair.slice(0,idx).trim();
      var v=pair.slice(idx+1).trim();
      if(k&&v)styles[k]=v;
    }
  });
  return styles;
}

function serializeTree(tree){
  function nodeHtml(n){
    var s='';
    if(n.styles&&typeof n.styles==='object'){
      Object.keys(n.styles).forEach(function(k){
        if(n.styles[k]!=='')s+=k+':'+n.styles[k]+';';
      });
    }
    var a='';
    if(n.attrs&&typeof n.attrs==='object'){
      Object.keys(n.attrs).forEach(function(k){
        a+=' '+k+'="'+esc(String(n.attrs[k]))+'"';
      });
    }
    if(s)a+=' style="'+esc(s)+'"';
    var inner=(n.text?esc(n.text):'')+(n.children&&n.children.length?n.children.map(nodeHtml).join(''):'');
    return '<'+n.tag+a+'>'+inner+'</'+n.tag+'>';
  }
  return (tree||[]).map(nodeHtml).join('\n');
}

exports.ASSET_LIBS=ASSET_LIBS;
exports.parseStyleString=parseStyleString;
exports.serializeTree=serializeTree;
})(typeof exports!=='undefined'?exports:(window.BuilderModule={}));

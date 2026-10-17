(function(exports){
'use strict';

var VI_AVATAR='https://api.dicebear.com/10.x/gaze/svg?backgroundColor=0f0f12&bodyColor=ff2e88,00e5ff,7cff00,ffe600,ff6a00,b400ff';
var VI_USER_AVATAR='https://api.dicebear.com/10.x/thumbs/svg';
var VI_AI_HISTORY=[];
var VI_AI_BUSY=false;

var VI_PROVIDERS={
  local:{name:'Local (WebLLM)',url:'',model:'',keyUrl:''},
  openai:{name:'OpenAI',url:'https://api.openai.com/v1/chat/completions',model:'gpt-4o-mini',keyUrl:'https://platform.openai.com/api-keys'},
  anthropic:{name:'Anthropic',url:'https://api.anthropic.com/v1/messages',model:'claude-3-5-sonnet-20241022',keyUrl:'https://console.anthropic.com/settings/keys',custom:'anthropic'},
  google:{name:'Google Gemini',url:'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={key}',model:'gemini-1.5-flash',keyUrl:'https://aistudio.google.com/app/apikey',custom:'google'},
  groq:{name:'Groq',url:'https://api.groq.com/openai/v1/chat/completions',model:'llama-3.3-70b-versatile',keyUrl:'https://console.groq.com/keys'},
  openrouter:{name:'OpenRouter',url:'https://openrouter.ai/api/v1/chat/completions',model:'meta-llama/llama-3.3-70b-instruct:free',keyUrl:'https://openrouter.ai/keys'},
  deepseek:{name:'DeepSeek',url:'https://api.deepseek.com/chat/completions',model:'deepseek-chat',keyUrl:'https://platform.deepseek.com/api_keys'},
  mistral:{name:'Mistral',url:'https://api.mistral.ai/v1/chat/completions',model:'mistral-small-latest',keyUrl:'https://console.mistral.ai/api-keys/'},
  custom:{name:'Custom (OpenAI-compatible)',url:'',model:'',keyUrl:''}
};

var VI_SETTINGS={};

function viLoadSettings(){
  try{VI_SETTINGS=JSON.parse(localStorage.getItem('viewit-ai-settings')||'{}');}catch(e){VI_SETTINGS={};}
  if(!Array.isArray(VI_SETTINGS.profiles))VI_SETTINGS.profiles=[];
  if(!VI_SETTINGS.activeId&&VI_SETTINGS.profiles[0])VI_SETTINGS.activeId=VI_SETTINGS.profiles[0].id;
}
viLoadSettings();

function viSaveSettings(){
  try{localStorage.setItem('viewit-ai-settings',JSON.stringify(VI_SETTINGS));}catch(e){}
}

function viActiveProfile(){
  return VI_SETTINGS.profiles.filter(function(p){return p.id===VI_SETTINGS.activeId;})[0]||null;
}

function viProviderReady(){
  var p=viActiveProfile();
  if(!p)return false;
  if(p.provider==='local')return true;
  return !!(p.key||'').trim();
}

function sanitizeApiKey(key){
  return String(key||'').trim();
}

exports.VI_PROVIDERS=VI_PROVIDERS;
exports.viLoadSettings=viLoadSettings;
exports.viSaveSettings=viSaveSettings;
exports.viActiveProfile=viActiveProfile;
exports.viProviderReady=viProviderReady;
exports.sanitizeApiKey=sanitizeApiKey;
})(typeof exports!=='undefined'?exports:(window.AiModule={}));

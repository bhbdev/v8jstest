// util.js is an example place to put some reusable helper functions. you could have many others.
//
// A few notes, tips and warnings:
// 
// This javascript code along with other code in .jsn files is executed as server-side JS.
// This is NOT nodejs. There is no window, document, or DOM objects,XHR, es modules, promises. (sorry)
// You can write plain vanilla javascript, some es6 syntax is ok.





// This is a rather custom lightweight httpresponse class that supports 
// html,json and plain-text responses, redirects, and some half-baked cookie stuff
// use at-your-own risk!

class HttpResponse {
  constructor(){
    this.headers = []
    this.httpstatus = 200
    this.params = reqparams()
  }
  header(value) {
    this.headers.push(value);
  }
  status(code) {
    this.httpstatus = code
  }
  cookie(name,value) { 
    if (arguments.length == 2) {
       this.header('Set-Cookie: ' + name + '=' + value + '; Path="/"; Domain=' + ReqEnv('SERVER_NAME')+ '; Secure; SameSite=None'); 
    } else if (arguments.length == 1) {
      return ReqCookie(name);
    }
  }
  redirect(path,code=301) {
    this.status(code);
    this.header('Status: ' + this.httpstatus);
    Emit( this.headers.join('\n') + '\n');
    Emit('Location: ' + path + '\n\n')
  }
  response(val,type='html') {
    Emit(this.headers.join('\n') + 'Status: ' + this.httpstatus + '\n');
    switch(type) {
      case 'json' : { Emit('Content-Type:application/json\n\n', JSONEncode(val)); break; }
      case 'plain': { Emit('Content-Type:text/plain\n\n', val ); break; }
      case 'html' : 
      default     : { Emit('Content-Type:text/html\n\n', val); break; }
    }
  }
  error(e,code=400) {
    this.status(code);
    this.response(e);
  }
}


// a function that returns an object of request params (get|post)
// For multi-choice params the object property will be an array
// ex:  "name=beau&choices[]=1&choices[]=2" becomes { name: 'beau', choices: [1,2] }
function reqparams() {
  let params = {}  
  ReqParamNames().sort().map(key=>{ params[key.replace('[]','')] = key.indexOf('[]')!=-1 ? ReqParam(key,'all'):ReqParam(key) })
  return params;
}



//The Curl() function is provided to all server side V8 scripts. It is used to make http, ftp and other requests. It purports to support ssh/scp/sftp but this has not been tested and is not documented here.
// There is also a CurlGet(url) function. This is a simplified version that takes a URL and returns the content. It returns undefined if it fails for any reason.
//
// The official curl documentation is here: Curl LibCurl
//
// The Curl() function takes a single parameter. This parameter can either be a string containing the URL of the request or an object containing the URL and other request options.
//
// If an object is passed in, these fields of the object will be used:
//
//     URL
//     Username - the username to use to athenticate. Note: a username may also be specified in the URL.
//     Password - the password to use to athenticate. Note: a username may also be specified in the URL.
//     UserAgent - The User Agent to use in HTTP requests
//     Referer - The Referer string to use in HTTP requests
//     RawPostData - A string to use as the data to POST.
//     PostArgs - an object containing name/value pairs to POST. It is an error to specify both RawPostData and PostArgs. The values will be URL escaped before they are sent.
//     Timeout - The max number of seconds to wait before the request is considered a timeout failure. The current default is 120. Requests made from CGI programs such as bookdaily or jsnews should shorten this. (TODO: set a shorted default in these programs.)
//     MaxRedirs - A limit of the number of redirects that will be processed. The default is 1.
//     URLArgs - an object containing name/value pairs that will be appended to the URL. The values will be URL escapes as they are appended to the URL. The first parameter delimiter will be an ampersand if the URL already contained a question mark.
//     Transcript - Request that the returned object include a Transcript member that contains a log of the request session.
//     NoCompress - By default, http requests contain headers that allow the remote server to compress the result. This boolean flag disables that behavior.
//     Trace - Write a log of the request session to the application logfile (i.e. /v8jstest/logs/v8jstest.log).
//     ActiveFTP - Use Active FTP sessions instead of Passive. Note: At this time Passive works better and is the default.
//     XML - Boolean value - request that the response body be XML parsed. On success the returned object will contain an 'XML' member that is the result of parsing the data or an XMLErrorMsg if the parsing failed. It is better to use this option rather than to manually call XMLParse on the body to avoid character set issues.
//     NoBody - This boolean option tells the program not to include the Body of the respone in the returned object. This is more efficient if the body is long and is not needed. This does not interfere with the XML option. This option does not cause the function to return without waiting for the response.
//
// Many of the options only apply to a subset of the supported protocols.
//
// The function always returns an object. The object members describe what happened. The Curl function does not throw exceptions. The returned fields include:
//
//     StatusCode - this integer is the HTTP status code of the response. It will be 0 if the request failed. It is not well defined for non-http requests.
//     ContentLength - This integer is the length of the response body. This is returned even if the NoBody option is used. This is the length of the actual response, before being auto-converted to UTF-8.
//     ContentType - This is the content type returned for HTTP requests.
//     FileTime - This is the file time returned for some protocols including HTTP.
//     Body - This is the body of the response. It is force to UTF-8 encoding. This should work well for Latin-1/ISO 8859-1/Windows1252 but will have problems with other character sets and will fail miserably on images or other binary files.
//     Transcript - If requested, this string contains a transcript of the session.
//     XML - If requested and parsing succeeds, this will contain the top node of and XMLParse of the body (even if the body was suppressed with NoBody).
//     XMLErrorMsg - If the request succeeds but a requested XMLParse failed, this will contain the XML parser error message.
//     ErrorMsg - If the request fails, this will contain the error message. Checking for the presence of this field is the best way to check of the request succeeded.
//
//
// Simple Example:
//
//  var x = Curl('http://localhost:4100/');
//  if(x.ErrorMsg)
//      throw x.ErrorMsg;
//  EMIT:x.Body
//
// More Complex Example:
//
//  var x = Curl({
//      URL:    'http://localhost:4100/getcust',
//      Trace:  true,
//      URLArgs: {
//         email:  cust.email,
//      }
//    });
//  if(x.ErrorMsg)
//      throw x.ErrorMsg;
//  
//  var json = JSONDecode(x.Body);
//

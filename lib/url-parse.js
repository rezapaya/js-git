module.exports = urlParse;

function urlParse(href) {
  var protocol, user, pass, hostname, port, pathname, search, hash;
  var match, host, path;
  // Match URL style remotes
  if (match = href.match(/^(?:(wss?:|https?:|git:|ssh:)\/\/)([^\/]+)([^:]+)$/)) {
    protocol = match[1],
    host = match[2];
    path = match[3];
    match = host.match(/^(?:([^@:]+)(?::([^@]+))?@)?([^@:]+)(?::([0-9]+))?$/);
    user = match[1];
    pass = match[2];
    hostname = match[3];
    port = match[4];
    match = path.match(/^([^?]*)(\?[^#]*)?(#.*)?$/);
    pathname = match[1];
    if (protocol === "ssh:") pathname = pathname.substr(1);
    search = match[2];
    hash = match[3];
  }
  // Match scp style ssh remotes
  else if (match = url.match(/^(?:([^@]+)@)?([^:\/]+)([:\/][^:\/][^:]+)$/)) {
    protocol = "ssh:";
    user = match[1];
    host = hostname = match[2];
    pathname = match[3];
    if (pathname[0] === ":") pathname = pathname.substr(1);
  }
  else {
    throw new Error("Uknown URL format: " + url);
  }

  if (port) port = parseInt(port, 10);
  else if (protocol === "http:" || protocol === "ws:") port = 80;
  else if (protocol === "https:" || protocol === "wss:") port = 443;
  else if (protocol === "ssh:") port = 22;
  else if (protocol === "git:") port = 9418;

  var opt = {
    href: href,
    protocol: protocol
  };
  if (user) opt.user = user;
  if (pass) opt.pass = pass;
  opt.host = host;
  opt.hostname = hostname;
  opt.port = port;
  opt.pathname = pathname;
  if (search) opt.search = search;
  if (hash) opt.hash = hash;

  return opt;
}
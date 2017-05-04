const fs = require('fs'),
    mime = require('mime'),
    path = require('path'),
    config = require('../config/config');

exports.server = function(req, res) {
    var resourcePath = config.STATIC_PATH + req.url;
    if (req.url == "/") {
        resourcePath = 'static/index.html';
    } else {
        resourcePath = path.resolve(resourcePath);
    }
    console.log(`Recurso solicitado: ${resourcePath}`.data);
    var extName = path.extname(resourcePath);

    var contentType = mime.lookup(extName);

    fs.exists(resourcePath, function(exists) {
        if (exists) {
            console.log("> El recurso existe...".info);
            fs.readFile(resourcePath, function(err, content) {
                if (err) {
                    resourcePath = 'static/500.html';
                    console.log("> Error en la lectura de recurso".error);
                    res.writeHead(500, {
                        'content-Type': 'text/html',
                    });
                    res.write(`<link rel="stylesheet" href="vendor/bootstrap/dist/css/bootstrap.css">
                        <link rel="stylesheet" href="css/site.css">`);
            res.end(`<div class="container">
                        <div class="row">                            
                            <div class="col-sm-6">
                                <div class="message-box">
                                    <h1 class="m-b-0">500</h1>
                                    <p>Lo sentimos tuvimos un error </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`, 'utf-8');
                } else {
                    console.log(`> Se despacha recurso: ${resourcePath}`.info);
                    res.writeHead(200, {
                        'content-Type': contentType,
                        'Server': 'ITGAM@0.0.1'
                    });
                    res.end(content, 'utf-8');
                }
            });
        } else {
            console.log("> El recurso solicitado no fue encontrado...".info);
            res.writeHead(404, {
                'content-Type': 'text/html',
                'server': 'ITGAM@0.0.1'
            });
            res.write('<html>')
            res.write(`<link rel="stylesheet" href="vendor/bootstrap/dist/css/bootstrap.css">
                        <link rel="stylesheet" href="css/site.css">`);
            res.end(`<div class="container">
                        <div class="row">                            
                            <div class="col-sm-6">
                                <div class="message-box">
                                    <h1 class="m-b-0">404</h1>
                                    <p>Lo sentimos no encontramos la pagina</p>
                                    <div class="buttons-con">
                                        <div class="action-link-wrap">
                                            <a href="index.html" class="btn btn-custom btn-primary waves-effect waves-light m-t-20">ir a la pagina principal</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`, 'utf-8');
        }
    });
}
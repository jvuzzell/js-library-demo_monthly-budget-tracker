var jsHelper = (function() {
var instance; 

function createInstance( window, document ) {
    
    var object = (function() {
        var methods = {};

        // Example POST method implementation:
        methods.postData = async function postData( url = '', data = {}, form = false ) {

            // Default options are marked with *
            const response = await fetch(url, {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                mode: 'no-cors', // no-cors, *cors, same-origin
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'same-origin', // include, *same-origin, omit
                headers: {
                    'Content-Type': 'application/json'
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                redirect: 'follow', // manual, *follow, error
                referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                body: JSON.stringify(data) // body data type must match "Content-Type" header
            });

            return response.json(); // parses JSON response into native JavaScript objects
            
        }
            
        methods.windowWidth = function() {
            return Math.max( window.innerWidth, window.outerWidth, document.documentElement.clientWidth );
        }
        
        methods.currentScrollPosY = function() {
            return window.pageYOffset;  
        } 

        methods.debounce = function( func, wait, immediate ) {
            var timeout;
        
            return function executedFunction() {
                var context = this;
                var args = arguments;
                    
                var later = function() {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                };
            
                var callNow = immediate && !timeout;
                
                clearTimeout(timeout);
            
                timeout = setTimeout(later, wait);
                
                if (callNow) func.apply(context, args);
            };
        }     
        
        methods.getQueryVariable = function ( variable )  {
            var query = window.location.search.substring(1);
            var vars = query.split("&");
            for (var i=0;i<vars.length;i++) {
                var pair = vars[i].split("=");
                if(pair[0] == variable){ return pair[1]; }
            }
            return(false);
        }
        
        methods.getUrlPath = function ()  {
            var query = window.location.pathname.substring(1);
            var vars = query.split("/");

            return(vars);
        }      

        methods.browserDetect = function() {
            var ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || []; 
            var browser = {
                name: 'unknown', 
                version: 'unknown'
            }

            // IE 10 or Older
            if( /MSIE/i.test( M[1] ) ){
                tem=/\brv[ :]+(\d+)/g.exec(ua) || []; 

                browser.name = 'IE'; 
                browser.version = ( tem[1] || '' ); 
            }   

            // IE 11
            if( /Trident/i.test( M[1] ) ){
                tem=/\brv[ :]+(\d+)/g.exec(ua) || []; 

                browser.name = 'IE'; 
                browser.version = ( tem[1] || '' ); 
            }   

            if( M[1] === 'Chrome' ){
                tem = ua.match( /\bOPR|Edge\/(\d+)/ ); 

                // Opera
                if( tem != null )   { 
                    browser.name = 'Opera'; 
                    browser.version = tem[1];
                }
            }   

            M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];

            if( ( tem = ua.match(/version\/(\d+)/i ) ) != null ) {
                M.splice( 1, 1, tem[1] );
            }

            // Add browser data to Body tag
            document.body.setAttribute( 'data-browser',  M[0] )
            document.body.setAttribute( 'data-browser-version', M[1] );

            // Other
            browser.name = M[0]; 
            browser.version = M[1]; 

            return browser; 

        }

        /**
         * @param {Node}    app      The element to inject markup into
         * @param {String}  template  The string to inject into the element
         * @param {Boolean} append    [optional] If true, append string to existing content instead of replacing it
         */

        methods.saferInnerHTML = function ( app, template, append ) {

            'use strict';

            //
            // Variables
            //

            var parser = null;

            //
            // Methods
            //

            var supports = function () {
                if ( !Array.from || !window.DOMParser ) return false;
                parser = parser || new DOMParser();
                try {
                    parser.parseFromString('x', 'text/html');
                } catch(err) {
                    return false;
                }
                return true;
            };

            /**
             * Add attributes to an element
             * @param {Node}  elem The element
             * @param {Array} atts The attributes to add
             */
            var addAttributes = function (elem, atts) {
                atts.forEach(function (attribute) {
                    // If the attribute is a class, use className
                    // Else if it starts with `data-`, use setAttribute()
                    // Otherwise, set is as a property of the element
                    if (attribute.att === 'class') {
                        elem.className = attribute.value;
                    } else if (attribute.att.slice(0, 5) === 'data-') {
                        elem.setAttribute(attribute.att, attribute.value || '');
                    } else {
                        elem[attribute.att] = attribute.value || '';
                    }
                });
            };

            /**
             * Create an array of the attributes on an element
             * @param  {NamedNodeMap} attributes The attributes on an element
             * @return {Array}                   The attributes on an element as an array of key/value pairs
             */
            var getAttributes = function (attributes) {
                return Array.from(attributes).map(function (attribute) {
                    return {
                        att: attribute.name,
                        value: attribute.value
                    };
                });
            };

            /**
             * Make an HTML element
             * @param  {Object} elem The element details
             * @return {Node}        The HTML element
             */
            var makeElem = function (elem) {

                // Create the element
                var node = elem.type === 'text' ? document.createTextNode(elem.content) : document.createElement(elem.type);

                // Add attributes
                addAttributes(node, elem.atts);

                // If the element has child nodes, create them
                // Otherwise, add textContent
                if (elem.children.length > 0) {
                    elem.children.forEach(function (childElem) {
                        node.appendChild(makeElem(childElem));
                    });
                } else if (elem.type !== 'text') {
                    node.textContent = elem.content;
                }

                return node;

            };

            /**
             * Render the template items to the DOM
             * @param  {Array} map A map of the items to inject into the DOM
             */
            var renderToDOM = function (map) {
                if (!append) { app.innerHTML = ''; }
                map.forEach(function (node, index) {
                    app.appendChild(makeElem(node));
                });
            };

            /**
             * Create a DOM Tree Map for an element
             * @param  {Node}   element The element to map
             * @return {Array}          A DOM tree map
             */
            var createDOMMap = function (element) {
                var map = [];
                Array.from(element.childNodes).forEach(function (node) {
                    map.push({
                        content: node.childNodes && node.childNodes.length > 0 ? null : node.textContent,
                        atts: node.nodeType === 3 ? [] : getAttributes(node.attributes),
                        type: node.nodeType === 3 ? 'text' : node.tagName.toLowerCase(),
                        children: createDOMMap(node)
                    });
                });
                return map;
            };

            /**
            * Convert a template string into HTML DOM nodes
            * @param  {String} str The template string
            * @return {Node}       The template HTML
            */
            var stringToHTML = function (str) {
                parser = parser || new DOMParser();
                var doc = parser.parseFromString(str, 'text/html');
                return doc.body;
            };


            //
            // Inits
            //

            // Don't run if there's no element to inject into
            if (!app) throw new Error('safeInnerHTML: Please provide a valid element to inject content into');

            // Check for browser support
            if (!supports()) throw new Error('safeInnerHTML: Your browser is not supported.');

            // Render the template into the DOM
            renderToDOM(createDOMMap(stringToHTML(template)));

        };

        return methods;

    })();
    
    return object;     
}

return {
    getInstance: function() {
        if( !instance ) {
            instance = createInstance( window, document );
        }
        return instance; 
    }
}

})( 
    window, 
    document
);

export var JsHelper = jsHelper.getInstance();

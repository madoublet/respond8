const fs = require('fs'),
      fse = require('fs-extra'),
      handlebars = require('handlebars'),
      cheerio = require('cheerio')

/**
  * Common application functions
  */
module.exports = {

    /**
     * Creates a unique id
     * @param {String} length - the length of the id to make
     */
    makeid: function(length) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      
        for (var i = 0; i < length; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));
      
        return text;
    },

    /**
     * Replace all occurences of a string in a string
     * @param {String} str - the starting string
     * @param {String} search - the search string
     * @param {String} replacement - the string to replace
     */
    replaceAll: function(str, search, replacement) {
        return str.replace(new RegExp(search, 'g'), replacement);
    },
    
    /**
     * Finds a user
     * @param {String} email
     */
    findUser: function(email) {

      try{
        let json = fs.readFileSync(`${global.appRoot}/data/site.json`, 'utf8'),
            obj = JSON.parse(json)

        for(let x=0; x<obj.users.length; x++) {
          if(obj.users[x].email == email) return obj.users[x]
        }

      }
      catch(e) {
        return null
      }

    },

    /**
     * Retrieves pages
     * @param {String} email
     */
    retrievePages: function() {

      let json = fs.readFileSync(`${global.appRoot}/site/data/pages.json`, 'utf8')

      return JSON.parse(json)

    },

    /**
     * Publishes a page
     * @param {String} email
     */
    publishPage: function(settings) {

      let newPage = true,
          html = '',
          content = '',
          $ = null,
          parts = settings.url.split('/'),
          base = '',
          currentPage = null

      // setup the base
      if(parts.length > 1) {
          for(let x=1; x<parts.length; x++) {
              base += '../';
          }
      }

      // get json
      let json = fs.readFileSync(`${global.appRoot}/site/data/pages.json`, 'utf8')

      // read json
      let pages = JSON.parse(json)

      // check to see if page exists
      for(let x=0; x<pages.length; x++) {
          if(pages[x].url == settings.url) {
              newPage = false
              pages[x] = settings
              currentPage = settings
          }
      }

      if(newPage == true) {

        currentPage = settings
        
        // add page
        pages.push(settings)

        // get default content from layouts 
        content = fs.readFileSync(`${global.appRoot}/site/layouts/${settings.type}.html`, 'utf8')
      }
      else {

        // get content from existing page
        let temp = fs.readFileSync(`${global.appRoot}/site/${settings.url}`, 'utf8'),
            $ = cheerio.load(temp)

        // get content
        content = $('[role="main"]').html()
      }

      // retrieve template
      html = fs.readFileSync(`${global.appRoot}/site/templates/${settings.template}.html`, 'utf8')

      // replace all meta data
      html = html.replace(/{{page.content}}/g, content)
      html = html.replace(/{{page.title}}/g, settings.name)
      html = html.replace(/{{page.name}}/g, settings.name)
      html = html.replace(/{{page.url}}/g, settings.url)
      html = html.replace(/{{page.description}}/g, settings.description)
      html = html.replace(/{{page.keywords}}/g, settings.keywords)
      html = html.replace(/{{page.tags}}/g, settings.tags)
      html = html.replace(/{{page.image}}/g, settings.image)
      html = html.replace(/{{page.location}}/g, settings.location)
      html = html.replace(/{{page.language}}/g, settings.language)
      html = html.replace(/{{page.direction}}/g, settings.direction)
      html = html.replace(/{{page.firstName}}/g, settings.firstName)
      html = html.replace(/{{page.lastName}}/g, settings.lastName)
      html = html.replace(/{{page.lastModifiedBy}}/g, settings.firstName + ' ' + settings.lastName)
      html = html.replace(/{{page.lastModifiedDate}}/g, (new Date()).toUTCString())
      html = html.replace(/{{page.customHeader}}/g, '')
      html = html.replace(/{{page.customFooter}}/g, '')
      html = html.replace(/{{version}}/g, Date.now())

      // load into $
      $ = cheerio.load(html);

      // set base value
      $('base').attr('href', base);

      console.log('[app] before components')

      // find site components
      $('[site-component]').each(function(i, element) {

        // get component type
        let type = $(element).attr('site-component')

        console.log('[app] found component type=' + type)

        try{
          let component = fs.readFileSync(`${global.appRoot}/site/components/${type}.html`, 'utf8')

          // sort pages by date modified
          pages.sort(function(a, b) {
              a = new Date(a.lastModifiedDate);
              b = new Date(b.lastModifiedDate);
              return a>b ? -1 : a<b ? 1 : 0;
          });

          // data to load into handlebars
          let data = {
              'hello': 'hello from handlebars',
              'attributes': element.attribs,
              'pages': pages,
              'currentPage': currentPage
          }

          // get component content
          let c = '';
                                                    
          try {

              handlebars.registerHelper('startsWith', function(prefix, str, options) {
                  var args = [].slice.call(arguments)
                  options = args.pop()
                  
                  str = str.toString()
                  
                  if (str.indexOf(prefix) === 0) {
                    return options.fn(this)
                  }
                  if (typeof options.inverse === 'function') {
                    return options.inverse(this)
                  }
                  return ''
              });

              handlebars.registerHelper('is', function(a, b, options) {
                  return (a == b) ? options.fn(this) : options.inverse(this)
              });

              let template = handlebars.compile(component)
              c = template(data)
          }
          catch(e) {
            c = 'Component template failed to compile.'
            console.log('[error]', e)
          }

          $(element).html(c)

        }
        catch(e) {
          console.log('[app] could not find component')
          console.log('[error]', e)
        }

      })
      // end $('[site-component]').each
      
      // save content
      html = $.html()

      // get directory
      let dir = settings.url.substring(0, settings.url.lastIndexOf("/")+1)

      console.log('[debug] directory', `${global.appRoot}/site/${dir}`)

      // make sure it exists
      fse.ensureDirSync(`${global.appRoot}/site/${dir}`)

      console.log('[debug] file', `${global.appRoot}/site/${settings.url}`)

      // save html file
      fs.writeFileSync(`${global.appRoot}/site/${settings.url}`, html, 'utf8')

      // save json file
      fs.writeFileSync(`${global.appRoot}/site/data/pages.json`, JSON.stringify(pages), 'utf8')

    }

    
};
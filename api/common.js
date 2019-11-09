const fs = require('fs')

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

    }
    
};
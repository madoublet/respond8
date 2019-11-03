// ref: https://raw.githubusercontent.com/madoublet/prebuilt-cart-expressjs/master/api/common.js?token=AAMMOPEKL7KQWW7MHU64WCC5XXU5C

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
    }
    
};
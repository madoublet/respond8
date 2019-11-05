/*
 * Model for the Edit page
 */
class Edit {

    frame = document.querySelector('#edit-frame')
    page = '/index.html'
    viewPage = document.querySelector('#view-page')
    viewMobile = document.querySelector('#view-mobile')
    viewSettings = document.querySelector('#view-settings')
    publish = document.querySelector('#publish')

    /*
     * Initializes the model
     */
    constructor() {
        const params = new URLSearchParams(window.location.search)
        
        this.page = params.get('page') || '/index.html'

        if(this.page != '') {
            this.frame.src = `${this.page}?edit=true`
        }

        this.setupEvents()
    }

    /*
     * Setup the events for the page
     */
    setupEvents() {

        let context = this;

        this.viewPage.setAttribute('href', this.page)
        this.viewPage.setAttribute('target', '_blank')

        // listen for messages
        window.addEventListener('message', message => {
           console.log('received', message)
        })

        // view mobile
        this.viewMobile.addEventListener('click', function(e) {

            if(context.viewMobile.hasAttribute('active')) {
                context.viewMobile.removeAttribute('active')
                context.frame.removeAttribute('mobile')
            }
            else {
                context.viewMobile.setAttribute('active', '')
                context.frame.setAttribute('mobile', '')
            }

        })

        // publish
        this.publish.addEventListener('click', function(e) {
            context.frame.contentWindow.postMessage({'command': 'save'}, '*'); 
        })
    }
}

new Edit()
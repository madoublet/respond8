/*
 * Model for the Edit page
 */
class Edit {

    /*
     * Initializes the model
     */
    constructor() {

        this.frame = document.querySelector('#edit-frame')
        this. page = '/index.html'
        this.viewPage = document.querySelector('#view-page')
        this.viewMobile = document.querySelector('#view-mobile')
        this.viewSettings = document.querySelector('#view-settings')
        this.publish = document.querySelector('#publish')
        this.modalSelectBlock = document.querySelector('#modal-select-block')

        const params = new URLSearchParams(window.location.search)
        
        this.page = params.get('page') || '/index.html'

        if(this.page != '') {
            this.frame.src = `${this.page}?edit=true`
        }

        this.setupEvents()
        this.setupFrameListener()
    }

    /*
     * Setup the events for the page
     */
    setupEvents() {

        let context = this;

        this.viewPage.setAttribute('href', this.page)
        this.viewPage.setAttribute('target', '_blank')

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

    /*
     * Setup frame listener
     */
    setupFrameListener() {
        window.addEventListener('message', message => {

            console.log(message)

            if(message.data) {
                if(message.data.command == 'save') {
                    this.save(message.data.data)
                }

                // dispatch show event
                if(message.data.command == 'show') {
                    window.dispatchEvent(new CustomEvent('editor.show', {detail: message.data}))
                }
                else if(message.data.type && message.data.properties) {
                    window.dispatchEvent(new CustomEvent('editor.event', {detail: message.data}))
                }
            }
         })
    }

    /*
     * Save HTML
     */
    save(html) {

        // set data
        let data = {
            html: html,
            page: this.page
        }

        // post form
        var xhr = new XMLHttpRequest()
        xhr.open('POST', '/api/page/save', true)
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.send(JSON.stringify(data))

        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 400) {
                app.toast.show('success', 'Saved!', true)
                location.reload()
            }
            else {
                app.toast.show('failure', 'There was an error saving the file', true)
            }
        }
    }
}

new Edit()
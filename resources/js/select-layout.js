/*
 * Model for the Edit page
 */
class SelectLayout {

    /*
     * Initializes the model
     */
    constructor() {

        this.version = 2
        this.buttonAddLayout = document.querySelector('#button-add-layout')
        this.modalSelectLayout = document.querySelector('#modal-select-layout')
        this.modalSelectLayoutFrame = document.querySelector('#modal-select-layout-frame')
        this.modalSelectLayoutClose = document.querySelector('#modal-select-layout-close')
        this.selectLayoutUrl = '/select/index.html'

        this.setupEvents()
        this.setupFrameListener()
    }

    /*
     * Setup the events for the page
     */
    setupEvents() {

        let context = this;

        // handle select layout
        this.buttonAddLayout.addEventListener('click', function(e) {
            context.modalSelectLayout.setAttribute('active', '');
            context.modalSelectLayoutFrame.src = `${context.selectLayoutUrl}?&version=${context.version}`;
        })

        this.modalSelectLayoutClose.addEventListener('click', function(e) {
            context.modalSelectLayout.removeAttribute('active');
        })
    }

    /*
     * Setup frame listener
     */
    setupFrameListener() {

        let context = this

        window.addEventListener('message', message => {
            if(message.data) {
                if(message.data.command == 'add-block') {
                    editor.sendAdd({type: 'add', html: message.data.data, isLayout: true, insertAfter: true})
                    context.modalSelectLayout.removeAttribute('active');
                }
            }
        }) 

    }
    

}

new SelectLayout()
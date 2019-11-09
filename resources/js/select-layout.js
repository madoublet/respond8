/*
 * Model for the Edit page
 */
class SelectLayout {

    version = 2
    buttonAddLayout = document.querySelector('#button-add-layout')
    modalSelectLayout = document.querySelector('#modal-select-layout')
    modalSelectLayoutFrame = document.querySelector('#modal-select-layout-frame')
    modalSelectLayoutClose = document.querySelector('#modal-select-layout-close')
    selectLayoutUrl = '/select/index.html'

    /*
     * Initializes the model
     */
    constructor() {
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
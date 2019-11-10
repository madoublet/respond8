/*
 * Models the content slider
 */
class ContentSlider {

    /*
     * Initializes the model
     */
    constructor() {

        this.viewContent = document.querySelector('#view-content')
        this.contentSlideInModal = document.querySelector('#content-slide-in-modal')

        this.setupEvents()
    }

    /*
     * Setup events
     */
    setupEvents() {
        var context = this

        this.viewContent.addEventListener('click', function(e) { 
            context.toggleSlider()
        })

        this.contentSlideInModal.addEventListener('click', function(e) {
            if(e.target.nodeName.toUpperCase() == 'SECTION') {
                context.toggleSlider()
            }
        })
    }

    /*
     * Toggles the slide-in modal
     */
    toggleSlider() {
        if(this.contentSlideInModal.hasAttribute('active')) {
           this.contentSlideInModal.removeAttribute('active')     
        }
        else {
            this.contentSlideInModal.setAttribute('active', '')
        }
    }
}

new ContentSlider()
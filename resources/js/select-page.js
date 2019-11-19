/*
 * Models the select page modal
 */
class SelectPageModal {

    /*
     * Initializes the model
     */
    constructor() {

        // setup view
        this.view = `<section id="select-page-modal" class="app-modal app-modal-priority">
        <div class="app-modal-container">
        
            <a class="app-modal-close" toggle-select-page-modal>
              <svg width="100%" height="100%" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"><g><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></g></svg>
            </a>

            <h2>Select Page</h2>
        
            <div class="app-modal-list"></div>

        </div>
        </section>`

        this.properties = {}
        this.attributes = {}
        this.target = null

        // append view to DOM
        document.body.insertAdjacentHTML('beforeend', this.view)

        // setup private variables
        this.modal = document.querySelector('#select-page-modal')

        // fill list
        this.fillList()

        // handle events
        this.setupEvents()
    }

    /*
     * Setup events
     */
    fillList() {

        let data = {},
              context = this

        // post form
        var xhr = new XMLHttpRequest()
        xhr.open('GET', '/api/page/list', true)
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.send(JSON.stringify(data))

        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 400) {
                let json = JSON.parse(xhr.responseText)

                json.forEach(i => {

                    let item = document.createElement('a')
                    item.setAttribute('class', 'app-modal-list-item')
                    item.setAttribute('data-url', i.url)

                    item.innerHTML += `<h3>${i.name}</h3>
                                <p>${i.url}</p>
                                <i class="material-icons">arrow_forward</i>`

                    context.modal.querySelector('.app-modal-list').appendChild(item)

                    // handle click of list item
                    item.addEventListener('click', function(e) {
                      if(context.target) {
                        document.querySelector(context.target).value = e.target.getAttribute('data-url')
                      }
                      context.toggleModal()
                    })
                });

                
            }
            else {
                alert('retrieve error')
            }
        }
        // end xhr

    }

    /*
     * Setup events
     */
    setupEvents() {
        var context = this

        // handle toggles
        var toggles = document.querySelectorAll('[toggle-select-page-modal]');

        for(let x=0; x<toggles.length; x++) {
            toggles[x].addEventListener('click', function(e) { 
                context.toggleModal()
            })
        }

        // listen for event to show modal
        window.addEventListener('app.selectPage', data => {
          console.log('[app.selectPage] detail', data.detail)
          context.target = data.detail.target || null
          context.toggleModal()
        })
    }

    /*
     * Toggles the slide-in modal
     */
    toggleModal() {
        if(this.modal.hasAttribute('active')) {
           this.modal.removeAttribute('active')     
        }
        else {
            this.modal.setAttribute('active', '')
        }
    }

}

let selectPageModal = new SelectPageModal()
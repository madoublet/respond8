/*
 * Models the edit form modal
 */
export class EditFormModal {

    /*
     * Initializes the model
     */
    constructor() {

        // setup view
        this.view = `<section id="edit-form-modal" class="app-modal app-modal-priority">
        <div class="app-modal-container">
        
            <a class="app-modal-close" toggle-edit-form-modal>
              <svg width="100%" height="100%" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"><g><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></g></svg>
            </a>

            <h2>Form Fields</h2>
        
            <div class="app-modal-list"></div>

            <button id="button-add-form-field" class="circle-button">
                <i class="material-icons">add</i>
            </button>

        </div>
        </section>`

        this.properties = {}
        this.attributes = {}
        this.settings = {}
        this.fields = []
        this.target = null

        // append view to DOM
        document.body.insertAdjacentHTML('beforeend', this.view)

        // setup private variables
        this.modal = document.querySelector('#edit-form-modal')

        // handle events
        this.setupEvents()
    }

    /*
     * Move item in array
     */
    move(from, to) {

        if (to >= this.fields.length) {
            var k = from - this.fields.length + 1;
            while (k--) {
                this.fields.push(undefined);
            }
        }
        this.fields.splice(from, 0, this.fields.splice(to, 1)[0]);
    }

    /*
     * Build HTML from fields
     */
    buildHTML() {

        let html = '';

        for(let x=0; x < this.fields.length; x++) {

            let field = '', id = '', cssClass = '', options = '';

            // create an id from the label
            id = this.fields[x].label.toLowerCase().replace(/[^a-zA-Z ]/g, "");
            id = id.trim();
            id = id.replace(/\s+/g, '-');

            // setup the css clss
            this.fields[x].cssClass = this.fields[x].cssClass.replace(/form-group/g, '').trim();
            
            if(this.fields[x].cssClass != '') {
                cssClass = ' ' + cssClass;
            }

            // build field
            if(this.fields[x].type == 'select') {

                // build options
                for(let y=0; y <this.fields[x].options.length; y++) {
                options += `<option value="${this.fields[x].options[y].value}">${this.fields[x].options[y].text}</option>`;
                }

                field = `<div class="form-group${cssClass}">
                            <label>${this.fields[x].label}</label>
                            <select name="${id}">${options}</select>
                            <small>${this.fields[x].helperText}</small>
                            </div>`;

            }
            else if(this.fields[x].type == 'checkbox-list') {

                // build options
                for(let y=0; y <this.fields[x].options.length; y++) {
                options += `<label><input name="${id}" value="${this.fields[x].options[y].value}" data-text="${this.fields[x].options[y].text}" type="checkbox">${this.fields[x].options[y].text}</label>`;
                }

                field = `<div class="form-group${cssClass}">
                            <label>${this.fields[x].label}</label>
                            <div class="checkbox-list">${options}</div>
                            <small>${this.fields[x].helperText}</small>
                            </div>`;

            }
            else if(this.fields[x].type == 'textarea') {

                field = `<div class="form-group${cssClass}">
                            <label>${this.fields[x].label}</label>
                            <textarea name="${id}"></textarea>
                            <small>${this.fields[x].helperText}</small>
                            </div>`;

            }
            else {

                field = `<div class="form-group${cssClass}">
                            <label>${this.fields[x].label}</label>
                            <input name="${id}" type="${this.fields[x].type}" placeholder="${this.fields[x].placeholder}">
                            <small>${this.fields[x].helperText}</small>
                            </div>`;

            }

            html += field;

        }

        // add inputs
        html += `<input type="submit" class="button" value="${this.settings.buttonLabel}">
                <input type="hidden" class="success-message" value="${this.settings.successMessage}">
                <input type="hidden" class="error-message" value="${this.settings.errorMessage}">
                <input type="hidden" class="destination" value="${this.settings.destination}">`;

        return html;

    }

    /*
     * Update the HTML
     */
    update() {
        let html = this.buildHTML()
        shared.sendUpdate({type: 'element', properties: {html: html}})
    }

    /*
     * Setup events
     */
    fillList() {

        let context = this,
            list = context.modal.querySelector('.app-modal-list')

        // clear fields
        this.fields = []

        console.log(this.properties.html)

        // parse HTML
        this.parseHTML(this.properties.html)

        // update the list
        this.updateList()

    }

    /*
     * Update the list
     */
    updateList() {

      let context = this,
            list = context.modal.querySelector('.app-modal-list'),
            x = 0

      console.log('updateList', this.fields)

      list.innerHTML = ''

      // bind array to html
      this.fields.forEach(i => {

          let item = document.createElement('a')
          item.setAttribute('class', 'app-modal-sortable-item')
          item.setAttribute('data-index', x)

          item.innerHTML += `<i class="drag-handle material-icons">drag_handle</i>
                      <h3>${i.label}</h3>
                      <p>${i.type}</p>
                      <i class="arrow material-icons">arrow_forward</i>`

          list.appendChild(item)

          // handle click of list item
          item.addEventListener('click', function(e) {

              if(!e.target.classList.contains('drag-handle')) {

                // get clicked index
                let index = parseInt(e.target.getAttribute('data-index'))

                // edit field
                window.dispatchEvent(new CustomEvent('app.editField', {detail: {field: context.fields[index], index: index}}))

              }

          })
          
          x++

      });

      // make list sortable
      Sortable.create(list, {
          handle: '.drag-handle',
          onEnd: function (e) {
              context.move(e.oldIndex, e.newIndex)
              context.update()
              context.updateList()
          },

      })

    }

    /*
     * Setup events
     */
    setupEvents() {
        var context = this

        // handle toggles
        var toggles = document.querySelectorAll('[toggle-edit-form-modal]');

        for(let x=0; x<toggles.length; x++) {
            toggles[x].addEventListener('click', function(e) { 
                context.toggleModal()
            })
        }

        // listen for the editor event to show modal
        window.addEventListener('app.updateField', data => {

          // update field
          context.fields[data.detail.index] = data.detail.field

          // update
          context.update()
          context.updateList()
          
        })

        // listen for event to show modal
        window.addEventListener('editor.event', data => {

            console.log('[edit.form] detail', data.detail)
  
            if(data.detail.type == 'widget' && data.detail.widget == 'form') {
              context.properties = data.detail.properties
              context.fillList()
              context.toggleModal()
            }
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

    /**
   * Parses the HTML into usable form fields
   * <div class="form-group">
   *  <label>Sample</label>
   *  <input type="text">
   *  <small>Helper Text</small>
   * </div>
   *  <input type="submit" class="button" value="Get in touch">
   *  <input type="hidden" class="success-message" value="">
   *  <input type="hidden" class="error-message" value="">
   *  <input type="hidden" class="destination" value="">
   */
  parseHTML(html) {

    let parser = new DOMParser();
    let doc = parser.parseFromString(html, 'text/html');
    let el = null;

    // get submit
    el = doc.querySelector('input[type=submit]');

    if(el) {
      this.settings.buttonLabel = el.getAttribute('value');
    }

    // get success message
    el = doc.querySelector('.success-message');

    if(el) {
      this.settings.successMessage = el.getAttribute('value');
    }

    // get error message
    el = doc.querySelector('.error-message');

    if(el) {
      this.settings.errorMessage = el.getAttribute('value');
    }

    // get destination
    el = doc.querySelector('.destination');

    if(el) {
      this.settings.destination = el.getAttribute('value');
    }

    // get form groups
    let groups = doc.querySelectorAll('.form-group');

    for(let x=0; x<groups.length; x++) {

      let type = '', required = false, placeholder = '', options = [], helperText = '';

      // get label & inputs
      let label = groups[x].querySelector('label');
      let input = groups[x].querySelector('input');
      let textarea = groups[x].querySelector('textarea');
      let select = groups[x].querySelector('select');
      let checkboxlist = groups[x].querySelector('.checkbox-list');
      let small = groups[x].querySelector('small');

      // get helpertext
      if(small) {
        helperText = small.innerHTML;
      }
      
      // handle input
      if(input) {
        type = input.getAttribute('type') || 'text';
        placeholder = input.getAttribute('placeholder') || '';
        
        if(input.hasAttribute('required')) {
          required = true;
        }
      }

      // handle textarea
      if(textarea) {
        type = 'textarea';
        
        if(textarea.hasAttribute('required')) {
          required = true;
        }
      }

      // handle select
      if(select) {
        type = 'select';
        
        for(let y=0; y < select.options.length; y++) {
          options.push({
            text: select.options[y].text,
            value: select.options[y].value
          })
        }

        if(select.hasAttribute('required')) {
          required = true;
        }
      }

      // handle checkbox list
      if(checkboxlist) {
        type = 'checkbox-list';

        let items = checkboxlist.querySelectorAll('input[type=checkbox]');
        
        for(let y=0; y < items.length; y++) {
          options.push({
            text: items[y].getAttribute('data-text'),
            value: items[y].getAttribute('value')
          })
        }

      }

      // create id
      let id = label.innerText.toLowerCase().replace(/ /g, '-');
      id = id.replace(/[^a-zA-Z ]/g, "");

      // get fields
      let field = {
        id: id,
        label: label.innerHTML,
        type: type,
        required: required,
        options: options,
        helperText: helperText,
        placeholder: placeholder,
        cssClass: groups[x].className
      };

      // push fields
      this.fields.push(field);

    }

  }

}

function recurseChildren(element) {
    const leaf = {"formName": element.getAttribute('data-nested'), "formFields": []} //the form on this level of nested data, which has a name and list of key/value pairs
    const children = [] //the html elements with data-nested inside this one

    Array.from(element.children).forEach(child => {
        if (child.getAttribute('data-nested')) {
            children.push(recurseChildren(child));
        } else if (child.name) {
            if (child.tagName === 'SELECT') {
                    const selectedValues = Array.from(child.selectedOptions).map(option => option.value);
                    if (selectedValues.length > 0) {
                        leaf["formFields"].push({ [child.name]: selectedValues });
                    }
                } else {
                    leaf["formFields"].push({ [child.name]: child.value });
            }
        } else {
           // console.log("normal element");
            //this element could be div, p, whatever, but user hasn't defined it as nested fieldset
            //as there is no data-nested attribute
            //so all its child inputs and fieldsets are on the same level of nested data
            //so we merge its inputs with this node's inputs
            //ignoring formName as they don't have a data-nested, they're still under this node's data-nested
            //and merge its children with this node's children
            const childInputsAndFieldsets = recurseChildren(child)
            childInputsAndFieldsets["leaf"]["formFields"].forEach(input => leaf["formFields"].push(input))
            childInputsAndFieldsets["children"].forEach(child => children.push(child))
        }
    });

   // console.log("return", { inputFields, children })
    return { "leaf": leaf, "children": children }
}

  (function() {
  let api
  htmx.defineExtension('json-data-nested', {
    init: function(apiRef) {
      api = apiRef
    },

    onEvent: function(name, evt) {
      if (name === 'htmx:configRequest') {
        evt.detail.headers['Content-Type'] = 'application/json'
      }
    },

    encodeParameters: function(xhr, parameters, elt) {
      xhr.overrideMimeType('text/json')
//      console.log("start with", elt)

      const nestedFormData = recurseChildren(elt)
      
      //maybe django specific: set csrf, ignore first level of form
      if(nestedFormData['leaf']['formFields'][0])
      {
		  if(nestedFormData['leaf']['formFields'][0]['csrfmiddlewaretoken'])
		  {
			xhr.setRequestHeader("X-CSRFToken", nestedFormData['leaf']['formFields'][0]['csrfmiddlewaretoken']);
			return (JSON.stringify(nestedFormData['children'][0]))
		  }
      }

      return (JSON.stringify(nestedFormData))
    }
  })
})()

This extension allows you to submit nested data from a form. Each element with a data-nested attribute will be treated as a layer of nested data.

This is useful when you have object A, many object B with foreign key on A, many object C with a foreign key on one of the object Bs, and so on. As opposed to keeping track of relationships by managing the name attribute for each field, adding data-

## Install

```html
<script src="TODO"></script>
```

## Usage

1. Set `hx-ext="nested-form""` attribute on `<form>`
2. On each level of nested data set `data-nested="myExampleObject"`

## Example Form

This has a lot removed to show a simple example, but still has Django templating specific loops and forms, to show how OneToMany relationships work with data-nested

```html

<form hx-post="/allergy/1" hx-ext="nested-form">
    <div data-nested="allergy">
        
        {{ allergyFormAndChildren.allergy_form.as_p }}
 
        {% for note in allergyFormAndChildren.note_list %}
            <div data-nested="note">
                {{note.note_form.as_p}}
            </div>
        {% endfor %}

        {% for reaction in allergyFormAndChildren.reaction_list %}
            <div data-nested="reaction">

                {{reaction.reaction_form.as_p}}

                {% for reactionNote in reaction.reactionNote_list %}
                    <div data-nested="reactionNote">
                        {{ reactionNote.reactionNote_form.as_p }}
                    </div>
                {% endfor %}

                {% for manifestation in reaction.manifestation_list %}
                    <div data-nested="manifestation">
                        {{ manifestation.manifestation_form.as_p }}
                    </div>
                {% endfor %}

            </div>
        {% endfor %} 

        <input type="submit" value="Save Allergy">
    </div>
</form>

```

## Example Repo

The above example has a lot removed to provide a simple example. See LINK for 

### Notes and limitations

* Currently made very specifically for my Django case - the approach seems good in general, but probably needs to be implemented right for other cases
* May be more efficient approaches than parsing whole form on every submit
* Haven't tested all input types, doesn't support files
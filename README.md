This extension allows you to submit nested data from a form. Each element with a data-nested attribute will be treated as a layer of nested data.

This is useful when you have object A, many object B with foreign key on A, many object C with a foreign key on one of the object Bs, and so on. As opposed to keeping track of relationships by managing the name attribute for each field, adding data-

## Install

```html
<script src="https://unpkg.com/htmx-ext-multi-swap@2.0.0/multi-swap.js"></script>
```

## Usage

1. Set `hx-ext="nested-form""` attribute on `<form>`
2. On each level of nested data set `data-nested="myExampleObject"`, e.g. `hx-swap="multi:#id1,#id2:outerHTML,#id3:afterend"`.

## Example Form

```html

<form hx-post="/allergy/1" hx-ext="nested-form">
    {% csrf_token %}
    <fieldset data-fieldsetType="allergy">
        <legend>Allergy</legend>
        
        {{ allergyFormAndChildren.allergy_form.as_p }}
 
        {% for note in allergyFormAndChildren.note_list %}
            <fieldset data-fieldsetType="note">
                <legend>Note</legend>
                {{note.note_form.as_p}}
            </fieldset>
        {% endfor %}

        {% for reaction in allergyFormAndChildren.reaction_list %}
            <fieldset data-fieldsetType="reaction">
                <legend>Reaction</legend>

                {{reaction.reaction_form.as_p}}

                {% for reactionNote in reaction.reactionNote_list %}
                    <fieldset data-fieldsetType="reactionNote">
                        <legend>Reaction Note</legend>
                        {{ reactionNote.reactionNote_form.as_p }}
                    </fieldset>
                {% endfor %}

                {% for manifestation in reaction.manifestation_list %}
                    <fieldset data-fieldsetType="manifestation">
                        <legend>Manifestation</legend>
                        {{ manifestation.manifestation_form.as_p }}
                    </fieldset>
                {% endfor %}
            </fieldset>

        {% endfor %} 

        <input type="submit" value="Save Allergy">
    </fieldset>
</form>

```

## Example Repo

The above example has a lot removed to provide a simple example. See LINK for 

### Notes and limitations

* Currently made very specifically for my Django case - the approach seems good in general, but probably needs to be implemented right for other cases
* May be more efficient approaches than parsing whole form on every submit
* Haven't tested all input types, doesn't support files
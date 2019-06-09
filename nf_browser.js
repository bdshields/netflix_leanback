/*
var boxes = document.getElementsByClassName('title-card');
for (var i = 0, l = boxes.length; i < l; i++)
{
    boxes[i].className = "title-card is-focused";
}
*/

document.addEventListener('keyup', doKeyPress, false);
window.addEventListener('keydown', eat_key, false);
window.addEventListener('keypress', eat_key, false);

window.addEventListener('load', onload, false);

function onload()
{
    select_item(get_selection());
}



function eat_key(e)
{
    if (e.keyCode ==  39)
    {
        e.preventDefault();
    }
    else if (e.keyCode ==  9)
    {
        /* Tab Key */
        e.preventDefault();
    }
    else if (e.keyCode ==  37)
    {
        e.preventDefault();
    }
    else if(e.keyCode == 38)
    {
        e.preventDefault();
    }
    else if(e.keyCode == 40)
    {
        e.preventDefault();
    }
    else if(e.keyCode == 13)
    {
        e.preventDefault();
    }
    else if(e.keyCode == 33)
    {
        e.preventDefault();
    }
    else if(e.keyCode == 34)
    {
        e.preventDefault();
    }
    else if(e.keyCode == 32)
    {
        /* space */
        e.preventDefault();
    }
    
}

function urlparam(param, value) {
    var n = value;
    var val = document.URL;
    var offset = val.indexOf(param);
    if(offset > 0 )
    {
        var url = val.substr(offset);
        n=parseInt(url.replace(param+"=",""));
    }
    return n;
}

function get_loc()
{
    var col = urlparam("jbp",0);
    var row = urlparam("jbr",0);
    return {col: col, row: row};
}

function get_parent(elem, selector) 
{
	for ( ; elem && elem !== document; elem = elem.parentNode ) {
		if ( elem.matches( selector ) ) return elem;
	}
	return null;
};

function get_sibling(element, p_selector, s_selector)
{
    return get_parent(element, p_selector).querySelectorAll(s_selector);
}

function get_selectable_child(element)
{
    var tabs = element.querySelectorAll('[tabindex="0"]');
    return tabs[0];
}

function get_relative_pos(pos)
{
    // Get our title
    var cur_title = document.getElementById("title-card-"+pos.row+"-"+pos.col);
    // find the selectable element
    var cur_sel = cur_title.querySelectorAll('[tabindex="0"]');
    // get the parent for this row
    var parent = get_parent(cur_title,".slider-mask");
    // Get all selectable elements
    var selectable = parent.querySelectorAll('[tabindex="0"]');
    var i;
    for(i=0; i<selectable.length; i++)
    {
        if(selectable[i] == cur_sel[0])
        {
            return i
        }
    }
    return 1;
}

 /**
  * Select an item without jumping to a url
  */
function select_item(element)
{
    if(element.className.indexOf("playLink") != -1)
    {
        // Trailers
        // Episodes
        // more like this
        element.focus();
        if(element.hasAttribute('tabIndex'))
        {
            element.tabIndex = 1;
        }
        else
        {
            element.tabIndex = 2;
        }
        return;
    }
    else if(element.className.indexOf("mylist-button") != -1)
    {
        // 'Add to my list' selector of 'more like this'
        element.focus();
        if(element.hasAttribute('tabIndex'))
        {
            element.tabIndex = 1;
        }
        else
        {
            element.tabIndex = 2;
        }
        return;
    }
    else if(element.className.indexOf("slider-refocus") != -1)
    {
        // main title cards
        element.focus();
        element.click();
        if(element.hasAttribute('tabIndex'))
        {
            element.tabIndex = 1;
        }
        else
        {
            element.tabIndex = 2;
        }
        return;
    }
    else if(('href' in element))
    {
        if((element.href.indexOf("/watch/") != -1)&&(element.href.indexOf("trackid") == -1))
        {
            // main title cards
            element.focus();
            element.click();
            if(element.hasAttribute('tabIndex'))
            {
                element.tabIndex = 1;
            }
            else
            {
                element.tabIndex = 2;
            }
            return;
        }
    }
    
    if(element.tagName == "BUTTON")
    {
        element.focus();
    }
    else
    {
        // fallback method
        element.focus();
        if('href' in element === false)
        {
            element.click();
           
        }
        else if(element.href.length == 0)
        {
            element.click();
        }
    }
}

function get_current_title()
{
    var pos = get_loc();
    var cur_title = document.getElementById("title-card-"+pos.row+"-"+pos.col);
    if(cur_title == null)
    {
        cur_title = document.getElementsByClassName("title-card")[0];
    }
    return cur_title;
}

var selectTmr = null;

 /**
  * Use this function to reassert the visible selection, sometimes it
  * disappears after a slide left or slide right
  */
function DelaySelect()
{
    // cancel any pending timer, and refresh it
    if (selectTmr != null)
    {
        clearTimeout(selectTmr);
    }
    selectTmr = window.setTimeout(onDelayedSelect, 1000);
}

function onDelayedSelect()
{
    var selection;
    var parent;
    selectTmr = null;
    selection = get_selection();
    select_item(selection);
    
    parent = get_parent(selection,".lolomoRow");
    if(parent != null)
    {
        parent.scrollIntoView({behavior: "smooth", block: "nearest", inline: "nearest"});
    }
}


/**
 *  Returns an actionable video
 */
function get_selection()
{
    var cur_sel;
    // something already marked
    var select = document.querySelectorAll('[tabindex="1"]');
    if(select.length > 0)
    {
        cur_sel = select[0];
        cur_sel.tabIndex=0
        return cur_sel;
    }
    // something already marked
    var select = document.querySelectorAll('[tabindex="2"]');
    if(select.length > 0)
    {
        cur_sel = select[0];
        cur_sel.removeAttribute('tabIndex');
        return cur_sel;
    }
    
    // get title card
    var cur_title = get_current_title();
    if(cur_title != null)
    {
        // get parent container
        var row_parent = get_parent(cur_title,".ptrack-container");
        // get all sliders
        var sliders = row_parent.getElementsByClassName("sliderMask");

        if(sliders.length == 1)
        {
            // if only one slider, choose title
            cur_sel = cur_title.querySelectorAll('[tabindex="0"]')[0];
        }
        else
        {
            // there is a visible episode chooser open
            var active = document.activeElement;
            if(sliders[sliders.length-1].contains(active))
            {
                // if there is already an active element, take it
                cur_sel = get_selectable_children(active)[0];
            }
            else
            {
                // else choose first title
                cur_sel = get_selectable_children(sliders[sliders.length-1])[0];
            }
        }
    }
    else
    {
        // no titles to choose from
         cur_sel = get_selectable_children(document.activeElement)[0];
    }

    return cur_sel;
}

 /**
  * Select all selectable child elements, its a delicate
  * balance between the links we want and don't want
  * and actually allowing what the user expects
  */
function get_selectable_children(element)
{
    var childhref = element.querySelectorAll('[href]:not([tabindex="-1"])')
    var childtabindex = element.querySelectorAll('[tabindex="0"],[tabindex="1"]')
    if(childtabindex.length > 1)
    {
        return childtabindex;
    }
    else if(childhref.length > childtabindex.length)
    {
        return childhref;
    }
    else if(childtabindex.length > 0)
    {
        return childtabindex;
    }
    else
    {
        return [element];
    }
}

function move_left_right(offset)
{
    // Get our title
    var cur_sel = get_selection();
    var selectable;
    var row_parent = get_parent(cur_sel,".slider");
    if(row_parent == null)
    {
        // Not sure what we are selecting, but try and do it gently
        // Get all selectable elements
        selectable = get_selectable_children(document);
    }
    else
    {
        // Get all selectable elements
        selectable = get_selectable_children(row_parent);
    }
    
    var i;
    for(i=0; i<selectable.length; i++)
    {
        if(selectable[i] == cur_sel)
        {
            if((i + offset < selectable.length)&&(i + offset >=0 ))
            {
                select_item(selectable[i+offset]);
                DelaySelect();
                return;
            }
        }
    }
}

function move_up_down(offset)
{
    var col = 0; // colum of current title
    
    // find the selectable element
    var cur_sel = get_selection();
    // get the parent for this row
    var parent = get_parent(cur_sel,".sliderMask");
    // Get all selectable elements
    var selectable = get_selectable_children(parent);
    var i;
    for(i=0; i<selectable.length; i++)
    {
        if(selectable[i] == cur_sel)
        {
            col = i;
            break;
        }
    }
    
    // get all rows
    var sliders = document.getElementsByClassName("sliderMask");
    for(i=0; i<sliders.length; i++)
    {
        if(sliders[i] == parent)
        {
            // found the slider that matches the current selection
            if((i + offset >= 0)&&(i + offset < sliders.length))
            {
                selectable = get_selectable_children(sliders[i + offset]);
                if(col >= selectable.length)
                {
                    col = selectable.length - 1;
                }
                select_item(selectable[col]);
                DelaySelect();
                return;
            }
        }
    }
}

function get_title_relative(pos, offset)
{
    /* get title on new row */
    var element = document.getElementById("title-card-"+pos.row+"-"+pos.col);
    var relative_pos = get_relative_pos(element);
    var parent = get_parent(element, ".lolomoRow");
    if(offset > 0)
    {
        if(parent.nextSibling != null)
        {
            if(parent.nextSibling.getElementsByClassName("handle handlePrev active").length > 0)
            {
                relative_pos +=1;
            }
            title = parent.nextSibling.getElementsByClassName("slider-item slider-item-"+relative_pos)[0].getElementsByClassName("slider-refocus")[0];
        }
    }
    else if(offset < 0)
    {
        if(parent.previousSibling != null)
        {
            if(parent.previousSibling.getElementsByClassName("handle handlePrev active").length > 0)
            {
                relative_pos +=1;
            }
            title = parent.previousSibling.getElementsByClassName("slider-item slider-item-"+relative_pos)[0].getElementsByClassName("slider-refocus")[0];
        }
    }
    return title;
}

var current_season = 0;
var season_tmr = null;

function season_timer()
{
    var season_menu = document.getElementsByClassName("nfDropDown");
    var selector;
    season_tmr = null;
    if(season_menu.length > 0)
    {
        selector = get_selectable_children(season_menu[season_menu.length - 1]);
       
        if(selector.length > 1)
        {
            if(current_season < 1)
            {
                current_season = 1;
            }
            if(current_season >= selector.length)
            {
                current_season = selector.length-1;
            }
            // menu open, so timeout and select item
            select_item(selector[current_season]);
        }
    }
    DelaySelect();
}

function season_focus()
{
    var season_menu = document.getElementsByClassName("nfDropDown");
    var selector = get_selectable_children(season_menu[season_menu.length - 1]);
    if(current_season < 1)
    {
        current_season = 1;
    }
    if(current_season >= selector.length)
    {
        current_season = selector.length-1;
    }
    selector[current_season].focus();
} 

function move_season(offset)
{
    var season_menu = document.getElementsByClassName("nfDropDown");
    var selector;
    if(season_menu.length > 0)
    {
        selector = get_selectable_children(season_menu[season_menu.length - 1]);
        if(selector.length == 1)
        {
            // menu not open
            current_season += offset;
            select_item(selector[0]);
            window.setTimeout(season_focus, 100);
        }
        else if(selector.length > 1)
        {
            // menu open
            current_season += offset;
            if(current_season < 1)
            {
                current_season = 1;
            }
            if(current_season >= selector.length)
            {
                current_season = selector.length-1;
            }
            selector[current_season].focus();
        }
        if(season_tmr != null)
        {
            clearTimeout(season_tmr);
        }
        season_tmr = window.setTimeout(season_timer, 1000);
    }
    else
    {
        // no season menu, so advance the title menu
        move_title_menu(offset);
    }
    
}

function move_title_menu(offset)
{
    var menu = document.querySelectorAll(".menu");
    var i;
    if (menu.length == 0)
    {
        return;
    }
    // just incase there are multiple menus open, take the last one
    var options = menu[menu.length - 1].childNodes;
    for(i=0; i<options.length; i++)
    {
        if(options[i].className.indexOf("current") > 0)
        {
            if((i + offset >= 0)&&(i + offset < options.length))
            {
                get_selection();
                select_item(get_selectable_child(options[i+offset]));
                DelaySelect();
            }
            break;
        }
    }
}

function action_item()
{
    cur_sel = document.activeElement;
    if(cur_sel.tagName == "BUTTON")
    {
        cur_sel.click();
    }
    else if(cur_sel.href.length > 0)
    {
        window.location.replace(cur_sel.href);
    }
}

function doKeyPress(e)
{
    if (e.keyCode ==  9)
    {
        /* Tab */
        if (e.shiftKey)
        {
            move_left_right(-1);
        }
        else
        {
            move_left_right(1);
        }
        return false;
       
    }
    else if (e.keyCode ==  68)
    {
        /* d */
        move_left_right(1);
        return false;
       
    }
    else if(e.keyCode == 65)
    {
        /* a */
        move_left_right(-1);
        
        return false;

    }
    else if(e.keyCode == 83)
    {
        /* s */
        move_up_down(1);
       
        return false;

    }
    else if(e.keyCode == 87)
    {
        /* w */
        move_up_down(-1);
        
        return false;

    }
    else if(e.keyCode == 13)
    {
        /* enter */
        action_item();
        return false;
    }
    else if(e.keyCode == 33)
    {
        /* page up */
        move_title_menu(-1)
    }
    else if(e.keyCode == 34)
    {
        /* page down */
        move_title_menu(1)
    }
    else if(e.keyCode == 219)
    {
        /* [ */
        move_season(-1)
    }
    else if(e.keyCode == 221)
    {
        /* ] */
        move_season(1)
    }
    else if(e.keyCode == 8)
    {
        /* backspace */
        window.history.back();
    }

}


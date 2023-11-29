const _ctt_centeredElements = new Map();
let _ctt_previousWindowWidth = window.innerWidth;
const _ctt_autoDiscoveryBlackListedElements = new Set();
let _ctt_autoDiscoveryMutationObserver = null;

/**
 * Centers an element relative to the window. The element will also be registered so that the centered location is updated whenever:
 * - the screen size changes
 * - the element's size changes
 *
 * @param elementOrSelector Element to center or the CSS selector to find the element that shall be centered.
 * @param options Options. { collisionDetection?: false | "siblings" }.
 * @return function Returns a cleanup functions that restore the original position.
 */
function centerThatThing(elementOrSelector, options = { collisionDetection: false }) {
    let element = null
    if ( typeof elementOrSelector === "string" ) {
        element = document.querySelector(elementOrSelector)
    } else {
        element = elementOrSelector
    }

    if ( element === null ) {
        throw new Error(`Element could not be found (invalid selector) or is null. Was: ${elementOrSelector}`)
    }

    _ctt_autoDiscoveryBlackListedElements.add(element)

    _ctt_centeredElements.set(element, options)
    _ctt_updateElement(element, options)

    const resizeObserver = new ResizeObserver(() => {
        _ctt_updateElement(element, options)
    })
    resizeObserver.observe(element, {box: "border-box"})
    if ( element.parentElement ) {
        resizeObserver.observe(element.parentElement, {box: "border-box"})
    }

    function cleanup() {
        resizeObserver.disconnect()
        _ctt_centeredElements.delete(element)
        _ctt_resetElement(element)
    }

    element._ctt_cleanup = cleanup

    return cleanup
}

/**
 * Restores the original position of the centered element.
 * @param element Element to uncenter.
 */
function uncenterThatThing(element) {
    if ( typeof element._ctt_cleanup === "function" ) {
        element._ctt_cleanup()
    }
}

/**
 * Returns all currently elements managed by this library that are cented.
 * The method returns an array of objects. Each object has an "element" attribute and
 * an "options" object. That allows you (thanks to the returned options) to
 * re-center the elements at a later points in time.
 * @return {{options: any, element: HTMLElement}[]} Array of registered elements and their options.
 */
function getCenterThatThingElementsAndOptions() {
    return Array.from(_ctt_centeredElements.keys()).map(element => ({
        element: element,
        options: _ctt_centeredElements.get(element)
    }))
}

/**
 * If you call this method, the library will listen for newly added elements on the page.
 * If there are new elements, and they have auto discovery attributes (data-ctt-enable or CSS var),
 * then they will be automatically centered too.
 */
function enableCenterThatThingDynamicDiscovery() {
    if ( !_ctt_autoDiscoveryMutationObserver ) {
        _ctt_autoDiscoveryMutationObserver = new MutationObserver(_ctt_autoDiscovery)
        _ctt_autoDiscoveryMutationObserver.observe(document.body, {subtree: true, childList: true})
    }
}

// INTERNAL
function _ctt_updateElement(element, options) {
    const windowWidth = window.innerWidth;
    const { x: currentElementX, width: elementWidth} = element.getBoundingClientRect();
    const realElementX = currentElementX - (element._ctt_offsetX ?? 0)

    const idealPosition = (windowWidth - elementWidth) / 2;

    // might be modified by collision detection strategies later
    let offsetX = Math.floor(idealPosition - realElementX)
    const newPosition = realElementX + offsetX

    // To be able to reset an element, we need to store the original "position" value.
    if ( !element._ctt_old_position ) {
        element._ctt_old_position = element.style.position
        element.style.position = "relative"
    }

    // Collision detection: "siblings" strategy.
    // We get the previous and next sibling and use them as limiting element for
    // X-axis translation/offset.
    if ( options.collisionDetection === "siblings" ) {
        const previousSibling = element.previousElementSibling
        const nextSibling = element.nextElementSibling

        let minX = 0
        if ( previousSibling ) {
            const { x: previousSiblingX, width: previousSiblingWidth } = previousSibling.getBoundingClientRect()
            minX = previousSiblingX + previousSiblingWidth + 1
        }

        let maxX = Infinity
        if ( nextSibling ) {
            const { x: nextSiblingX } = nextSibling.getBoundingClientRect()
            maxX = nextSiblingX - 1
        }

        if ( newPosition < minX ) {
            offsetX += minX - newPosition
        } else if ( newPosition + elementWidth > maxX ) {
            offsetX = maxX - elementWidth - realElementX
        }
    }

    // We need to store the currently applied offset
    // to correctly compute the offset the next time.
    // Why? Because getBoundingClientRect() would give
    // us the correct position the next time. This would
    // result in an offset of "0px" if we don't take into account
    // that WE already have shifted the element on the X-axis.
    element._ctt_offsetX = offsetX

    element.style.left = `${offsetX}px`
}

// INTERNAL
function _ctt_resetElement(element) {
    element.style.position = element._ctt_old_position
    element.style.left = "0px"
}

// INTERNAL
function _ctt_updateAllElements() {
    for ( const element of _ctt_centeredElements.keys() ) {
        _ctt_updateElement(element, _ctt_centeredElements.get(element))
    }
}

// INTERNAL
function _ctt_autoDiscovery() {
    let newElements = []

    // Find elements via data attributes.
    newElements.push(...Array.from(document.querySelectorAll("*[data-ctt-enable='true']"))
        .filter(element => !_ctt_centeredElements.has(element))
        .map(element => {
            const options = {
                collisionDetection: element.dataset.cttCollisionDetection ?? false
            }

            return {
                element: element,
                options: options
            }
        })
    )

    // Find elements via CSS variable on :root
    let cttCssElements = (getComputedStyle(document.documentElement)
        .getPropertyValue('--center-that-thing') ?? '').trim()
        .replaceAll("\\\"", "\""); // safari fix
    if ( cttCssElements.startsWith("\"") || cttCssElements.startsWith("'") ) {
        cttCssElements = cttCssElements.substring(1, cttCssElements.length-1)
    }

    if ( cttCssElements.length > 0 ) {
        let elementsSpecificiations = []

        try {
            elementsSpecificiations = JSON.parse(cttCssElements)
        } catch (e) {
            throw new Error(`Could not parse '--center-that-thing' CSS variable: ${e.msg ?? e}`)
        }

        if ( !Array.isArray(elementsSpecificiations) ) {
            throw new Error("Value of '--center-that-thing' CSS var was not a JSON array.")
        }

        for ( const elementSpecification of elementsSpecificiations ) {
            try {
                if ( !elementSpecification?.selector ) {
                    throw new Error(`CenterThatThing CSS variable declaration contained an element without a 'selector' prop: ${element}`)
                }

                const element = document.querySelector(elementSpecification.selector)
                if ( !element ) {
                    throw new Error(`Element could not be found by selector defined in CSS var '--center-that-thing'. Selector was: ${element.selector}`)
                }

                const options = {...elementSpecification}
                delete options["selector"]

                newElements.push({
                    element: element,
                    options: options
                })
            } catch (e) {
                console.error(`Got malformed CenterThatThing CSS var element: ${e?.msg ?? e}`)
            }
        }
    }

    // Apply black list
    newElements = newElements.filter(entry => !_ctt_autoDiscoveryBlackListedElements.has(entry.element))

    newElements.forEach(entry => {
        centerThatThing(entry.element, entry.options)
    })
}

// Update on screen size changes.
window.addEventListener("resize", () => {
    const newWindowWidth = window.innerWidth
    if ( newWindowWidth !== _ctt_previousWindowWidth ) {
        setTimeout(_ctt_updateAllElements, 0)
    }
    _ctt_previousWindowWidth = newWindowWidth
})

// Enable auto discovery when document is loaded.
if ( document.readyState === "complete" ) {
    _ctt_autoDiscovery()
} else {
    document.addEventListener('DOMContentLoaded', function() {
        _ctt_autoDiscovery()
    });
}
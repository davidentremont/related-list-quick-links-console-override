({
    onLoad: function(component, event, helper) {
        // Get console api
        const consoleAPI = component.find('consoleAPI')

        // Target known node for the Related List Quick Links
        const targetNode = document.querySelector('div.uiContainerManager')

        // Callback function to execute when mutations are observed
        const detectLookupElements = (mutationList, observer) => {
            // Filter for related list table rows
            for(const mutation of mutationList) {
                if(mutation.target.nodeName === 'TBODY') {                    
                    // Attach event listener to each lookup link found in the table row
                    mutation.target.querySelectorAll('a.outputLookupLink').forEach(link => {
                        link.addEventListener('click', interceptClick, { capture: true, passive: false })
                    })   
                }
            }
        }

        // Callback for click interception
        const interceptClick = (event) => {
            // Block event
            event.stopPropagation()
            event.preventDefault()

            // Get record id for lookup
            const recordId = event.target.getAttribute('data-recordid')

            // Get enclosing parent tab 
            consoleAPI.getFocusedTabInfo().then(function(response) {
                // console.log('focusedtab', response)
                // console.log('Open Subtab', 'RecordId', recordId, 'EnclosingTab', response.tabId)

                // Open link as a subtab
                consoleAPI.openSubtab({
                    parentTabId: response.tabId,
                    recordId: recordId,
                    focus: true
                })
            })           
        }

        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(detectLookupElements)

        // Start observing the target node for configured mutations, Options for the observer (which mutations to observe)
        observer.observe(targetNode, { childList: true, subtree: true })
    }
})

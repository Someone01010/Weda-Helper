// Function to resize elements
function uploaderformResizeElements() {
    // Change the size of specific elements here
    // For example, to change the height of the PDF viewer:
    var pdfViewer = document.querySelector('#ContentPlaceHolder1_ViewPdfDocumentUCForm1_PanelViewDocument');
    if (pdfViewer) {
        pdfViewer.style.height = '600px'; // replace '500px' with the desired height
    }

    // Change the height of the iframe
    var iframe = document.querySelector('#ContentPlaceHolder1_ViewPdfDocumentUCForm1_iFrameViewFile');
    if (iframe) {
        iframe.style.height = '600px'; // replace '450px' with the desired height
    }

    // Set the top of the PanelFindPatient element
    var panelFindPatient = document.querySelector('#ContentPlaceHolder1_FindPatientUcForm1_PanelFindPatient');
    if (panelFindPatient) {
        panelFindPatient.style.top = '600px'; // replace '600px' with the desired top position
    }
}


function uploaderformSetTabOrder() {
    var elementIds = [
        'ContentPlaceHolder1_FileStreamClassementsGrid_LinkButtonFileStreamClassementsGridPatientNom_',
        'ContentPlaceHolder1_FileStreamClassementsGrid_EditBoxGridFileStreamClassementDate_',
        'ContentPlaceHolder1_FileStreamClassementsGrid_EditBoxGridFileStreamClassementTitre_',
        'ContentPlaceHolder1_FileStreamClassementsGrid_DropDownListGridFileStreamClassementLabelClassification_'
    ];

    var tabIndex = 1;
    for (var i = 0; i <= 7; i++) {
        elementIds.forEach(function (elementId) {
            var element = document.getElementById(elementId + i);
            if (element) {
                element.tabIndex = tabIndex;
                tabIndex++;
            }
        });
    }
}

function PatientListTabOrderer() {
    // get how many ContentPlaceHolder1_FindPatientUcForm1_PatientsGrid_LinkButtonPatientGetNomPrenom_0 there are
    var elements = document.querySelectorAll('[id^="ContentPlaceHolder1_FindPatientUcForm1_PatientsGrid_LinkButtonPatientGetNomPrenom_"]');
    // change the taborder starting with 100 for ContentPlaceHolder1_FindPatientUcForm1_PatientsGrid_LinkButtonPatientGetNomPrenom_0 and incrementing by 1 for each element
    for (var i = 0; i < elements.length; i++) {
        elements[i].tabIndex = i+100;
    }
}

function FocusToDocDateAfterPatientSelect() {
    // find all elements with id starting with ContentPlaceHolder1_FileStreamClassementsGrid_LinkButtonFileStreamClassementsGridPatientNom_
    var elements = document.querySelectorAll('[id^="ContentPlaceHolder1_FileStreamClassementsGrid_LinkButtonFileStreamClassementsGridPatientNom_"]');
    // starting from the last element, find the first element with title= starting with "Vous avez attribué ce document au patient" and gets its id
    for (var i = elements.length - 1; i >= 0; i--) {
        var element = elements[i];
        console.log('element', element);
        if (element.title.startsWith("Vous avez attribué ce document au patient")) {
            var id = element.id;
            // get the 1 or 2 digits at the end of the id
            var patient_number = id.match(/\d+$/)[0];
            console.log('Le patient en cours est en position', patient_number);
            // focus on the element with ContentPlaceHolder1_FileStreamClassementsGrid_EditBoxGridFileStreamClassementDate_ + patient_number
            var elementToFocus = document.getElementById('ContentPlaceHolder1_FileStreamClassementsGrid_EditBoxGridFileStreamClassementDate_' + patient_number);
            if (elementToFocus) {
                elementToFocus.focus();
            break;}
        }
    }
}

// place a listner on all patients names (ContentPlaceHolder1_FindPatientUcForm1_PatientsGrid_LinkButtonPatientGetNomPrenom_0 etc.)
function PatientSelectEntryListener() {
    // place a listener on all elements starting with ContentPlaceHolder1_FindPatientUcForm1_PatientsGrid_LinkButtonPatientGetNomPrenom_
    var elements = document.querySelectorAll('[id^="ContentPlaceHolder1_FindPatientUcForm1_PatientsGrid_LinkButtonPatientGetNomPrenom_"]');
    for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                console.log('Enter pressed on patient name');
                setTimeout(function() {
                    FocusToDocDateAfterPatientSelect();
                }, 500);
            }
        });
    }
}

function SearchBoxEntryListener() {
    var element = document.getElementById('ContentPlaceHolder1_FindPatientUcForm1_TextBoxRecherche');
    if (element === null) {
        console.log('SearchBoxEntryListener: element null');
        var element = document.getElementById('ContentPlaceHolder1_FindPatientUcForm1_PanelNom');
    }

    if (element) {
        element.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                console.log('Enter pressed in search box');
                setTimeout(function() {
                    var elementToFocus = document.getElementById('ContentPlaceHolder1_FindPatientUcForm1_PatientsGrid_LinkButtonPatientGetNomPrenom_0');
                    if (elementToFocus) {
                        elementToFocus.focus();
                    }
                    PatientListTabOrderer();
                    PatientSelectEntryListener();
                    SearchBoxEntryListener();
                }, 400);
            }
        });
    }
}

function uploaderformSetup() {
    uploaderformResizeElements();
    uploaderformSetTabOrder();
    SearchBoxEntryListener();
};

function ConsultationFormTabOrderer() {
    // make a var with all the elements with id starting with ContentPlaceHolder1_SuivisGrid_EditBoxGridSuiviReponse_
    var elements = document.querySelectorAll('[id^="ContentPlaceHolder1_SuivisGrid_EditBoxGridSuiviReponse_"]');
    // change the taborder starting with 0 for elements[0] and incrementing by 1 for each element
    for (var i = 0; i < elements.length; i++) {
        elements[i].tabIndex = i+1;
    }
}

// // Change some elements based on the URL and function parameters

// Check the current URL and add the event listener if it matches
chrome.storage.sync.get('TweakImports', function(result) {
    if (result.TweakImports !== false) {
        if (window.location.href === 'https://secure.weda.fr/FolderMedical/UpLoaderForm.aspx') {
            // Create a MutationObserver instance to watch for changes in the DOM
            var observer = new MutationObserver(function (mutations) {
                uploaderformSetup();
            });

            // Start observing the document with the configured parameters
            observer.observe(document, { childList: true, subtree: true });

            uploaderformSetup();
        }
    }
});

// check if the current page is https://secure.weda.fr/FolderMedical/ConsultationForm.aspx and start ConsultationFormTabOrderer
chrome.storage.sync.get('TweakTabConsultation', function(result) {
    if (result.TweakTabConsultation !== false) {
        if (window.location.href.startsWith('https://secure.weda.fr/FolderMedical/ConsultationForm.aspx')) {
            ConsultationFormTabOrderer();
            console.log('ConsultationFormTabOrderer started');
        }
    }
});


// Remove the title suggestions if the page starts with https://secure.weda.fr/FolderMedical/ and contain Form.aspx
chrome.storage.sync.get('RemoveTitleSuggestions', function(result) {
    if (result.RemoveTitleSuggestions !== false) {
        if (window.location.href.startsWith('https://secure.weda.fr/FolderMedical/') && window.location.href.includes('Form.aspx')) {
            console.log('RemoveTitleSuggestions started');
            var elements = document.getElementById('DivGlossaireReponse');
            if (elements) {
                elements.remove();
            }
        
        }    
    }
});


// Change the tab order if the page is https://secure.weda.fr/FolderMedical/FindPatientForm.aspx if the option is enabled (TweakTabSearchPatient)
chrome.storage.sync.get('TweakTabSearchPatient', function(result) {
    console.log('TweakTabSearchPatient from storage:', result.TweakTabSearchPatient);
    if (result.TweakTabSearchPatient !== false) {
        if (window.location.href === 'https://secure.weda.fr/FolderMedical/FindPatientForm.aspx') {
            console.log('TweakTabSearchPatient started');
            PatientListTabOrderer();
            var elementToFocus = document.getElementById('ContentPlaceHolder1_FindPatientUcForm1_PatientsGrid_LinkButtonPatientGetNomPrenom_0');
                if (elementToFocus) {
                    elementToFocus.focus();
                }
            SearchBoxEntryListener();
        }
    }
});

// start the function dummyfunction if the page is https://secure.weda.fr/FolderMedical/FindPatientForm.aspx
if (window.location.href.startsWith('https://secure.weda.fr/FolderMedical/PrescriptionForm.aspx')) {
    console.log('numpader started');
    // set index with some keyboard touches corresponding to some ids (set randmon ids for now)
    var index = {
        '0': 'SetQuantite(0);',
        '1': 'SetQuantite(1);',
        '2': 'SetQuantite(2);',
        '3': 'SetQuantite(3);',
        '4': 'SetQuantite(4);',
        '5': 'SetQuantite(5);',
        '6': 'SetQuantite(6);',
        '7': 'SetQuantite(7);',
        '8': 'SetQuantite(8);',
        '9': 'SetQuantite(9);',
        '/': 'SetQuantite(\'/\');',
        '.': 'SetQuantite(\',\');',
        // add a key for backspace which click on AnnulerQuantite();
        'Backspace': 'AnnulerQuantite();',

    };
    
    // detect the press of keys in index, and click the corresponding element with clickElementByonclick
    
    document.addEventListener('keydown', function(event) {        
        console.log('event.key', event.key);
        if (event.key in index) {
            console.log('key pressed:', event.key);
            clickElementByOnclick(index[event.key]);
        }
    });

    
    // observer.observe(document, { childList: true, subtree: true });
}


// Shortcuts
function clickElementById(elementId) {
    var element = document.getElementById(elementId);
    if (element) {
        element.click();
        console.log('Element clicked:', elementId);
        return true;
    } else {
        console.log('Element not found:', elementId);
        return false;
    }
}

function clickElementByOnclick(onclickValue) {
    var element = document.querySelector(`[onclick*="${onclickValue}"]`);
    console.log('Element:', element);
    if (element) {
        console.log('Clicking element onclickvalue', onclickValue);
        element.click();
        return true;
    } else {
        console.log('Element not found onclickvalue', onclickValue);
        return false;
    }
}

function clickFirstPrinter() {
    // print the element with onclick containing ctl00$ContentPlaceHolder1$MenuPrint and class popout-dynamic level2 dynamic
    var element = document.querySelector('[onclick*="ctl00$ContentPlaceHolder1$MenuPrint"][class="popout-dynamic level2 dynamic"]');
    if (element) {
        element.click();
        return true;
    } else {
        return false;
    }
}

function clickElementByClass(className) {
    var elements = document.getElementsByClassName(className);
    if (elements.length > 0) {
        var lastElement = elements[elements.length - 1]; // Get the last element
        lastElement.click(); // Click the last element with the class
        console.log('Element clicked class', className);
        console.dir(lastElement); // Log all properties of the clicked element
        return true;
    }
    else {
        console.log('no Element clicked class', className);
        return false;
    }
}

function GenericClicker(valueName, value) {
    var elements = document.querySelectorAll(`[${valueName}="${value}"]`);
    if (elements.length > 0) {
        var element = elements[0]
        console.log('Clicking element', valueName, value);
        element.click();
        return true;
    } else {
        console.log('Element not found', valueName, value);
        return false;
    }
}


// function submenuW(description) {
//     if (!clickElementByDescription('level3 dynamic', description)) {
//         clickElementByDescription('level2 dynamic', description);
//     }
// }

// Click element based on this sequence : must be in the subtree of the first element with 'class=level1 dynamic'. Then look for the first element with 'class=level3 dynamic' and 'description=description'. If there's none, click the first element with 'class=level2 dynamic' and 'description=description'
function submenuW(description) {
    var level1Element = document.getElementsByClassName('level1 static')[0];
    console.log('level1Element', level1Element);
    if (level1Element) {
        var level3Element = Array.from(level1Element.getElementsByClassName('level3 dynamic')).find(function (element) {
            return element.innerText.includes(description) && element.hasAttribute('tabindex');            
        });
        console.log('level3Element', level3Element);
        if (level3Element) {
            level3Element.click();
            console.log('Element clicked:', level3Element);
            return true;
        } else {
            var level2Element = Array.from(level1Element.getElementsByClassName('level2 dynamic')).find(function (element) {
                return element.innerText.includes(description) && element.hasAttribute('tabindex');
            });
            console.log('level2Element', level2Element);
            if (level2Element) {
                level2Element.click();
                console.log('Element clicked:', level2Element);
                return true;
            }
        }
    }
    console.log('No elements found', description);
    return false;
}    



// Click an element by its description
function clickElementByDescription(lvl_dynamic, description) {
    var elements = document.getElementsByClassName(lvl_dynamic);
    if (elements.length > 0) {
        var element = Array.from(elements).find(function (element) {
            return element.innerText.includes(description) && element.hasAttribute('onclick');
        });
        if (element) {
            element.click();
            console.log('Element clicked:', element);
            return true;
        } else {
            console.log('Element not found:', description);
            return false;
        }
    } else {
        console.log('No elements found', description);
        return false;
    }
}
function clickElementByChildtextContent(childtextContent) {
    var elements = document.querySelectorAll('span.mat-button-wrapper');
    console.log('elements', elements);
    for (var i = 0; i < elements.length; i++) {
        if (elements[i].textContent === childtextContent) {
            elements[i].parentNode.click();
            break;
        }
    }
}

// focus the tab selection on an element named 'ctl00$ContentPlaceHolder1$ViewPdfDocumentUCForm1$ButtonCloseStay'
function focusElementByName(elementName) {
    console.log('Focusing element:', elementName);
    var element = document.getElementsByName(elementName)[0];
    if (element) {
        element.focus();
        console.log('Focusing element success:', elementName);
    }
}

function waitForElementToExist(elementId, callback) {
    var element = document.getElementById(elementId);
    if (element) {
        callback(element);
    } else {
        var startTime = Date.now();
        var checkInterval = setInterval(function() {
            var elapsedTime = Date.now() - startTime;
            if (elapsedTime >= 5000) {
                clearInterval(checkInterval);
                console.log('Timeout: Element not found after 5 seconds');
            } else {
                var element = document.getElementById(elementId);
                if (element) {
                    clearInterval(checkInterval);
                    callback(element);
                }
            }
        }, 100); // Check every 100 milliseconds
    }
}

// set all ContentPlaceHolder1_FileStreamClassementsGrid_DropDownListGridFileStreamClassementEvenementType_ to option value 1
function allConsultation() {
    console.log('setAllImportToConsultation');
    var elements = document.querySelectorAll('[id^="ContentPlaceHolder1_FileStreamClassementsGrid_DropDownListGridFileStreamClassementEvenementType_"]');
    for (var i = 0; i < elements.length; i++) {
        // set the dropdown to "Consultation"
        elements[i].selectedIndex = 0;
        console.log('Element set to Consultation:', elements[i]);
    }
}

function push_valider() {
    console.log('push_valider activé');
    function clickClassExceptIf(class_name, exception) {
        var elements = document.getElementsByClassName(class_name);
        console.log('elements', elements);
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].value !== exception) {
                elements[i].click();
                return true
            }
        }
        return false
    }
    const actions = [
        () => clickElementById('ContentPlaceHolder1_BaseGlossaireUCForm1_ButtonValidDocument'),
        () => clickClassExceptIf('button valid', 'Chercher'),
        () => GenericClicker("title","Enregistrer et quitter"),
        () => GenericClicker("title","Valider"),
        () => clickElementByChildtextContent("VALIDER")
    ];

    actions.some(action => action() !== false);
}

const keyCommands = {
    'push_valider': {
        description: 'Appuie le bouton Valider ou équivalent',
        key: 'alt+v',
        action: function() {
            push_valider();
        }
    },
    'push_annuler': {
        description: 'Appuie le bouton Annuler ou équivalent',
        key: 'alt+a',
        action: function() {
            console.log('push_annuler activé');
            if (!clickElementByClass('button cancel')) {
                GenericClicker("title","Annuler")
                GenericClicker("title","Quitter")
                clickElementByChildtextContent("ANNULER")
            };
        }
    },
    'print_meds': {
        description: 'Imprime les médicaments',
        key: 'ctrl+p',
        action: function() {
            console.log('print_meds activé');
            clickFirstPrinter();
            waitForElementToExist('ContentPlaceHolder1_ViewPdfDocumentUCForm1_ButtonCloseStay', function(element) {
                console.log('Element détecté:', element);
                setTimeout(function() {
                    focusElementByName('ctl00$ContentPlaceHolder1$ViewPdfDocumentUCForm1$ButtonCloseStay');
                }, 400);
            });
        }
    },
    'push_enregistrer': {
        description: 'Appuie le bouton Enregistrer ou équivalent',
        key: 'ctrl+s',
        action: function() {
            console.log('push_enregistrer activé');
            clickElementById('ButtonSave');
        }
    },
    'push_delete': {
        description: 'Appuie le bouton Supprimer ou équivalent',
        key: 'alt+s',
        action: function() {
            console.log('push_delete activé');
            clickElementByClass('button delete');
        }
    },
    'shortcut_w': {
        description: 'Raccourci W',
        key: 'alt+w',
        action: function() {
            console.log('shortcut_w activé');
            clickElementByOnclick("ctl00$ContentPlaceHolder1$EvenementUcForm1$MenuNavigate")
        }
    },
    'shortcut_consult': {
        description: 'Raccourci Consultation (crée une nouvelle consultation ou ouvre celle existante)',
        key: 'alt+&',
        action: function() {
            console.log('shortcut_consult activé');
            submenuW(' Consultation');
        }
    },
    'shortcut_certif': {
        description: 'Raccourci Certificat (crée un nouveau certificat ou ouvre celui existant)',
        key: 'alt+é',
        action: function() {
            console.log('shortcut_certif activé');
            submenuW(' Certificat');
        }
    },
    'shortcut_demande': {
        description: 'Raccourci Demande (crée une nouvelle demande ou ouvre celle existante)',
        key: 'alt+\"',
        action: function() {
            console.log('shortcut_demande activé');
            submenuW(' Demande');
        }
    },
    'shortcut_prescription': {
        description: 'Raccourci Prescription (crée une nouvelle prescription ou ouvre celle existante)',
        key: 'alt+\'',
        action: function() {
            console.log('shortcut_prescription activé');
            submenuW(' Prescription');
        }
    },
    'shortcut_formulaire': {
        description: 'Raccourci Formulaire (crée un nouveau formulaire ou ouvre celui existant)',
        key: 'alt+f',
        action: function() {
            console.log('shortcut_formulaire activé');
            submenuW(' Formulaire');
        }
    },
    'shortcut_courrier': {
        description: 'Raccourci Courrier (crée un nouveau courrier ou ouvre celui existant)',
        key: 'alt+(',
        action: function() {
            console.log('shortcut_courrier activé');
            submenuW(' Courrier');
        }
    },
    'shortcut_fse': {
        description: 'Raccourci FSE',
        key: 'alt+-',
        action: function() {
            console.log('shortcut_fse activé');
            submenuW(' FSE');
        }
    },
    'shortcut_carte_vitale': {
        description: 'Raccourci Carte Vitale',
        key: 'alt+c',
        action: function() {
            console.log('shortcut_carte_vitale activé');
            clickElementByClass("cv");
            if (!GenericClicker("title","Relance une lecture de la carte vitale")) { //TODO à tester : pour l'instant sous linux j'ai un message d'erreur
                GenericClicker("mattooltip","Lire la Carte Vitale");
            }
        }
    },
};


// Listen for messages from the background script about options
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "allConsultation") {
        console.log('allConsultation demandé');
        allConsultation();

    }
});

// Listen for messages from the background script about keycommands
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log('request', request);
    const entries = Object.entries(keyCommands);
    for (const [key, value] of entries) {
        if (request.action === key) {
            value.action();
            break;
        }
    }
});


// TODO break into functions
function tooltipshower(shortcuts){
    // first force the mouseover status to the element with class="level1 static" and aria-haspopup="ContentPlaceHolder1_MenuNavigate:submenu:2"
    var element = document.querySelector('[class="has-popup static"]');
    if (element) {
        element.dispatchEvent(new MouseEvent('mouseover', {
            view: window,
            bubbles: true,
            cancelable: true
        }));
    }
    // from keyCommands, extract for each key the action
    const entries = Object.entries(keyCommands);
    let submenuDict = {};

    for (const [key, value] of entries) {
        let action = value.action;
        // in the action extract the variable send to submenuW
        if (action.toString().includes('submenuW')) {
            var match = action.toString().match(/submenuW\('(.*)'\)/);
            if (match) {
                var submenu = match[1];
                submenuDict[submenu] = value.key;
            }
        }
    }

    console.log(submenuDict);

    // change the description of each class="level2 dynamic" whom description contain the key of submenuDict to add the corresponding value
    var elements = document.getElementsByClassName('level2 dynamic');
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        var description = element.innerText;
        description = description.replace(/ \(\d+\)$/, '');
        // console.log('description', description);
        if (description in submenuDict) {
            // console.log('description in submenuDict', description);
            // add a tooltip with the key of submenuDict next to the element
            var tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.style.position = 'absolute';
            tooltip.style.top = '0px';
            tooltip.style.left = '100%';
            tooltip.style.padding = '10px';
            tooltip.style.backgroundColor = '#284E98';
            tooltip.style.border = '1px solid black';
            tooltip.style.zIndex = '1000';
            // tooltip.style.color = 'black';
            tooltip.textContent = submenuDict[description];
            element.appendChild(tooltip);
        }
    }
}

var tooltipTimeout;
document.addEventListener('keydown', function(event) {
    if (event.key === 'Alt') {
        var shortcuts = '';
        for (var command in keyCommands) {
            shortcuts += command + ': ' + keyCommands[command].description + ' (' + keyCommands[command].key + ')\n';
        }
        tooltipTimeout = setTimeout(function() {
            tooltipshower(shortcuts);
        }, 500);
    }
});
document.addEventListener('keyup', function(event) {
    if (event.key === 'Alt') {
        clearTimeout(tooltipTimeout);
        // Supprimer les tooltips
        var tooltips = document.querySelectorAll('div.tooltip');
        tooltips.forEach(function(tooltip) {
            tooltip.remove();
        });
        // relacher W
        var element = document.querySelector('[class="has-popup static"]');
        if (element) {
            element.dispatchEvent(new MouseEvent('mouseout', {
                view: window,
                bubbles: true,
                cancelable: true
            }));
        }

    }
});
 class MarkupExtension extends Autodesk.Viewing.Extension {
    constructor(viewer, option) {
        super(viewer, option);
        this._group = null;
        this._button = null;
        this._icons = option.icons || [];
        this.markupType;
        this.modeArrow;
        this.markups = [];
        this.styles = {};
    }

     load() {
        console.log('MarkupExtension has been loaded');
        return true;
    }
    
    unload() {
        // Clean our UI elements if we added any
        if (this._group) {
            this._group.removeControl(this._button);
            if (this._group.getNumberOfControls() === 0) {
                this.viewer.toolbar.removeControl(this._group);
            }
        }
        console.log('MarkupExtension has been unloaded');
        return true;
    }
    getAllLeafComponents(callback) {
        this.viewer.getObjectTree(function (tree) {
            let leaves = [];
            tree.enumNodeChildren(tree.getRootId(), function (dbId) {
                if (tree.getChildCount(dbId) === 0) {
                    leaves.push(dbId);
                }
            }, true);
            callback(leaves);
        });
    }
    onToolbarCreated() {
        // Create a new toolbar group if it doesn't exist
        this._group = this.viewer.toolbar.getControl('allCustomExtensionsToolbar');
        if (!this._group) {
            this._group = new Autodesk.Viewing.UI.ControlGroup('allCustomExtensionsToolbar');
            this.viewer.toolbar.addControl(this._group);
        }

        // Add a new button to the toolbar group
        this._button = new Autodesk.Viewing.UI.Button('MarkupExtensionButton');
        this._button.onClick = (ev) => {

            // var myStyle = document.querySelector('#markup-panel');
            // myStyle.style.color;
            // window.getComputedStyle(myStyle).color;
            // var svgStyle = new DomElementStyle();
            // svgStyle.setAttribute('position', 'absolute');
            // svgStyle.setAttribute('left', '0');
            // svgStyle.setAttribute('top', '0');
            // svgStyle.setAttribute('transform', 'scale(1,-1)', { allBrowsers: true});
            // svgStyle.setAttribute('transformOrigin', '0, 0', { allBrowsers: true});
            // svg.setAttribute('style', svgStyle.getStyleString());
    
            // Execute an action here
            // alert('markup');
            // var htmldiv = document.getElementById('markup-panel');

            // if(htmldiv){
            //     var arrowdiv = document.getElementById('arrowMarkup');
            //     if(arrowdiv) {
            //         this.viewer.loadExtension("Autodesk.Viewing.MarkupsCore").then((ext) => {
            //             ext.enterEditMode();
            //             this.markupType = "arrow";
            //             this.modeArrow = new Autodesk.Viewing.Extensions.Markups.Core.EditModeArrow(ext);
            //             ext.changeEditMode(this.modeArrow);
            //         })
            //     }
            // }
            // const structureButton = new Autodesk.Viewing.UI.Button

            // const subtoolbar = new Autodesk.Viewing.UI.ControlGroup('toolbar-adn-tools');
            // subtoolbar.addClass('');
            // subtoolbar.addControl
            
            
            
        };
        this._button.setToolTip('Markup Extension');
        this._button.addClass('MarkupExtensionIcon');
        this._group.addControl(this._button);
    }
}

// MarkupExtension.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
// MarkupExtension.prototype.constructor = MarkupExtension;

// MarkupExtension.prototype.load = function() {
//     alert("MarkupExtension is load");
//     return true;
// };
// MarkupExtension.prototype.unload = function() {
//     alert("MarkupExtension is now unload");
//     return true;
// };

Autodesk.Viewing.theExtensionManager.registerExtension('MarkupExtension',MarkupExtension);


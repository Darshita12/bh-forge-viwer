(function() {
    class AdnModelStructurePanel extends Autodesk.Viewing.UI.DockingPanel {
        constructor( viewer, title, options ) {
          options = options || {};
 
          
    
          //  Height adjustment for scroll container, offset to height of the title bar and footer by default.
          if( !options.heightAdjustment )
            options.heightAdjustment = 70;
    
          if( !options.marginTop )
            options.marginTop = 0;
    
          super( viewer.container, viewer.container.id + 'AdnModelStructurePanel', title, options );
    
          this.container.classList.add( 'adn-docking-panel' );
          this.container.classList.add( 'adn-model-structure-panel' );
          this.createScrollContainer( options );
    
          this.viewer = viewer;
          this.options = options;
          this.uiCreated = false;
    
          this.addVisibilityListener(( show ) => {
            if( !show ) return;
    
            if( !this.uiCreated )
              this.createUI();
    
            this.resizeToContent();
          });

          this.markupType;
          this.modeArrow;
          this.modeRectangle;
        }
    
        hasPropertyTask( model, dbId, propName, matches ) {
          return new Promise(function( resolve, reject ) {
            const instanceTree = model.getData().instanceTree;
    
            model.getProperties( dbId, function( result ) {
              const nodeName = instanceTree.getNodeName( dbId );
              const hasChildren = instanceTree.getChildCount( dbId ) > 0 ;
    
              if( !result.properties || hasChildren )
                return resolve();
    
              for( let i = 0; i < result.properties.length; ++i ) {
                const prop = result.properties[i];
      
                //check if we have a match
                if( !prop.displayName.contains( propName ) || !prop.displayValue )
                  continue;
    
                let match = matches.find( node => node.text == prop.displayValue );
                    
                if( !match ) {
                  match = {
                    id: 'mat-' + guid(),
                    text: prop.displayValue,
                    children: [
                      {
                        id: dbId,
                        text: nodeName
                      }
                    ]
                  };
    
                  matches.push( match );
                } else {
                  match.children.push({
                    id: dbId,
                    text: nodeName
                  });
                }
              }
    
              return resolve();
            }, function() {
              return reject();
            });
          });
        }
    
        executeTaskOnModelTree( model, task ) {
          const taskResults = [];
    
          function _executeTaskOnModelTreeRec( dbId ){
            instanceTree.enumNodeChildren( dbId,
              function( childId ) {
                taskResults.push( task( model, childId) );
                _executeTaskOnModelTreeRec( childId );
              });
          }
      
          //get model instance tree and root component
          const instanceTree = model.getData().instanceTree;
          const rootId = instanceTree.getRootId();
      
          _executeTaskOnModelTreeRec( rootId );
      
          return taskResults;
        }
    
        buildTree() {
          const viewer = this.viewer;
    
          viewer.getObjectTree( () => {
            const matches = [];
    
            // Creates a thunk for our task
            // We look for all components which have a
            // property named 'Material' and returns a list
            // of matches containing dbId and the prop value
            const taskThunk = ( model, dbId ) => {
              return this.hasPropertyTask(
                model, dbId, 'Material', matches);
            };
    
            const taskResults = this.executeTaskOnModelTree(
              viewer.model,
              taskThunk
            );
    
            Promise.all( taskResults )
              .then(() => {
                console.log( 'Found ' + matches.length + ' matches' );
                console.log( matches );
    
                $( this.treeContainer )
                  .on('select_node.jstree', function( e, data ) {
                    console.log( e, data );
                    if( !data ) return;
                    
                    let dbIds = [];
                    viewer.clearSelection();
    
                    if( data.node.id.contains( 'mat-' ) ) {
                      dbIds = data.node.children.map( child => parseInt( child ) );
                      
                    } else {
                      const dbId = parseInt( data.node.id );
                      dbIds = [dbId];
                    }
    
                    viewer.select( dbIds );
                    viewer.fitToView( dbIds );
                  })
                  // .on( 'open_node.jstree', ( e, data ) => {
                  //   this.resizeToContent();
                  // })
                  // .on( 'close_node.jstree', ( e, data ) => {
                  //   this.resizeToContent();
                  // })
                  .jstree({
                    core: {
                      data: matches,
                      themes: {
                        icons: false
                      }
                    }
                  });
              });
          },
          function( code, msg ) {
            console.error( code, msg );
          });
        }
    
        createUI() {
          this.uiCreated = true;
          const viewer = this.viewer;

          const div = document.createElement( 'div' );
    
          const treeDiv = document.createElement( 'div' );
          div.appendChild( treeDiv );
          this.treeContainer = treeDiv;
    
          this.scrollContainer.appendChild( div );

          const btn = document.createElement('button');
          btn.innerHTML = "Arrow"
          btn.type = "button"
          btn.setAttribute("style","background-color:#363636;margin:10px 5px 5px 10px;")
          btn.onclick = function () {
            debugger
            // alert("btn clicked")
             var htmldiv = document.getElementById('markup-panel');

            if(htmldiv){
                var arrowdiv = document.getElementById('arrowMarkup');
                if(arrowdiv) {
                      viewer.loadExtension("Autodesk.Viewing.MarkupsCore").then((ext) => {
                        ext.enterEditMode();
                        this.markupType = "arrow";
                        this.modeArrow = new Autodesk.Viewing.Extensions.Markups.Core.EditModeArrow(ext);
                        ext.changeEditMode(this.modeArrow);
                        Autodesk.Viewing.Extensions.Markups.Core.Utils.showLmvToolsAndPanels(viewer)
                    })
                }
            }
          }
          const btn1 = document.createElement('button');
          btn1.innerHTML = "rectangle"
          btn1.type = "button"
          btn1.setAttribute("style","background-color:#363636;margin:10px 5px 5px 20px;")
          btn1.onclick = function () {
            debugger
            // alert("btn clicked")
             var htmldiv = document.getElementById('markup-panel');

            if(htmldiv){
                var arrowdiv = document.getElementById('rectMarkup');
                if(arrowdiv) {
                      viewer.loadExtension("Autodesk.Viewing.MarkupsCore").then((ext) => {
                        ext.enterEditMode();
                        this.markupType = "rectangle";
                        this.modeRectangle = new Autodesk.Viewing.Extensions.Markups.Core.EditModeRectangle(ext);
                        ext.changeEditMode(this.modeRectangle);
                       Autodesk.Viewing.Extensions.Markups.Core.Utils.showLmvToolsAndPanels(viewer)
                    })
                }
            }
          }
          // const textbtn = document.createTextNode("Arrow");
          // btn.appendChild(textbtn);
          this.treeContainer.appendChild(btn);
          this.treeContainer.appendChild(btn1);
    
          this.buildTree();
        }
      }
      class AdnModelStructurePanelExtension extends Autodesk.Viewing.Extension {
        constructor( viewer, options ) {
          super( viewer, options );
    
          this.panel = null;
          this.createUI = this.createUI.bind( this );
          this.onToolbarCreated = this.onToolbarCreated.bind( this );
          this.modeCloud;
          this.modeRectangle;
          this.modeText;
          this.modeArrow;
          this.modePencil;
        }
    
        onToolbarCreated() {
          this.viewer.removeEventListener(
            Autodesk.Viewing.TOOLBAR_CREATED_EVENT,
            this.onToolbarCreated
          );
    
          this.createUI();
        }
    
        createUI() {

          const viewer = this.viewer;
    
          const modelStructurePanel = new AdnModelStructurePanel( viewer, 'Edit Markup' );
    
          viewer.addPanel( modelStructurePanel );
          this.panel = modelStructurePanel;
    
          const markupButton = new Autodesk.Viewing.UI.Button( 'toolbar-adnMarkupTool' );
          const subToolbar = new Autodesk.Viewing.UI.ControlGroup( 'toolbar-adn-tools' );
          subToolbar.addControl( markupButton );
          this.subToolbar = subToolbar;
    
          viewer.toolbar.addControl( this.subToolbar );

          markupButton.onClick = function() {
            debugger
            // modelStructurePanel.setVisible(!modelStructurePanel.isVisible());

            // const settingTools = viewer.toolbar.getControl('settingTools')
            // settingTools.removeControl('toolbar-modelStructureTool');
            // settingTools.removeControl('toolbar-fullscreenTool')
            
            //arrow markup
            const arrowMarkup = new Autodesk.Viewing.UI.Button('toolbar-adnArrowTool');
            arrowMarkup.onClick = function() {
              var htmldiv = document.getElementById('markup-panel');

              if(htmldiv){
                  var arrowdiv = document.getElementById('arrowMarkup');
                  if(arrowdiv) {
                        viewer.loadExtension("Autodesk.Viewing.MarkupsCore").then((ext) => {
                          ext.enterEditMode();
                          this.markupType = "arrow";
                          this.modeArrow = new Autodesk.Viewing.Extensions.Markups.Core.EditModeArrow(ext);
                          ext.changeEditMode(this.modeArrow);
                          Autodesk.Viewing.Extensions.Markups.Core.Utils.showLmvToolsAndPanels(viewer)
                      })
                  }
              }
            };
            arrowMarkup.addClass('ArrowExtensionIcon')
            arrowMarkup.setToolTip('Arrow')
  
            //cloud markup
            const cloudMarkup = new Autodesk.Viewing.UI.Button('toolbar-adncloudTool');
            cloudMarkup.onClick = function() {
              var clouddiv = document.getElementById('cloudMarkup');
              if(clouddiv) {
                viewer.loadExtension("Autodesk.Viewing.MarkupsCore").then((ext) => {
                  ext.enterEditMode();
                  this.markupType = "cloud";
                  this.modeCloud = new Autodesk.Viewing.Extensions.Markups.Core.EditModeCloud(ext);
                  ext.changeEditMode(this.modeCloud);
                  // Autodesk.Viewing.Extensions.Markups.Core.Utils.showLmvToolsAndPanels(viewer)
                })
              }
            };
            cloudMarkup.addClass('CloudExtensionIcon')
            cloudMarkup.setToolTip('cloud')

            //text markup
            const textMarkup = new Autodesk.Viewing.UI.Button('toolbar-adnTextTool');
            textMarkup.onClick = function() {
              var textdiv = document.getElementById('textMarkup');
              if(textdiv) {
                viewer.loadExtension("Autodesk.Viewing.MarkupsCore").then((ext) => {
                  ext.enterEditMode();
                  this.markupType = "text";
                  this.modeText = new Autodesk.Viewing.Extensions.Markups.Core.EditModeText(ext);
                  ext.changeEditMode(this.modeText);
                  // Autodesk.Viewing.Extensions.Markups.Core.Utils.showLmvToolsAndPanels(viewer)
                })
              }
            };
            textMarkup.addClass('TextExtensionIcon')
            textMarkup.setToolTip('text')

            //rectangle markup
            const rectMarkup = new Autodesk.Viewing.UI.Button('toolbar-adnRectTool');
            rectMarkup.onClick = function() {
              var rectdiv = document.getElementById('rectMarkup');
              if(rectdiv) {
                viewer.loadExtension("Autodesk.Viewing.MarkupsCore").then((ext) => {
                  ext.enterEditMode();
                  this.markupType = "rectangle";
                  this.modeRectangle = new Autodesk.Viewing.Extensions.Markups.Core.EditModeRectangle(ext);
                  ext.changeEditMode(this.modeRectangle);
                  // Autodesk.Viewing.Extensions.Markups.Core.Utils.showLmvToolsAndPanels(viewer)
                })
              }
            };
            rectMarkup.addClass('RectExtensionIcon')
            rectMarkup.setToolTip('rectangle')

            //pencil markup
            const pencilMarkup = new Autodesk.Viewing.UI.Button('toolbar-adnPencilTool');
            pencilMarkup.onClick = function() {
              var pencildiv = document.getElementById('pencilMarkup');
                if(pencildiv) {
                  viewer.loadExtension("Autodesk.Viewing.MarkupsCore").then((ext) => {
                    ext.enterEditMode();
                    this.markupType = "pencil";
                    this.modePencil = new Autodesk.Viewing.Extensions.Markups.Core.EditModeFreehand(ext);
                    ext.changeEditMode(this.modePencil);
                  })
                }
              };
            pencilMarkup.addClass('PencilTool')
            pencilMarkup.setToolTip('pencil')

            //cancel button
            const cancelbtn = new Autodesk.Viewing.UI.Button('cancel-btn');
            cancelbtn.container.innerHTML = "cancel"
            cancelbtn.onClick = function() {
              subToolbar.removeControl(arrowMarkup);
              subToolbar.removeControl(cloudMarkup);
              subToolbar.removeControl(textMarkup);
              subToolbar.removeControl(rectMarkup);
              subToolbar.removeControl(pencilMarkup);
              subToolbar.removeControl(cancelbtn)
              subToolbar.removeControl(savebtn)
              subToolbar.addControl(markupButton)
             
            };
            cancelbtn.addClass('cancelbtn')
            cancelbtn.setToolTip('cancel')

            //save button
            const savebtn = new Autodesk.Viewing.UI.Button('save-btn');
            savebtn.container.innerHTML = "save"
            savebtn.onClick = function() {

                      
              };
              savebtn.addClass('savebtn')
              savebtn.setToolTip('save')
            
           
            subToolbar.addControl(arrowMarkup);
            subToolbar.addControl(cloudMarkup);
            subToolbar.addControl(textMarkup);
            subToolbar.addControl(rectMarkup);
            subToolbar.addControl(pencilMarkup);
            subToolbar.addControl(cancelbtn);
            subToolbar.addControl(savebtn);
            subToolbar.removeControl(markupButton)

            this.subToolbar = subToolbar;
            Autodesk.Viewing.Extensions.Markups.Core.Utils.showLmvToolsAndPanels(subToolbar)
            viewer.toolbar.addControl(this.subToolbar);

          };
          markupButton.addClass('MarkupExtensionIcon')
          markupButton.setToolTip( 'Markup' );
          

          modelStructurePanel.addVisibilityListener(function( visible ) {
            if( visible )
              viewer.onPanelVisible( modelStructurePanel, viewer );
    
            markupButton.setState( visible ? Autodesk.Viewing.UI.Button.State.ACTIVE : Autodesk.Viewing.UI.Button.State.INACTIVE );
          });
        }
    
        load() {
          if( this.viewer.toolbar ) {
            // Toolbar is already available, create the UI
            this.createUI();
          } else {
            // Toolbar hasn't been created yet, wait until we get notification of its creation
            this.viewer.addEventListener(
              Autodesk.Viewing.TOOLBAR_CREATED_EVENT,
              this.onToolbarCreated
            );
          }
    
          return true;
        }
    
        unload() {
          if( this.panel ) {
            this.panel.uninitialize();
            delete this.panel;
            this.panel = null;
          }
    
          if( this.subToolbar ) {
            this.viewer.toolbar.removeControl( this.subToolbar );
            delete this.subToolbar;
            this.subToolbar = null;
          }
    
          return true;
        }
      }
    
      Autodesk.Viewing.theExtensionManager.registerExtension( 'Autodesk.ADN.ModelStructurePanel', AdnModelStructurePanelExtension );

})();


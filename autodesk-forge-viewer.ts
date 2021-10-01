declare const Autodesk: any;

export class AutodeskForgeViewer {
  public static viewer: any;
  public static accessToken = null;
  public static testDiv = null;
  public static toggle = false;
  public static modeArrow:any;
  public static modeRectangle:any;
  public static modePencil:any;
  public static modeCloud:any;
  public static modeText:any;
  public static setColor:any;
  public static setStroke:any;
  public static markupType:any;
  public static markupsStringData:any;
  public static options = {
    env: 'Local',
    // getAccessToken: getForgeToken
  };

  public static getOptions() {
    let options = {
      env: 'AutodeskProduction',
      getAccessToken: (onSuccess: any) => {
        AutodeskForgeViewer.getAccessToken(onSuccess);
      },
      useADP: false,
      useConsolidation: true,
    };
    return options;
  }

  public static getAccessToken(onSuccess: any) {
    onSuccess(AutodeskForgeViewer.accessToken, 2400);
  }

  public static load3DViewer(svfUrl: any) {
    var config3d = {
      extensions:['Autodesk.ADN.ModelStructurePanel'],
      // disabledExtensions: { measure: true, explode: true}
    }
    var htmlDiv = document.getElementById('viwerContainer');

    if (AutodeskForgeViewer.viewer) {
      AutodeskForgeViewer.loadDocument(svfUrl);
      return;
    }

    Autodesk.Viewing.Initializer(this.options, () => {
      debugger

      AutodeskForgeViewer.viewer = new Autodesk.Viewing.GuiViewer3D(htmlDiv,config3d);
      if (!AutodeskForgeViewer.viewer) {
        console.error(
          'Failed to create a Viewer: WebGL not supported. Before Start.'
        );
        return;
      }

      var startedCode = AutodeskForgeViewer.viewer.start();
      if (startedCode > 0) {
        console.error('Failed to create a Viewer: WebGL not supported.');
        return;
      }
      console.log('Initialization complete, loading a model next...');
      AutodeskForgeViewer.viewer.loadModel(
        svfUrl,
        AutodeskForgeViewer.onDocumentLoadSuccess.bind(this),
        // AutodeskForgeViewer.onDocumentLoadFailure.bind(this)
      );
      // AutodeskForgeViewer.viewer
      //   .loadExtension('Autodesk.Viewing.MarkupsCore')
      //   .then(function () {});
      // AutodeskForgeViewer.viewer.loadExtension('Autodesk.Viewing.MarkupsGui');

      // AutodeskForgeViewer.viewer.loadExtension()

      // AutodeskForgeViewer.loadDocument(svfUrl);
    });
    // Autodesk.Viewing.Extensions.Markups.Core.Utils.showLmvToolsAndPanels(AutodeskForgeViewer.viewer)
  }
  public static unloadViewer() {
    if (AutodeskForgeViewer.viewer != null) {
      // $("#test").html(AutodeskForgeViewer.testDiv);
      AutodeskForgeViewer.viewer.finish();
      AutodeskForgeViewer.viewer = null;
      Autodesk.Viewing.shutdown();
      // AutodeskForgeViewer.initParam();
    }
    return;
  }

  public static loadDocument(svfUrl: any) {
    // console.log('Loading Model.....');
    // console.log('Model url .. : ' + svfUrl);
    // Autodesk.Viewing.Document.load(svfUrl,AutodeskForgeViewer.onDocumentLoadSuccess.bind(this),AutodeskForgeViewer.onDocumentLoadFailure.bind(this));
  }

  public static onDocumentLoadSuccess(viewerDocument: any) {
    console.log('success call');
    var defaultModel = viewerDocument.getRoot().getDefaultGeometry();
    AutodeskForgeViewer.viewer.loadDocumentNode(viewerDocument, defaultModel);
  }

  public static onDocumentLoadFailure() {
    console.error('Failed fetching Forge manifest');
  }

  public static selectArrow() {
    AutodeskForgeViewer.viewer.loadExtension("Autodesk.Viewing.MarkupsCore").then((ext:any) => {
      ext.enterEditMode();
      this.markupType = "arrow";
      this.modeArrow = new Autodesk.Viewing.Extensions.Markups.Core.EditModeArrow(ext);
      ext.changeEditMode(this.modeArrow);
    })
  }
  public static selectText() {
    AutodeskForgeViewer.viewer.loadExtension("Autodesk.Viewing.MarkupsCore").then((ext:any) => {
      ext.enterEditMode();
      this.markupType = "text";
      this.modeText = new Autodesk.Viewing.Extensions.Markups.Core.EditModeText(ext);
      ext.changeEditMode(this.modeText);
     Autodesk.Viewing.Extensions.Markups.Core.Utils.showLmvToolsAndPanels(AutodeskForgeViewer.viewer)
    })
  }
  public static selectRectangle(){
    AutodeskForgeViewer.viewer.loadExtension("Autodesk.Viewing.MarkupsCore").then((ext:any) => {
      ext.enterEditMode();
      this.markupType = "rectangle";
      this.modeRectangle = new Autodesk.Viewing.Extensions.Markups.Core.EditModeRectangle(ext);
      ext.changeEditMode(this.modeRectangle);
     Autodesk.Viewing.Extensions.Markups.Core.Utils.showLmvToolsAndPanels(AutodeskForgeViewer.viewer)
    })
  }

  public static selectPencil(){
    AutodeskForgeViewer.viewer.loadExtension("Autodesk.Viewing.MarkupsCore").then((ext:any) => {
      ext.enterEditMode();
      this.markupType = "pencil";
      this.modePencil = new Autodesk.Viewing.Extensions.Markups.Core.EditModeFreehand(ext);
      ext.changeEditMode(this.modePencil);
     Autodesk.Viewing.Extensions.Markups.Core.Utils.showLmvToolsAndPanels(AutodeskForgeViewer.viewer)
    })
  }

  public static selectCloud(){
    AutodeskForgeViewer.viewer.loadExtension("Autodesk.Viewing.MarkupsCore").then((ext:any) => {
      ext.enterEditMode();
      this.markupType = "cloud";
      this.modeCloud = new Autodesk.Viewing.Extensions.Markups.Core.EditModeCloud(ext);
      ext.changeEditMode(this.modeCloud);
    //  Autodesk.Viewing.Extensions.Markups.Core.Utils.showLmvToolsAndPanels(AutodeskForgeViewer.viewer)
    })
  }

  public static setStyle() {
    AutodeskForgeViewer.viewer.loadExtension("Autodesk.Viewing.MarkupsCore").then((ext:any) => {
      ext.enterEditMode();
      let styleAttributes = ['stroke-width', 'stroke-color', 'stroke-opacity'];
      let nsu = Autodesk.Viewing.Extensions.Markups.Core.Utils;
      let styleObject = nsu.createStyle(styleAttributes, ext);
      styleObject['stroke-color'] = 'yellow';
      styleObject['stroke-width'] = 20;
      ext.setStyle(styleObject);
    //  Autodesk.Viewing.Extensions.Markups.Core.Utils.showLmvToolsAndPanels(AutodeskForgeViewer.viewer)
    })
  }
  public static saveMarkup() {
    let self = this;
    AutodeskForgeViewer.viewer.loadExtension("Autodesk.Viewing.MarkupsCore").then((markupCore:any) => {
      const markupExtension1 = AutodeskForgeViewer.viewer.getExtension("Autodesk.Viewing.MarkupsCore");
      // After user has created markups, get the data for further storage.
      self.markupsStringData = markupExtension1.generateData();
      
      // Erase all markups onscreen, then load markups back onto the view
      markupCore.clear();
      markupCore.enterViewMode(); //very imp
      markupCore.loadMarkups(self.markupsStringData,"Layer_1")
      markupCore.showMarkups("Layer_1");
    })
  }
  public static cancel() {

  }
}

declare const Autodesk: any;

export class AutodeskForgeViewer {
  public static viewer: any;
  public static accessToken = null;
  public static testDiv = null;
  public static toggle = false;
  public static options = {
    env: 'Local'
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
    var htmlDiv = document.getElementById('viwerContainer');

    if (AutodeskForgeViewer.viewer) {
      AutodeskForgeViewer.loadDocument(svfUrl);
      return;
    }

    Autodesk.Viewing.Initializer(this.options, () => {
      debugger;

      AutodeskForgeViewer.viewer = new Autodesk.Viewing.GuiViewer3D(htmlDiv);
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
      AutodeskForgeViewer.viewer.loadModel(svfUrl,AutodeskForgeViewer.onDocumentLoadSuccess.bind(this),AutodeskForgeViewer.onDocumentLoadFailure.bind(this))
      AutodeskForgeViewer.viewer.loadExtension("Autodesk.Viewing.MarkupsCore").then(function () { })
      AutodeskForgeViewer.viewer.loadExtension("Autodesk.Viewing.MarkupsGui")
      // AutodeskForgeViewer.loadDocument(svfUrl);
    });
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
    debugger
    console.log('success call');
    var defaultModel = viewerDocument.getRoot().getDefaultGeometry();
    AutodeskForgeViewer.viewer.loadDocumentNode(viewerDocument, defaultModel);
  }

  public static onDocumentLoadFailure() {
    console.error('Failed fetching Forge manifest');
  }
}

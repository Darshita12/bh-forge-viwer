import { Component } from '@angular/core';
import { AutodeskForgeViewer } from './autodesk-viewer/autodesk-forge-viewer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'forge-viewer';
  Autodesk: any;
  viewer: any;
  options = {
    env: 'Local',
    api: 'derivativeV2', // TODO: for models uploaded to EMEA change this option to 'derivativeV2_EU'
    // getAccessToken: getForgeToken
  };

  constructor() {}

  ngOnInit() {
    this.follow();
  }
  // public static getOptions() {
  //   let options = {
  //     env: 'AutodeskProduction',
  //     getAccessToken: (onSuccess: any) => {
  //       AutodeskForgeViewer.getAccessToken(onSuccess);
  //     },
  //     useADP: false,
  //     useConsolidation: true,
  //   };
  //   return options;
  // }
  // public static getAccessToken(onSuccess: any) {
  //   onSuccess(AutodeskForgeViewer.accessToken, 2400);
  // }

  follow() {
    debugger;
    // let self = this;
    // const svfUrl = 'https://petrbroz.s3-us-west-1.amazonaws.com/svf-samples/sports-car/0.svf';

    // var htmlDiv = document.getElementById('viwerContainer');

    // if (self.viewer) {
    //   this.loadDocument(svfUrl);
    //   return;
    // }

    // self.Autodesk.Viewing.Initializer(this.options, () => {
    //   debugger;
    //   self.viewer = new self.Autodesk.Viewing.GuiViewer3D(htmlDiv);
    //   if (!self.viewer) {
    //     console.error(
    //       'Failed to create a Viewer: WebGL not supported. Before Start.'
    //     );
    //     return;
    //   }

    //   var startedCode = self.viewer.start();
    //   if (startedCode > 0) {
    //     console.error('Failed to create a Viewer: WebGL not supported.');
    //     return;
    //   }
    //   console.log('Initialization complete, loading a model next...');
    //   this.loadDocument(svfUrl);
    // });

    AutodeskForgeViewer.load3DViewer('https://monarch-test.s3.ap-south-1.amazonaws.com/51/worktable/2125/output/1/result.svf');
  }
  //https://monarch-test.s3.ap-south-1.amazonaws.com/51/worktable/2125/output/1/result.svf


  // unloadViewer() {
  //   let self = this;
  //   if (self.viewer != null) {
  //     // $("#test").html(AutodeskForgeViewer.testDiv);
  //     self.viewer.finish();
  //     self.viewer = null;
  //     self.Autodesk.Viewing.shutdown();
  //     // self.initParam();
  //   }
  //   return;
  // }

  // loadDocument(svfUrl: any) {
  //   let self = this;
  //   console.log('Loading Model.....');
  //   console.log('Model url .. : ' + svfUrl);

  //   self.Autodesk.Viewing.Document.load(
  //     svfUrl,
  //     this.onDocumentLoadSuccess.bind(this),
  //     this.onDocumentLoadFailure.bind(this)
  //   );
  // }
  // onDocumentLoadSuccess(viewerDocument: any) {
  //   let self = this;
  //   var spinners = document.getElementsByClassName('forge-spinner');
  //   if (spinners.length > 0) {
  //     for (let index = 0; index < spinners.length; index++) {
  //       spinners[index].children[1].setAttribute(
  //         'src',
  //         'https://t360.tarrison.com/assets//img/Tarrison_360-B-Horiz.png'
  //       );
  //     }
  //   }
  //   var defaultModel = viewerDocument.getRoot().getDefaultGeometry();

  //   self.viewer.loadDocumentNode(viewerDocument, defaultModel);
  // }
  // onDocumentLoadFailure() {
  //   console.error('Failed fetching Forge manifest');
  // }
}

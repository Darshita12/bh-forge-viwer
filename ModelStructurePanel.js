class ModelStructurePanel extends Autodesk.Viewing.UI.DockingPanel {
    
    constructor(viewer, title, options) {
        options = options || {};

          //Height adjustment for scroll container, offset to height of the title bar and footer by default.
        if (!options.heightAdjustment)
            options.heightAdjustment = 70;

        if (!options.marginTop)
            options.marginTop = 0;

        if (!options.left)
            options.left = false;

        super(viewer.container, viewer.container.id + 'AdnModelStructurePanel', title, options);

        this.container.classList.add('adn-docking-panel');
        this.container.classList.add('adn-model-structure-panel');
        this.createScrollContainer(options);
        console.log(options,this.options);
        this.viewer = viewer;
        this.options = options;
        this.uiCreated = false;

        this.addVisibilityListener((show) => {
            if (!show) return;

            if (!this.uiCreated)
                this.createUI();
            //this.sizeToContent(this.container);
        });
    }
    hasTask(model, dbId, matches) {
        return new Promise(function (resolve, reject) {
            const instanceTree = model.getData().instanceTree;

            model.getProperties(dbId, function (result) {
                const nodeName = instanceTree.getNodeName(dbId);
                const hasChildren = instanceTree.getChildCount(dbId) > 0;

                if (!result.properties || hasChildren)
                    return resolve();

                //for (let i = 0; i < result.properties.length; ++i) {
                const prop = result.properties[0];
                //check if we have a match
                if (!nodeName.includes("RPC") ) {
                    return resolve();
                }

                let match = matches.find(node => node.text == prop.displayValue);

                if (!match) {
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

                    matches.push(match);
                } else {
                    match.children.push({
                        id: dbId,
                        text: nodeName
                    });
                }
                //}

                return resolve();
            }, function () {
                return reject();
            });
        });
    }

    executeTaskOnModelTree(model, task) {
        const taskResults = [];

        function _executeTaskOnModelTreeRec(dbId) {
            instanceTree.enumNodeChildren(dbId,
                function (childId) {
                    taskResults.push(task(model, childId));
                    _executeTaskOnModelTreeRec(childId);
                });
        }

        //get model instance tree and root component
        const instanceTree = model.getData().instanceTree;
        const rootId = instanceTree.getRootId();

        _executeTaskOnModelTreeRec(rootId);

        return taskResults;
    }

    buildTree() {
        const viewer = this.viewer;

        viewer.getObjectTree(() => {
            const matches = [];
            const taskThunk = (model, dbId) => {
                return this.hasTask(
                    model, dbId, matches);
            };
            const taskResults = this.executeTaskOnModelTree(
                viewer.model,
                taskThunk
            );
            Promise.all(taskResults)
                .then(() => {
                    console.log('Found ' + matches.length + ' matches');
                    console.log(matches);

                    $(this.treeContainer)
                        .on('select_node.jstree', function (e, data) {
                            //console.log(e, data);
                            if (!data) return;

                            let dbIds = [];
                            viewer.clearSelection();

                            if (data.node.id.contains('mat-')) {
                                dbIds = data.node.children.map(child => parseInt(child));

                            } else {
                                const dbId = parseInt(data.node.id);
                                dbIds = [dbId];
                            }

                            viewer.select(dbIds);
                            viewer.fitToView(dbIds);
                        })
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
            function (code, msg) {
                console.error(code, msg);
            });
    }

    createUI() {
        debugger
        this.uiCreated = true;

        const div = document.createElement('div');

        const treeDiv = document.createElement('div');
        div.appendChild(treeDiv);
        this.treeContainer = treeDiv;

        this.scrollContainer.appendChild(div);

        this.buildTree();
    }
}
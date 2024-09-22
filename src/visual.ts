"use strict";
import powerbi from "powerbi-visuals-api";
import DataView = powerbi.DataView;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import * as React from "react";
import * as ReactDOM from "react-dom";
import BarChart from "./BarChart";
import "./../style/visual.less";

export class Visual implements IVisual {
    private target: HTMLElement;
    private reactRoot: React.ReactElement<any>; 

    constructor(options: VisualConstructorOptions) {
        this.target = options.element;
        this.renderReactComponent([]);
    }

    public update(options: VisualUpdateOptions) {
        if (options.dataViews && options.dataViews[0]) {
            const dataView: DataView = options.dataViews[0];

            const categories = dataView.categorical.categories[0].values; 
            const values = dataView.categorical.values[0].values; 

            const filteredData = categories.map((category: any, index: number) => {
                return {
                    name: category,
                    percentage: values[index] as number 
                };
            });

            this.renderReactComponent(filteredData);
        } else {
            this.clear();
        }
    }

    private clear() {
        this.renderReactComponent([]);
    }

    private renderReactComponent(filteredData: any) {
        this.reactRoot = React.createElement(BarChart, { filteredData });
        ReactDOM.render(this.reactRoot, this.target);
    }
}

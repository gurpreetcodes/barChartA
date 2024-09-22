import * as React from "react";
export interface BarData {
    name: string;
    percentage: number;
}
interface Props {
    filteredData: BarData[];
}
declare const BarChart: React.FC<Props>;
export default BarChart;

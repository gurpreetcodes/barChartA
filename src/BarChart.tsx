import * as React from "react";
import * as d3 from "d3";

export interface BarData {
    name: string;
    percentage: number;
}

interface Props {
    filteredData: BarData[];
}

const BarChart: React.FC<Props> = ({ filteredData }) => {
    const svgRef = React.useRef<SVGSVGElement | null>(null);
    const [color, setColor] = React.useState("gray");
    const [minRange, setMinRange] = React.useState<number>(0);
    const [maxRange, setMaxRange] = React.useState<number>(100);

    React.useEffect(() => {
        if (!filteredData.length || !svgRef.current) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove(); 

        const margin = { top: 20, right: 30, bottom: 40, left: 40 };
        const width = 500 - margin.left - margin.right;
        const height = Math.max(5, (filteredData.length * 30) - margin.top - margin.bottom); 

        const x = d3.scaleLinear()
            .domain([0, d3.max(filteredData, d => d.percentage) || 100]) 
            .range([0, width]);

        const y = d3.scaleBand()
            .domain(filteredData.map(d => d.name))
            .range([0, height])
            .padding(0.1);

        const g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        g.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

        g.append("g")
            .attr("class", "y-axis")
            .call(d3.axisLeft(y));

        g.selectAll(".bar")
            .data(filteredData)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", 0)
            .attr("y", (d: BarData) => y(d.name)!);

       
        g.selectAll(".bar")
            .attr("width", (d: BarData) => x(d.percentage))
            .attr("height", y.bandwidth())
            .attr("fill", (d: BarData) => {
                if (d.percentage >= minRange && d.percentage <= maxRange) {
                    return color;
                }
                return "gray"; 
            });

   
        g.selectAll(".bar-text")
            .data(filteredData)
            .enter().append("text")
            .attr("class", "bar-text")
            .attr("x", d => x(d.percentage) + 5) 
            .attr("y", d => y(d.name)! + y.bandwidth() / 2) 
            .attr("dy", ".35em") // Adjust vertical position
            .text(d => (y.bandwidth() > 10 ? d.name : ''));

      
        g.selectAll(".bar")
            .on("mouseover", function(event: MouseEvent, d: BarData) {
                const tooltip = d3.select("body").append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0);

                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(d.name)
                    .style("left", (event.pageX + 5) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function() {
                d3.select(".tooltip").remove();
            });

    }, [filteredData, color, minRange, maxRange]);

    return (
        <div className="chart-container">
            <svg ref={svgRef} className="chart-svg" />
            <div className="inputs-container">
                <input
                    type="text"
                    placeholder="Enter color"
                    value={color}
                    onChange={e => setColor(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Min Range"
                    value={minRange}
                    onChange={e => setMinRange(Number(e.target.value))}
                />
                <input
                    type="number"
                    placeholder="Max Range"
                    value={maxRange}
                    onChange={e => setMaxRange(Number(e.target.value))}
                />
            </div>
        </div>
    );
};

export default BarChart;

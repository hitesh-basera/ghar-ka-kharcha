import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, OnDestroy, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-d3-chart',
  standalone: true,
  imports: [],
  templateUrl: './d3-chart.component.html',
  styleUrl: './d3-chart.component.scss',
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class D3ChartComponent implements OnInit,OnDestroy {
data = [10, 20, 30, 40, 50];
constructor(private elementRef: ElementRef){}
ngOnInit(): void {
  // Initialize D3.js chart within the component's native element
  const svg = d3.select(this.elementRef.nativeElement).select('.chart')
    .append('svg')
    .attr('width', 400)
    .attr('height', 200);
    
    svg.selectAll('rect')
      .data(this.data)
      .enter()
      .append('rect')
      .attr('x', (d, i) => i * 40)
      .attr('y', (d) => 200 - d)
      .attr('width', 30)
      .attr('height', (d) => d)
      .style('fill', 'blue');
}
ngOnDestroy(): void {
  console.log('Clean up D3.js chart when component is destroyed');
  d3.select(this.elementRef.nativeElement).select('.chart').selectAll('*').remove();
}
}

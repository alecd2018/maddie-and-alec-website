import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IEvent } from 'app/shared/model/event.model';
import { AccountService } from 'app/core/auth/account.service';
import { EventService } from './event.service';

import * as d3 from 'd3';

@Component({
  selector: 'jhi-event',
  templateUrl: './event.component.html',
  styleUrls: ['event.scss']
})
export class EventComponent implements OnInit, OnDestroy {
  events: IEvent[];
  currentAccount: any;
  eventSubscriber: Subscription;

  constructor(
    protected eventService: EventService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  loadAll() {
    this.eventService
      .query()
      .pipe(
        filter((res: HttpResponse<IEvent[]>) => res.ok),
        map((res: HttpResponse<IEvent[]>) => res.body)
      )
      .subscribe(
        (res: IEvent[]) => {
          this.events = res;
          this.drawTimeline();
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInEvents();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IEvent) {
    return item.id;
  }

  registerChangeInEvents() {
    this.eventSubscriber = this.eventManager.subscribe('eventListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }

  drawTimeline() {
    function resetted(svg, zoom) {
      svg
        .transition()
        .duration(750)
        .call(zoom.transform, d3.zoomIdentity);
    }

    const width = 1600;
    const height = 400;
    const margin = { left: 45, right: 15, top: 15, bottom: 15 };

    const svg = d3
      .select('#area')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);

    // const parseTime = d3.timeParse('%m/%d/%y');
    const formatTime = d3.timeFormat('%m/%d/%y');

    const rawData = this.events;
    // eslint-disable-next-line no-console
    console.log(rawData);

    let minDate = new Date('12/30/2099');
    let maxDate = new Date('01/01/1990');
    const eventData = [];
    const travelData = [];
    const livingData = [];
    rawData.forEach(event => {
      const date = new Date(event['startDate']);
      const endDate = new Date(event['endDate']);
      const desc = event['description'];
      const type = event['type'];
      if (type === 'event') {
        eventData.push({ date, desc, type });
      } else if (type === 'Travel') {
        travelData.push({ date, endDate, desc, type });
      } else {
        livingData.push({ date, endDate, desc, type });
      }

      if (date < minDate) {
        minDate = date;
      }
      if (date > maxDate) {
        maxDate = date;
      }
    });

    // eslint-disable-next-line no-console
    console.log(travelData);

    svg
      .append('defs')
      .append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('width', width)
      .attr('height', height);
    const xScale = d3
      .scaleLinear()
      .domain([minDate, maxDate])
      .range([0, width]);

    const yScale = d3
      .scalePoint()
      .domain(['Living', 'Travel', 'Event'])
      .range([height - 75, 75]);

    const travelColor = d3.scaleOrdinal(d3.schemeCategory10);
    const livingColor = d3.scaleOrdinal(d3.schemeCategory10);

    const xAxis = d3.axisBottom(xScale);

    const yAxis = d3.axisRight(yScale);

    const view = svg
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      .attr('clip-path', 'url(#clip)');

    const gX = svg
      .append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis.tickFormat(formatTime));

    svg
      .append('g')
      .attr('class', 'axis axis--y')
      .call(yAxis);

    const circles = view
      .selectAll('.event')
      .data(eventData)
      .enter()
      .append('circle')
      .attr('class', 'event')
      .attr('cx', d => xScale(d.date))
      .attr('cy', d => yScale('Event'))
      .attr('fill', '#2ca02c')
      .attr('fill-opacity', 0.6)
      .attr('r', 8);

    const travel = view
      .selectAll('.travel')
      .data(travelData)
      .enter()
      .append('rect')
      .attr('class', 'travel')
      .attr('x', d => xScale(d.date))
      .attr('y', d => yScale('Travel'))
      .attr('width', d => xScale(d.endDate) - xScale(d.date))
      .attr('height', 20)
      .attr('fill', function(d, i) {
        return travelColor(i);
      })
      .attr('fill-opacity', 0.6);

    const living = view
      .selectAll('.living')
      .data(travelData)
      .enter()
      .append('rect')
      .attr('class', 'living')
      .attr('x', d => xScale(d.date))
      .attr('y', d => yScale('Travel'))
      .attr('width', d => xScale(d.endDate) - xScale(d.date))
      .attr('height', 20)
      .attr('fill', function(d, i) {
        return livingColor(i);
      })
      .attr('fill-opacity', 0.6);

    const zoom = d3
      .zoom()
      .scaleExtent([1, 20])
      .translateExtent([[0, 0], [width, height]])
      .on('zoom', () => {
        gX.call(xAxis.scale(d3.event.transform.rescaleX(xScale)));
        // gY.call(yAxis.scale(d3.event.transform.rescaleY(y)));

        const newXScale = d3.event.transform.rescaleX(xScale);
        circles.attr('cx', d => newXScale(d.date));
        travel.attr('x', d => newXScale(d.date)).attr('width', d => newXScale(d.endDate) - newXScale(d.date));
        living.attr('x', d => newXScale(d.date)).attr('width', d => newXScale(d.endDate) - newXScale(d.date));
      });

    // svg.call(zoom);
    svg
      .append('rect')
      .attr('width', width)
      .attr('height', height)
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      .call(zoom);

    d3.select('button').on('click', resetted(svg, zoom));

    // var startDate = new Date("08/20/17");
    // var startDateRect = svg.append("rect")
    //     .attr("width", "3")
    //     .attr("height", height)
    //     .attr("x", xScale(startDate))
    //     .attr("y", 0)
    //     .attr('fill', 'blue');

    // }

    // requestData();
  }
}

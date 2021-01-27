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

    function getWidth(scale, d) {
      const diff = scale(d.endDate) - scale(d.date);
      if (diff === 0) {
        return 10;
      } else {
        return diff;
      }
    }

    function handleMouseOver() {
      const event = d3.select(this);
      event
        .attr('opacity', 1)
        .attr('stroke', 'black')
        .attr('stroke-width', '1');
    }

    function handleMouseOut() {
      const event = d3.select(this);
      event.attr('opacity', 0.6).attr('stroke', 'none');
    }

    const width = 1600;
    const height = 400;
    const margin = { left: 65, right: 15, top: 15, bottom: 15 };

    const formatTime = d3.timeFormat('%m/%d/%y');

    const rawData = this.events;

    let minDate = new Date('12/30/2099');
    let maxDate = new Date('01/01/1990');
    const eventData = [];
    const eventTypes = [];
    rawData.forEach(event => {
      const id = event['id'];
      const date = new Date(event['startDate']);
      const endDate = new Date(event['endDate']);
      const desc = event['description'];
      const type = event['type'];

      eventData.push({ id, date, endDate, desc, type });

      if (!eventTypes.includes(type)) {
        eventTypes.push(type);
      }

      if (date < minDate) {
        minDate = date;
      }
      if (date > maxDate) {
        maxDate = date;
      }
    });

    const xScale = d3
      .scaleLinear()
      .domain([minDate, maxDate])
      .range([0, width]);

    const yScale = d3
      .scalePoint()
      .domain(eventTypes)
      .range([height - 75, 75]);

    const xAxis = d3.axisBottom(xScale);

    const yAxis = d3.axisRight(yScale);

    const svg = d3
      .select('#area')
      .append('svg')
      .attr('class', 'grabbable')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);

    const gX = svg
      .append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + height + ')')
      .style('path', 'display: none;')
      .call(xAxis.tickFormat(formatTime));

    svg
      .append('g')
      .attr('class', 'axis axis--y')
      .attr('transform', 'translate(0,' + margin.top + ')')
      .call(yAxis);

    const zoom = d3
      .zoom()
      .scaleExtent([0, 10])
      .on('zoom', () => {
        gX.call(xAxis.scale(d3.event.transform.rescaleX(xScale)));

        const newXScale = d3.event.transform.rescaleX(xScale);
        d3.selectAll('.events')
          .attr('x', d => newXScale(d.date))
          .attr('width', d => getWidth(newXScale, d));
      });

    svg.call(zoom);

    const defs = svg.append('defs');

    defs
      .append('style')
      .attr('id', 'styles')
      .attr('type', 'text/css');
    const div = document.getElementById('styles');

    div.innerHTML +=
      '.axis path {display: none;}\
                      .tick line {display: none;}\
                      .grabbable {cursor: grab;}\
                      .grabbable:active {cursor: grabbing;}\
                      .tick text {\
                        font-size:1.6em;\
                      }\
                      .events:hover {\
                        cursor: pointer;\
                      }';

    const eventColor = d3.scaleOrdinal(d3.schemeCategory10);

    svg
      .append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', width)
      .attr('height', height);

    const chartBody = svg
      .append('g')
      .attr('clip-path', 'url(#clip)')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    chartBody
      .selectAll('.events')
      .data(eventData)
      .enter()
      .append('rect')
      .attr('class', 'events')
      .attr('x', d => xScale(d.date))
      .attr('y', d => yScale(d.type))
      .attr('width', d => getWidth(xScale, d))
      .attr('height', 20)
      .attr('fill', function(d, i) {
        return eventColor(eventTypes.indexOf(d.type));
      })
      .attr('fill-opacity', 0.6)
      .attr('pointer-events', 'all')
      .on('mouseover', handleMouseOver)
      .on('mouseout', handleMouseOut)
      .on('click', d => {
        const elmnt = document.getElementById('event_' + d.id);
        elmnt.scrollIntoView({ behavior: 'smooth' });
        $('#event_' + d.id)
          .parent()
          .addClass('highlighted');
        setTimeout(function() {
          $('#event_' + d.id)
            .parent()
            .removeClass('highlighted');
        }, 2000);
      });

    d3.select('button').on('click', resetted(svg, zoom));
  }
}
